/**
 * La Vuelta Del Play
 * Normalized baseball data models.
 *
 * These types belong to our application.
 * MLB StatsAPI response structures must be converted
 * into these models before reaching React components.
 */

/* ---------------------------------------
   TEAM
--------------------------------------- */

export interface BaseballTeam {
  id: number;
  name: string;
  abbreviation: string | null;
  logoUrl: string | null;
}

/* ---------------------------------------
   GAME STATUS
--------------------------------------- */

export type GameStatusType =
  | "scheduled"
  | "live"
  | "final"
  | "delayed"
  | "postponed"
  | "suspended"
  | "cancelled"
  | "unknown";

/* ---------------------------------------
   GAME SCORE
--------------------------------------- */

export interface GameScore {
  runs: number | null;
  hits: number | null;
  errors: number | null;
}

/* ---------------------------------------
   INNING
--------------------------------------- */

export type InningHalf = "top" | "bottom" | "unknown";

export interface InningScore {
  inning: number;
  awayRuns: number | null;
  homeRuns: number | null;
}

export interface Inning {
  current: number | null;
  half: InningHalf;
  isComplete: boolean;
  scores: InningScore[];
}

/* ---------------------------------------
   GAME TEAM
--------------------------------------- */

export interface GameTeam {
  team: BaseballTeam;
  score: GameScore | null;
}

/* ---------------------------------------
   GAME
--------------------------------------- */

export interface BaseballGame {
  gamePk: number;

  gameDate: string;

  status: {
    type: GameStatusType;
    description: string | null;
  };

  away: GameTeam;
  home: GameTeam;

  inning: Inning | null;

  venue: string | null;

  updatedAt: string | null;
}

/* ---------------------------------------
   STANDINGS
--------------------------------------- */

export interface TeamStanding {
  rank: number | null;

  team: BaseballTeam;

  wins: number | null;
  losses: number | null;

  winningPercentage: number | null;

  gamesBack: number | null;
}

export interface BaseballStandings {
  season: number;
  leagueId: number;

  standings: TeamStanding[];

  updatedAt: string | null;
}

/* ---------------------------------------
   SCHEDULE
--------------------------------------- */

export interface BaseballSchedule {
  date: string;

  games: BaseballGame[];
}

/* ---------------------------------------
   API RESPONSE METADATA
--------------------------------------- */

export interface BaseballDataMetadata {
  fetchedAt: string;

  dataUpdatedAt: string | null;

  isStale: boolean;
}

/* ---------------------------------------
   GAMES API RESPONSE
--------------------------------------- */

export interface BaseballGamesResponse {
  selectedGame: BaseballGame | null;

  games: BaseballGame[];

  metadata: BaseballDataMetadata;
}

/* ---------------------------------------
   STANDINGS API RESPONSE
--------------------------------------- */

export interface BaseballStandingsResponse {
  data: BaseballStandings;

  metadata: BaseballDataMetadata;
}
