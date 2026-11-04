import "server-only";

import { BaseballGame, BaseballGamesResponse } from "@/types/baseball";

import { getCurrentLidomSeason } from "@/lib/baseball/dates";

import { getSeasonSchedule } from "@/lib/baseball/schedule";

import { normalizeGame } from "@/lib/baseball/normalize";

import {
  isAguilasGame,
  newestFirst,
  selectAguilasGame,
} from "@/lib/baseball/game-selection";

const MAX_HISTORICAL_SEASONS = 10;

/**
 * Searches previous seasons for the latest completed
 * Águilas game.
 */
async function getHistoricalFallback(
  currentSeason: number,
): Promise<BaseballGame | null> {
  for (let offset = 1; offset <= MAX_HISTORICAL_SEASONS; offset++) {
    const season = currentSeason - offset;

    const rawGames = await getSeasonSchedule(season, true, true);

    const completedGames = rawGames
      .map(normalizeGame)
      .filter(
        (game): game is BaseballGame =>
          game !== null && isAguilasGame(game) && game.status.type === "final",
      )
      .sort(newestFirst);

    const latestGame = completedGames[0];

    if (latestGame) {
      return latestGame;
    }
  }

  return null;
}

/**
 * Returns the latest completed Águilas game.
 *
 * Live and scheduled games are intentionally excluded.
 */
export async function getBaseballGames(): Promise<BaseballGamesResponse> {
  const season = getCurrentLidomSeason();

  const currentRawGames = await getSeasonSchedule(season);

  const currentGames = currentRawGames
    .map(normalizeGame)
    .filter(
      (game): game is BaseballGame =>
        game !== null && isAguilasGame(game) && game.status.type === "final",
    )
    .sort(newestFirst);

  let selectedGame = selectAguilasGame(currentGames);

  if (!selectedGame) {
    selectedGame = await getHistoricalFallback(season);

    if (selectedGame) {
      currentGames.push(selectedGame);
    }
  }

  return {
    selectedGame,
    games: currentGames.sort(newestFirst),

    metadata: {
      fetchedAt: new Date().toISOString(),
      dataUpdatedAt: null,
      isStale: false,
    },
  };
}
