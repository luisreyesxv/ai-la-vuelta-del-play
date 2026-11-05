import "server-only";

/**
 * La Vuelta Del Play
 * MLB StatsAPI HTTP client
 *
 * This module is server-side only.
 * External provider requests must never originate
 * directly from browser components.
 */

const MLB_STATS_API_BASE_URL = "https://statsapi.mlb.com/api/v1";

/**
 * Confirmed LIDOM identifiers from project testing.
 */
export const LIDOM_CONFIG = {
  sportId: 17,
  leagueId: 131,
  aguilasTeamId: 667,
} as const;

export const BASEBALL_CONFIG = {
  aguilas: {
    sportId: 17,
    leagueId: LIDOM_CONFIG.leagueId,
    teamId: LIDOM_CONFIG.aguilasTeamId,
    timeZone: "America/Santo_Domingo",
  },

  yankees: {
    sportId: 1,
    leagueId: null,
    teamId: 147,
    timeZone: "America/New_York",
  },
} as const;

/**
 * Default request cache duration.
 * Individual callers can override this value.
 */
const DEFAULT_REVALIDATE_SECONDS = 300;

/**
 * Supported query parameter values.
 */
type QueryValue = string | number | boolean | undefined;

export interface StatsApiOptions {
  revalidateSeconds?: number;
  query?: Record<string, QueryValue>;
}

/**
 * Custom API error.
 */
export class StatsApiError extends Error {
  public readonly statusCode: number | null;

  constructor(message: string, statusCode: number | null = null) {
    super(message);

    this.name = "StatsApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Builds a valid MLB StatsAPI URL.
 */
function buildApiUrl(
  endpoint: string,
  query?: Record<string, QueryValue>,
): string {
  if (!endpoint.startsWith("/") || endpoint.startsWith("//")) {
    throw new StatsApiError("Invalid MLB StatsAPI endpoint.");
  }

  const url = new URL(`${MLB_STATS_API_BASE_URL}${endpoint}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Makes a server-side request to MLB StatsAPI.
 *
 * Usage:
 *
 * const data = await fetchStatsApi<ScheduleResponse>(
 *   "/schedule",
 *   {
 *     query: {
 *       sportId: 17,
 *       teamId: 667,
 *       date: "2026-11-03",
 *     },
 *   },
 * );
 */
export async function fetchStatsApi<T>(
  endpoint: string,
  options: StatsApiOptions = {},
): Promise<T> {
  const url = buildApiUrl(endpoint, options.query);

  const revalidateSeconds =
    options.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS;

  if (!Number.isInteger(revalidateSeconds) || revalidateSeconds <= 0) {
    throw new StatsApiError("Cache duration must be a positive integer.");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: revalidateSeconds,
      },
    });
  } catch {
    throw new StatsApiError("Unable to connect to MLB StatsAPI.");
  }

  if (!response.ok) {
    throw new StatsApiError(
      `MLB StatsAPI request failed with status ${response.status}.`,
      response.status,
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new StatsApiError(
      "MLB StatsAPI returned an invalid JSON response.",
      response.status,
    );
  }

  /**
   * Basic response validation.
   * Endpoint-specific validation belongs in the adapters.
   */
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new StatsApiError(
      "MLB StatsAPI returned an unexpected response structure.",
      response.status,
    );
  }

  return data as T;
}
