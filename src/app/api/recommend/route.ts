import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { redis, redisUncached } from "@/services/cache";
import { Candidate, CandidateResponse } from "@/types/camel-index";
import { buildSmartPool } from "@/lib/recs/build-smart-pool";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { sha1Base64url } from "@/lib/recs/sha1";
import { hydrateKeywords } from "@/lib/recs/keywords";
import { uniqueBy } from "@/lib/utils";

// --- Config -------------------------------------------------------------
const MODEL = "gpt-4o-mini" as const; // switch to gpt-4.1-mini if preferred

// --- Types --------------------------------------------------------------

type Body = z.infer<typeof BodySchema>;

export type RankResult = {
  id: number;
  score: number;
  reason: string;
};

const BodySchema = z.object({
  tags: z.array(z.string()).min(1),
  // descriptions: z.array(z.string()),
  filters: z.object({
    media: z.enum(["movie", "series", "either"]),
    years: z.tuple([z.number(), z.number()]),
    runtime_max: z.number().int().positive(),
    language: z.array(z.string()).min(1),
    avoid: z.array(z.string()).optional(),
    interests: z.array(z.string()),
  }),
});
// --- Helpers ------------------------------------------------------------
export function buildPrompt(
  tags: string[],
  interests: string[],
  pool: Candidate[]
): ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `
You are **GlimpseRanker**.

TASK
・Choose the 15 strongest matches for the user's mood, vibe, and interests **from the CANDIDATES array I give you.**
・If two titles are equally relevant, prefer the one with the higher pop-score (voteAverage × voteCount).
・No duplicate IDs; include a healthy mix of movies / series when both types are allowed.
・Heavily prioritize interests if the array is not empty

OUTPUT
Return one line of pure JSON with this exact shape:
{
  "results": [
    {
      "id": 123 // unique integer,
      "score": 0.92,
      "reason": "why in ≤ 25 words"
    },
    … (15 total)
  ]
}

RULES
1 score ∈ 0-1 (1 = perfect fit)
2 reason ≤ 25 English words, no newline, no quotes inside
3 No extra keys, no trailing commas, no markdown
4 NO DUPLICATES, every id and reason must be unique
5 Every result must have a unique id, score, and reason, if not, regenerate
      `.trim(),
    },
    {
      role: "user",
      content: JSON.stringify({
        MOOD_TAGS: tags,
        CANDIDATES: pool,
        INTERESTS: interests,
      }),
    },
  ];
}

// --- Handler ------------------------------------------------------------
export const runtime = "edge"; // lower latency

export async function POST(req: Request) {
  // 1) Validate body
  const json = (await req.json()) as unknown;
  const parse = BodySchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { tags, filters } = parse.data as Body;

  // ----- build a stable hash for the tag payload -----
  const TAG_KEY = await sha1Base64url(JSON.stringify(tags));

  const RESULT_KEY = `match:${TAG_KEY}`;
  const cachedRanked = await redisUncached.get<CandidateResponse[]>(RESULT_KEY);
  console.log("result_key: " + RESULT_KEY);
  console.log("cachedRanked: " + cachedRanked);
  if (cachedRanked) {
    return new Response(JSON.stringify(cachedRanked), {
      headers: {
        "Content-Type": "application/json",
        // 10 min CDN cache, 24 h stale-while-revalidate
        "Cache-Control":
          "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  }

  console.log("tags: ", tags);
  const pool = await buildSmartPool(tags, filters); // add filters param
  console.log(uniqueBy(pool).length);
  await hydrateKeywords(pool); // fills keywords in-place
  if (!pool) {
    return NextResponse.json(
      { error: "Candidate pool empty. Try again later." },
      { status: 503 }
    );
  }

  // 3) Build prompt & call OpenAI
  const interests = filters.interests;
  const messages = buildPrompt(tags, interests, pool);
  let toolCall;
  let ranked: RankResult[];
  try {
    toolCall = await getOpenAiCompletions(messages);
  } catch (err) {
    console.error("OpenAI error", err);
    return NextResponse.json({ error: "Upstream LLM error" }, { status: 502 });
  }
  try {
    const { results } = JSON.parse(toolCall.function.arguments) as {
      results: RankResult[];
    };
    ranked = results;

    // ranked = dedupeAndTopUp(ranked, pool, 15); // ← ensures uniqueness
    // const seen = new Set<number>();
    // ranked = results.filter(r => {
    //   if (seen.has(r.id)) return false;
    //   seen.add(r.id);
    //   return true;
    // });
    //
    // let i = 0;
    // while (ranked.length < 15 && i < pool.length) {
    //   const c = pool[i++]!;                      // ← non-null assertion
    //   if (!seen.has(c.id)) {
    //     ranked.push({ id: c.id, score: 0.4, reason: "additional pick" });
    //     seen.add(c.id);
    //   }
    // }
  } catch {
    return NextResponse.json(
      { error: "Malformed LLM response" },
      { status: 500 }
    );
  }
  // if we lost some due to duplicates, top-up from the scored pool:

  // 5) Join extra metadata for the client cards
  const byId = Object.fromEntries(pool.map((c) => [c.id, c]));
  const payload: CandidateResponse[] = ranked.slice(0, 15).map((r) => {
    const meta = byId[r.id];
    return {
      id: r.id,
      score: r.score,
      reason: r.reason,
      title: meta?.title ?? "Unknown",
      posterPath: meta?.posterPath ?? null,
      voteAverage: meta?.voteAverage ?? 0,
      voteCount: meta?.voteCount ?? 0,
      mediaType: meta?.mediaType ?? "tv",
      year: meta?.year ?? 0,
      overview: meta?.overview ?? null,
      keywords: meta?.keywords ?? [],
    };
  });

  payload.forEach((c) =>
    console.log("title: " + c.title + "\n" + "keywords: " + c.keywords)
  );
  await redis.set(RESULT_KEY, payload, { ex: 60 * 60 * 24 }); // 24 h

  return NextResponse.json(payload);
}

const RETURN_RECS_TOOL: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "return_recs",
    parameters: {
      type: "object",
      properties: {
        results: {
          type: "array",
          minItems: 1,
          maxItems: 15,
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              score: { type: "number" },
              reason: { type: "string" },
            },
            required: ["id", "score", "reason"],
          },
          uniqueItems: true, // whole objects must differ
        },
      },
      required: ["results"],
    },
  },
};
async function getOpenAiCompletions(messages: ChatCompletionMessageParam[]) {
  let toolCall;
  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    tools: [RETURN_RECS_TOOL],
    tool_choice: { type: "function", function: { name: "return_recs" } },
    messages,
  });

  toolCall = completion.choices[0]?.message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("LLM returned no tool call");
  }
  return toolCall;
}
