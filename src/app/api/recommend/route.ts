import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { redis, redisUncached } from "@/services/cache";
import { Candidate, CandidateResponse } from "@/types/camel-index";
import { buildSmartPool } from "@/lib/recs/build-smart-pool";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { sha1Base64url } from "@/lib/recs/sha1";

// --- Config -------------------------------------------------------------
const MODEL = "gpt-4o-mini" as const; // switch to gpt-4.1-mini if preferred

// --- Types --------------------------------------------------------------

type Body = z.infer<typeof BodySchema>;

type RankResult = {
  id: number;
  score: number;
  reason: string;
};

const BodySchema = z.object({
  tags: z.array(z.string()).min(1),
  filters: z.object({
    media: z.enum(["movie", "series", "either"]),
    years: z.tuple([z.number(), z.number()]),
    runtime_max: z.number().int().positive(),
    language: z.array(z.string()).min(1),
    avoid: z.array(z.string()).optional(),
  }),
});
// --- Helpers ------------------------------------------------------------
function buildPrompt(tags: string[], pool: Candidate[]) {
  return [
    {
      role: "system" as const,
      content:
        "You are GlimpseRanker, an assistant that selects movies and TV shows that best fit the user's mood, vibe, and hobbies. The popularity is important. Return EXACTLY 15 unique results in JSON only: [{id:int, score:0-1, reason:str≤25w}].",
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        MOOD_TAGS: tags,
        CANDIDATES: pool,
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
  if (!pool) {
    return NextResponse.json(
      { error: "Candidate pool empty. Try again later." },
      { status: 503 }
    );
  }

  // 3) Build prompt & call OpenAI
  const messages = buildPrompt(tags, pool);
  let toolCall;
  let ranked;
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
    if (!results.length) {
      throw new Error("No Results");
    }
    ranked = results;
  } catch {
    return NextResponse.json(
      { error: "Malformed LLM response" },
      { status: 500 }
    );
  }

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

async function getOpenAiCompletions(messages: ChatCompletionMessageParam[]) {
  let toolCall;
  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    tools: [
      {
        type: "function",
        function: {
          name: "return_recs",
          parameters: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    score: { type: "number" },
                    reason: { type: "string" },
                  },
                  required: ["id", "score", "reason"],
                },
                minItems: 15,
                maxItems: 15,
              },
            },
            required: ["results"],
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "return_recs" } },
    messages,
  });

  toolCall = completion.choices[0]?.message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("LLM returned no tool call");
  }
  return toolCall;
}
