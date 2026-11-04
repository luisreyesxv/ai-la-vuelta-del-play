import "server-only";

import { fetchStatsApi, LIDOM_CONFIG } from "@/lib/baseball/api";

import { MLBGame, MLBScheduleResponse } from "@/lib/baseball/mlb-types";

const CURRENT_CACHE = 300;
const HISTORICAL_CACHE = 86400;

export async function getSeasonSchedule(
  season: number,
  historical = false,
  aguilasOnly = false,
): Promise<MLBGame[]> {
  const response = await fetchStatsApi<MLBScheduleResponse>("/schedule", {
    query: {
      sportId: LIDOM_CONFIG.sportId,
      leagueId: LIDOM_CONFIG.leagueId,

      teamId: aguilasOnly ? LIDOM_CONFIG.aguilasTeamId : undefined,

      season,
      hydrate: "team,linescore",
    },

    revalidateSeconds: historical ? HISTORICAL_CACHE : CURRENT_CACHE,
  });

  if (!Array.isArray(response.dates)) {
    throw new Error(`Invalid schedule response for season ${season}.`);
  }

  return response.dates.flatMap((date) => date.games ?? []);
}
