import "server-only";

import {
  BaseballStandingsResponse,
  BaseballTeam,
  TeamStanding,
} from "@/types/baseball";

import { fetchStatsApi, LIDOM_CONFIG } from "@/lib/baseball/api";

/* ---------------------------------------
   CONFIGURATION
--------------------------------------- */

const TIME_ZONE = "America/Santo_Domingo";
const STANDINGS_CACHE = 21600;

/* ---------------------------------------
   MLB RESPONSE TYPES
--------------------------------------- */

interface MLBStandingTeam {
  id?: number;
  name?: string;
  abbreviation?: string;
}

interface MLBTeamRecord {
  team?: MLBStandingTeam;
  leagueRank?: string | number;
  leagueRecord?: {
    wins?: number;
    losses?: number;
    pct?: string;
  };
  leagueGamesBack?: string;
}

interface MLBStandingRecord {
  lastUpdated?: string;
  teamRecords?: MLBTeamRecord[];
}

interface MLBStandingsResponse {
  records?: MLBStandingRecord[];
}

/* ---------------------------------------
   HELPERS
--------------------------------------- */

function getCurrentLidomSeason(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const year = Number(values.year);
  const month = Number(values.month);

  return month >= 10 ? year : year - 1;
}

function parseNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

/* ---------------------------------------
   TEAM NORMALIZATION
--------------------------------------- */

function normalizeTeam(team: MLBStandingTeam): BaseballTeam | null {
  if (typeof team.id !== "number" || !team.name) {
    return null;
  }

  return {
    id: team.id,
    name: team.name,
    abbreviation: team.abbreviation ?? null,
    logoUrl: null,
  };
}

/* ---------------------------------------
   STANDING NORMALIZATION
--------------------------------------- */

function normalizeStanding(record: MLBTeamRecord): TeamStanding | null {
  if (!record.team) {
    return null;
  }

  const team = normalizeTeam(record.team);

  if (!team) {
    return null;
  }

  return {
    rank: parseNumber(record.leagueRank),

    team,

    wins: parseNumber(record.leagueRecord?.wins),

    losses: parseNumber(record.leagueRecord?.losses),

    winningPercentage: parseNumber(record.leagueRecord?.pct),

    gamesBack: parseNumber(record.leagueGamesBack),
  };
}

/* ---------------------------------------
   PUBLIC API
--------------------------------------- */

export async function getBaseballStandings(): Promise<BaseballStandingsResponse> {
  const season = getCurrentLidomSeason();

  const response = await fetchStatsApi<MLBStandingsResponse>("/standings", {
    query: {
      leagueId: LIDOM_CONFIG.leagueId,
      season,
      standingsTypes: "regularSeason",
    },
    revalidateSeconds: STANDINGS_CACHE,
  });

  if (!Array.isArray(response.records)) {
    throw new Error("Invalid LIDOM standings response.");
  }

  const standings = response.records
    .flatMap((record) => record.teamRecords ?? [])
    .map(normalizeStanding)
    .filter((standing): standing is TeamStanding => standing !== null)
    .sort((a, b) => {
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;

      return a.rank - b.rank;
    });

  const updatedAt =
    response.records.find((record) => record.lastUpdated)?.lastUpdated ?? null;

  return {
    data: {
      season,
      leagueId: LIDOM_CONFIG.leagueId,
      standings,
      updatedAt,
    },

    metadata: {
      fetchedAt: new Date().toISOString(),
      dataUpdatedAt: updatedAt,
      isStale: false,
    },
  };
}
