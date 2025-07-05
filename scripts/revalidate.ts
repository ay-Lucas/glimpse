import { getBaseUrl } from "@/lib/utils";
import pLimit from "p-limit";
import {
  fetchDiscoverMovieIds,
  fetchDiscoverTvIds,
  fetchTopPeopleIds,
} from "@/app/(media)/actions";

const STATIC_PATHS = ["/", "/discover"];
const DYNAMIC_PATHS_WITH_ISR_FETCHES = ["/signin"]; // caches TMDB fetch for backdrops in (auth) layout

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
} as const;

export async function revalidate() {
  const baseUrl = getBaseUrl();

  const tvPaths = (await fetchDiscoverTvIds(options)).map(
    (item) => `/tv/${item.id}`
  );
  const tvSeasonPaths = tvPaths.map((tvPath) => `${tvPath}/seasons`);
  const tvCreditsPaths = tvPaths.map((tvPath) => `${tvPath}/credits`);
  const moviePaths = (await fetchDiscoverMovieIds(options)).map(
    (item) => `/movie/${item.id}`
  );
  const movieCreditsPaths = moviePaths.map(
    (moviePath) => `${moviePath}/credits`
  );
  const personPaths = (await fetchTopPeopleIds(options)).map(
    (item) => `/person/${item.id}`
  );

  // Prevent duplicates with Set
  const allPaths = Array.from(
    new Set([
      ...STATIC_PATHS,
      ...DYNAMIC_PATHS_WITH_ISR_FETCHES,
      ...tvPaths,
      ...tvSeasonPaths,
      ...tvCreditsPaths,
      ...moviePaths,
      ...movieCreditsPaths,
      ...personPaths,
    ])
  );

  await revalidatePaths(allPaths, baseUrl);
  await warmCache(baseUrl, allPaths);
  return true;
}

async function revalidatePaths(paths: string[], baseUrl: string) {
  try {
    console.log("Revalidating paths...");
    console.log(`${baseUrl}/api/revalidate`);

    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cache-warm-secret": process.env.REVALIDATE_SECRET!,
        "user-agent": "revalidater/1.0",
      },
      body: JSON.stringify({
        secret: process.env.REVALIDATE_SECRET,
        paths: paths,
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const json: { revalidated: string[] } = await response.json();
    let tvPathsNum = 0,
      tvSeasonPathsNum = 0,
      moviePathsNum = 0,
      personPathsNum = 0;
    let unmatchedPaths: string[] = [];

    json?.revalidated.forEach((path) => {
      if (isTvPath(path) && !isTvSeasonPath(path)) tvPathsNum++;
      else if (isTvSeasonPath(path)) tvSeasonPathsNum++;
      else if (isMoviePath(path)) moviePathsNum++;
      else if (isPersonPath(path)) personPathsNum++;
      else unmatchedPaths.push(path);
    });

    console.log("Revalidate response:\n" + JSON.stringify(json, null, 2));
    console.log(
      `Revalidated: \n${tvPathsNum} TV Paths\n${tvSeasonPathsNum} TV Season Paths\n${moviePathsNum} Movie Paths\n${personPathsNum} Person Paths\n${unmatchedPaths.length} Unmatched Paths`
    );
    console.log(
      `Unmatched Paths (${unmatchedPaths.length}):\n` +
        JSON.stringify(unmatchedPaths, null, 2)
    );
  } catch (error) {
    console.error("Backfill + revalidate failed: ", error);
  }
}

async function warmCache(baseUrl: string, paths: string[]) {
  const failures: string[] = [];
  const limit = pLimit(5); // 10 concurrent
  const tasks = paths.map((p) =>
    limit(async () => {
      try {
        const res = await fetch(`${baseUrl}${p}`, {
          method: "HEAD",
          headers: {
            "x-cache-warm-secret": process.env.REVALIDATE_SECRET!,
            "user-agent": "cache-warmer/1.0",
          },
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
      } catch (err) {
        console.error(`Warm cache error for ${baseUrl}${p}:`, err);
        failures.push(p);
      }
    })
  );

  await Promise.all(tasks);

  if (failures.length) {
    throw new Error(`Warm cache had ${failures.length} failures:\n${failures}`);
  } else {
    console.log(`Successfully warmed cache for ${paths.length} paths`);
  }
}

function isTvPath(str: string) {
  return str.startsWith("/tv");
}

function isTvSeasonPath(str: string) {
  return str.startsWith("/tv") && str.endsWith("/seasons");
}

function isMoviePath(str: string) {
  return str.startsWith("/movie");
}

function isPersonPath(str: string) {
  return str.startsWith("/person");
}

// revalidate().then(res => console.log(`Script completed`)).catch(error => console.error(error))
