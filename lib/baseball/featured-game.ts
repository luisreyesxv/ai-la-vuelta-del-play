import "server-only";

import { BaseballGame, FeaturedGameResponse } from "@/types/baseball";

import {
  getCurrentLidomSeason,
  getGameLocalDate,
  getLocalDate,
} from "@/lib/baseball/dates";

import { getSeasonSchedule } from "@/lib/baseball/schedule";

import { normalizeGame } from "@/lib/baseball/normalize";

const AGUILAS_TEAM_ID = 667;

/**
 * Returns yesterday's date in the Dominican Republic.
 */
function getYesterdayLocalDate(): string {
  const today = getLocalDate();

  const date = new Date(`${today}T12:00:00Z`);

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
}

/**
 * Determines whether the Águilas participated in a game.
 */
function isAguilasGame(game: BaseballGame): boolean {
  return (
    game.home.team.id === AGUILAS_TEAM_ID ||
    game.away.team.id === AGUILAS_TEAM_ID
  );
}

/**
 * Determines the official calendar date used for selection.
 *
 * The official date takes priority when supplied.
 * Otherwise, the Dominican local date is calculated
 * from the provider's gameDate timestamp.
 */
function getGameSelectionDate(game: BaseballGame): string {
  return getGameLocalDate(game.gameDate, game.officialDate ?? undefined);
}

/**
 * Final games receive priority.
 *
 * Within each status group, the most recent game
 * is selected first.
 */
function prioritizeGames(a: BaseballGame, b: BaseballGame): number {
  if (a.status.type === "final" && b.status.type !== "final") {
    return -1;
  }

  if (b.status.type === "final" && a.status.type !== "final") {
    return 1;
  }

  return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
}

/**
 * Centralized featured-game selection.
 *
 * Current priority:
 * 1. Águilas game from yesterday.
 * 2. No-game state.
 *
 * Yankees fallback will be implemented separately.
 */
export async function getFeaturedGame(): Promise<FeaturedGameResponse> {
  const targetDate = getYesterdayLocalDate();

  const season = getCurrentLidomSeason();

  const rawGames = await getSeasonSchedule(season);

  const games = rawGames
    .map(normalizeGame)
    .filter((game): game is BaseballGame => game !== null);

  const aguilasGames = games
    .filter(
      (game) =>
        isAguilasGame(game) && getGameSelectionDate(game) === targetDate,
    )
    .sort(prioritizeGames);

  const selectedGame = aguilasGames[0] ?? null;

  return {
    targetDate,

    selectedTeam: selectedGame ? "aguilas" : null,

    selectedGame,

    recapEligible: selectedGame?.status.type === "final",

    selectionReason: selectedGame
      ? "aguilas_played_yesterday"
      : "no_game_yesterday",

    metadata: {
      fetchedAt: new Date().toISOString(),
    },
  };
}
