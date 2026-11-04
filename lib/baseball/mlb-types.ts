/**
 * External MLB StatsAPI response types.
 */

export interface MLBTeam {
  id?: number;
  name?: string;
  abbreviation?: string;
}

export interface MLBSide {
  team?: MLBTeam;
  score?: number;
}

export interface MLBInning {
  num?: number;
  home?: { runs?: number };
  away?: { runs?: number };
}

export interface MLBGame {
  gamePk?: number;
  gameDate?: string;
  officialDate?: string;

  status?: {
    abstractGameState?: string;
    detailedState?: string;
  };

  teams?: {
    away?: MLBSide;
    home?: MLBSide;
  };

  venue?: {
    name?: string;
  };

  linescore?: {
    currentInning?: number;
    inningState?: string;
    innings?: MLBInning[];
  };
}

export interface MLBScheduleResponse {
  dates?: {
    games?: MLBGame[];
  }[];
}
