import "server-only";

import type {
  BaseballStandingsResponse,
  BaseballTeam,
  TeamStanding,
} from "@/types/baseball";

import type { TeamId } from "@/contexts/TeamContext";

import { fetchStatsApi, LIDOM_CONFIG } from "@/lib/baseball/api";

const TIME_ZONE = "America/Santo_Domingo";
const STANDINGS_CACHE = 21600;

const MLB_YANKEES_LEAGUE_ID = 103;

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
  if (value === undefined || value === "") return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

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

function normalizeStanding(record: MLBTeamRecord): TeamStanding | null {
  if (!record.team) return null;

  const team = normalizeTeam(record.team);

  if (!team) return null;

  return {
    rank: parseNumber(record.leagueRank),
    team,
    wins: parseNumber(record.leagueRecord?.wins),
    losses: parseNumber(record.leagueRecord?.losses),
    winningPercentage: parseNumber(record.leagueRecord?.pct),
    gamesBack: parseNumber(record.leagueGamesBack),
  };
}

function sortStandings(standings: TeamStanding[]): TeamStanding[] {
  return standings.sort((a, b) => {
    if (a.rank === null) return 1;
    if (b.rank === null) return -1;

    return a.rank - b.rank;
  });
}

export async function getBaseballStandings(
  team: TeamId = "aguilas",
): Promise<BaseballStandingsResponse> {
  const isAguilas = team === "aguilas";

  const season = isAguilas ? getCurrentLidomSeason() : new Date().getFullYear();

  const leagueId = isAguilas ? LIDOM_CONFIG.leagueId : MLB_YANKEES_LEAGUE_ID;

  const response = await fetchStatsApi<MLBStandingsResponse>("/standings", {
    query: {
      sportId: isAguilas ? LIDOM_CONFIG.sportId : 1,
      leagueId,
      season,
      standingsTypes: "regularSeason",
    },
    revalidateSeconds: STANDINGS_CACHE,
  });

  if (!Array.isArray(response.records)) {
    throw new Error("Invalid standings response.");
  }

  const standings = sortStandings(
    response.records
      .flatMap((record) => record.teamRecords ?? [])
      .map(normalizeStanding)
      .filter((standing): standing is TeamStanding => standing !== null),
  );

  const updatedAt =
    response.records.find((record) => record.lastUpdated)?.lastUpdated ?? null;

  return {
    data: {
      season,
      leagueId,
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
