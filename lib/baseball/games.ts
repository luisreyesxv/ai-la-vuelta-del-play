import "server-only";

import { BaseballGame, BaseballGamesResponse } from "@/types/baseball";

import { LIDOM_CONFIG } from "@/lib/baseball/api";

import { getCurrentLidomSeason, getLocalDate } from "@/lib/baseball/dates";

import { getSeasonSchedule } from "@/lib/baseball/schedule";

import { normalizeGame } from "@/lib/baseball/normalize";

import {
  isAguilasGame,
  newestFirst,
  selectAguilasGame,
} from "@/lib/baseball/game-selection";

const MAX_HISTORICAL_SEASONS = 10;

async function getHistoricalFallback(
  currentSeason: number,
): Promise<BaseballGame | null> {
  for (let offset = 1; offset <= MAX_HISTORICAL_SEASONS; offset++) {
    const season = currentSeason - offset;

    const rawGames = await getSeasonSchedule(season, true, true);

    const games = rawGames
      .map(normalizeGame)
      .filter(
        (game): game is BaseballGame => game !== null && isAguilasGame(game),
      )
      .sort(newestFirst);

    const completed = games.find((game) => game.status.type === "final");

    if (completed) return completed;
  }

  return null;
}

export async function getBaseballGames(): Promise<BaseballGamesResponse> {
  const today = getLocalDate();
  const season = getCurrentLidomSeason();

  const currentRawGames = await getSeasonSchedule(season);

  const currentGames = currentRawGames
    .map(normalizeGame)
    .filter((game): game is BaseballGame => game !== null)
    .sort(newestFirst);

  let selectedGame = selectAguilasGame(currentGames, currentRawGames, today);

  const hasAguilasFinal = currentGames.some(
    (game) => isAguilasGame(game) && game.status.type === "final",
  );

  if (!hasAguilasFinal) {
    const historicalGame = await getHistoricalFallback(season);

    if (historicalGame) {
      currentGames.push(historicalGame);

      selectedGame = selectAguilasGame(currentGames, currentRawGames, today);
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
