import "server-only";

import type { BaseballGame, FeaturedGameResponse } from "@/types/baseball";

import {
  getCurrentLidomSeason,
  getGameLocalDate,
  getLocalDate,
} from "@/lib/baseball/dates";

import { getSeasonSchedule } from "@/lib/baseball/schedule";
import { normalizeGame } from "@/lib/baseball/normalize";

import { selectTeamGame, newestFirst, TEAM_IDS } from "./game-selection";

const MAX_HISTORICAL_SEASONS = 10;

function getYesterdayLocalDate(): string {
  const today = getLocalDate();
  const date = new Date(`${today}T12:00:00Z`);

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
}

function getCompletedGames(games: BaseballGame[]): BaseballGame[] {
  return games
    .filter(
      (game) =>
        game.status.type === "final" &&
        game.home.score?.runs !== undefined &&
        game.away.score?.runs !== undefined,
    )
    .sort(newestFirst);
}

async function getHistoricalGame(
  currentSeason: number,
): Promise<BaseballGame | null> {
  for (let offset = 1; offset <= MAX_HISTORICAL_SEASONS; offset++) {
    const season = currentSeason - offset;

    const rawGames = await getSeasonSchedule(season, true, true);

    const games = rawGames
      .map(normalizeGame)
      .filter((game): game is BaseballGame => game !== null);

    const latest = selectTeamGame(games, TEAM_IDS.aguilas);

    if (latest) return latest;
  }

  return null;
}

export async function getFeaturedGame(): Promise<FeaturedGameResponse> {
  const targetDate = getYesterdayLocalDate();
  const season = getCurrentLidomSeason();

  const rawGames = await getSeasonSchedule(season, false, true);

  const games = rawGames
    .map(normalizeGame)
    .filter((game): game is BaseballGame => game !== null);

  const completedGames = getCompletedGames(games);

  // Priority 1: Yesterday's completed game.
  const yesterdayGame =
    completedGames.find(
      (game) =>
        getGameLocalDate(game.gameDate, game.officialDate ?? undefined) ===
        targetDate,
    ) ?? null;

  // Priority 2: Most recent completed game.
  const latestGame = yesterdayGame ?? completedGames[0] ?? null;

  // Priority 3: Historical completed game.
  const selectedGame = latestGame ?? (await getHistoricalGame(season));

  return {
    targetDate,

    selectedTeam: selectedGame ? "aguilas" : null,

    selectedGame,

    recapEligible: selectedGame !== null,

    selectionReason: yesterdayGame
      ? "aguilas_played_yesterday"
      : selectedGame
        ? "latest_completed_game"
        : "no_completed_game",

    metadata: {
      fetchedAt: new Date().toISOString(),
    },
  };
}
