import "server-only";

import { fetchStatsApi, BASEBALL_CONFIG } from "@/lib/baseball/api";

import type { TeamId } from "@/contexts/TeamContext";

import { MLBGame, MLBScheduleResponse } from "@/lib/baseball/mlb-types";

const CURRENT_CACHE = 300;
const HISTORICAL_CACHE = 86400;

export async function getTeamSeasonSchedule(
  team: TeamId,
  season: number,
  historical = false,
): Promise<MLBGame[]> {
  const config = BASEBALL_CONFIG[team];

  const response = await fetchStatsApi<MLBScheduleResponse>("/schedule", {
    query: {
      sportId: config.sportId,
      leagueId: config.leagueId ?? undefined,
      teamId: config.teamId,
      season,
      hydrate: "team,linescore,decisions",
    },
    revalidateSeconds: historical ? HISTORICAL_CACHE : CURRENT_CACHE,
  });

  if (!Array.isArray(response.dates)) {
    throw new Error(`Invalid schedule response for ${team}.`);
  }

  return response.dates.flatMap((date) => date.games ?? []);
}

/**
 * Backward compatibility for existing LIDOM callers.
 */
export async function getSeasonSchedule(
  season: number,
  historical = false,
  aguilasOnly = false,
): Promise<MLBGame[]> {
  const response = await fetchStatsApi<MLBScheduleResponse>("/schedule", {
    query: {
      sportId: BASEBALL_CONFIG.aguilas.sportId,
      leagueId: BASEBALL_CONFIG.aguilas.leagueId,
      teamId: aguilasOnly ? BASEBALL_CONFIG.aguilas.teamId : undefined,
      season,
      hydrate: "team,linescore,decisions",
    },
    revalidateSeconds: historical ? HISTORICAL_CACHE : CURRENT_CACHE,
  });

  if (!Array.isArray(response.dates)) {
    throw new Error(`Invalid LIDOM schedule response for ${season}.`);
  }

  return response.dates.flatMap((date) => date.games ?? []);
}

export async function getMLBSeasonSchedule(
  season: number,
  teamId: number = BASEBALL_CONFIG.yankees.teamId,
  historical = false,
): Promise<MLBGame[]> {
  const response = await fetchStatsApi<MLBScheduleResponse>("/schedule", {
    query: {
      sportId: BASEBALL_CONFIG.yankees.sportId,
      teamId,
      season,
      hydrate: "team,linescore,decisions",
    },
    revalidateSeconds: historical ? HISTORICAL_CACHE : CURRENT_CACHE,
  });

  if (!Array.isArray(response.dates)) {
    throw new Error(`Invalid MLB schedule response for ${season}.`);
  }

  return response.dates.flatMap((date) => date.games ?? []);
}
