import {
  BaseballGame,
  BaseballTeam,
  GameStatusType,
  Inning,
  InningHalf,
} from "@/types/baseball";

import { MLBGame, MLBTeam } from "@/lib/baseball/mlb-types";

export function normalizeTeam(team: MLBTeam): BaseballTeam {
  return {
    id: team.id!,
    name: team.name!,
    abbreviation: team.abbreviation ?? null,
    logoUrl: null,
  };
}

export function normalizeStatus(
  detailed?: string,
  abstract?: string,
): GameStatusType {
  const state = (detailed ?? "").toLowerCase();
  const general = (abstract ?? "").toLowerCase();

  if (state.includes("delay")) return "delayed";
  if (state.includes("postpon")) return "postponed";
  if (state.includes("suspend")) return "suspended";
  if (state.includes("cancel")) return "cancelled";

  if (general === "live" || state.includes("in progress")) {
    return "live";
  }

  if (
    general === "final" ||
    state === "game over" ||
    state.startsWith("final")
  ) {
    return "final";
  }

  if (general === "preview" || state.includes("scheduled")) {
    return "scheduled";
  }

  return "unknown";
}

function normalizeHalf(state?: string): InningHalf {
  const value = (state ?? "").toLowerCase();

  if (value.includes("top")) return "top";
  if (value.includes("bottom")) return "bottom";

  return "unknown";
}

function normalizeInning(linescore?: MLBGame["linescore"]): Inning | null {
  if (!linescore) return null;

  const state = linescore.inningState ?? "";

  return {
    current:
      typeof linescore.currentInning === "number"
        ? linescore.currentInning
        : null,

    half: normalizeHalf(state),

    isComplete: /end|middle/i.test(state),

    scores: (linescore.innings ?? [])
      .filter((inning) => typeof inning.num === "number")
      .map((inning) => ({
        inning: inning.num!,
        awayRuns:
          typeof inning.away?.runs === "number" ? inning.away.runs : null,
        homeRuns:
          typeof inning.home?.runs === "number" ? inning.home.runs : null,
      })),
  };
}

export function normalizeGame(game: MLBGame): BaseballGame | null {
  const away = game.teams?.away;
  const home = game.teams?.home;

  if (
    typeof game.gamePk !== "number" ||
    !game.gameDate ||
    typeof away?.team?.id !== "number" ||
    typeof home?.team?.id !== "number" ||
    !away.team.name ||
    !home.team.name
  ) {
    return null;
  }

  return {
    gamePk: game.gamePk,
    gameDate: game.gameDate,
    officialDate: game.officialDate ?? null,
    status: {
      type: normalizeStatus(
        game.status?.detailedState,
        game.status?.abstractGameState,
      ),
      description: game.status?.detailedState ?? null,
    },

    decisions: {
      winner: game.decisions?.winner?.fullName
        ? {
            id: game.decisions.winner.id ?? 0,
            fullName: game.decisions.winner.fullName,
          }
        : null,

      loser: game.decisions?.loser?.fullName
        ? {
            id: game.decisions.loser.id ?? 0,
            fullName: game.decisions.loser.fullName,
          }
        : null,
    },

    away: {
      team: normalizeTeam(away.team),
      score: {
        runs:
          typeof away.score === "number"
            ? away.score
            : (game.linescore?.teams?.away?.runs ?? null),

        hits: game.linescore?.teams?.away?.hits ?? null,

        errors: game.linescore?.teams?.away?.errors ?? null,
      },
    },

    home: {
      team: normalizeTeam(home.team),
      score: {
        runs:
          typeof home.score === "number"
            ? home.score
            : (game.linescore?.teams?.home?.runs ?? null),

        hits: game.linescore?.teams?.home?.hits ?? null,

        errors: game.linescore?.teams?.home?.errors ?? null,
      },
    },

    inning: normalizeInning(game.linescore),
    venue: game.venue?.name ?? null,
    updatedAt: null,
  };
}
