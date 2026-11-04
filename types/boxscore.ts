export interface BoxscorePlayer {
  person?: {
    id?: number;
    fullName?: string;
  };

  position?: {
    abbreviation?: string;
  };

  stats?: {
    batting?: {
      atBats?: number;
      runs?: number;
      hits?: number;
      doubles?: number;
      triples?: number;
      homeRuns?: number;
      rbi?: number;
      baseOnBalls?: number;
      strikeOuts?: number;
      stolenBases?: number;
      avg?: string;
      obp?: string;
      slg?: string;
      ops?: string;
    };

    pitching?: {
      inningsPitched?: string;
      hits?: number;
      runs?: number;
      earnedRuns?: number;
      baseOnBalls?: number;
      strikeOuts?: number;
      homeRuns?: number;
      era?: string;
    };
  };
}

export interface BoxscoreTeam {
  players?: Record<string, BoxscorePlayer>;
}

export interface BoxscoreDecision {
  id?: number;
  fullName?: string;
}

export interface GameBoxscore {
  teams?: {
    away?: BoxscoreTeam;
    home?: BoxscoreTeam;
  };

  decisions?: {
    winner?: BoxscoreDecision;
    loser?: BoxscoreDecision;
    save?: BoxscoreDecision;
  };
}
