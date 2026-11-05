import "server-only";

import type { BaseballGame, BaseballGamesResponse } from "@/types/baseball";
import type { TeamId } from "@/contexts/TeamContext";

import { getCurrentLidomSeason } from "@/lib/baseball/dates";
import {
  getMLBSeasonSchedule,
  getSeasonSchedule,
} from "@/lib/baseball/schedule";
import { normalizeGame } from "@/lib/baseball/normalize";

import {
  TEAM_IDS,
  isTeamGame,
  newestFirst,
  selectTeamGame,
} from "@/lib/baseball/game-selection";

const MAX_HISTORICAL_SEASONS = 10;

function getCurrentMLBSeason(): number {
  return new Date().getFullYear();
}

async function getTeamSeasonSchedule(
  team: TeamId,
  season: number,
  historical = false,
): Promise<BaseballGame[]> {
  const rawGames =
    team === "aguilas"
      ? await getSeasonSchedule(season, historical, true)
      : await getMLBSeasonSchedule(season, TEAM_IDS.yankees, historical);

  return rawGames
    .map(normalizeGame)
    .filter(
      (game): game is BaseballGame =>
        game !== null && isTeamGame(game, TEAM_IDS[team]),
    );
}

async function getHistoricalFallback(
  team: TeamId,
  currentSeason: number,
): Promise<BaseballGame | null> {
  for (let offset = 1; offset <= MAX_HISTORICAL_SEASONS; offset++) {
    const season = currentSeason - offset;

    const games = await getTeamSeasonSchedule(team, season, true);

    const latest = selectTeamGame(games, TEAM_IDS[team]);

    if (latest) return latest;
  }

  return null;
}

export async function getBaseballGames(
  team: TeamId = "aguilas",
): Promise<BaseballGamesResponse> {
  const season =
    team === "aguilas" ? getCurrentLidomSeason() : getCurrentMLBSeason();

  const games = await getTeamSeasonSchedule(team, season);

  const completedGames = games
    .filter((game) => game.status.type === "final")
    .sort(newestFirst);

  let selectedGame = selectTeamGame(completedGames, TEAM_IDS[team]);

  if (!selectedGame) {
    selectedGame = await getHistoricalFallback(team, season);

    if (selectedGame) {
      completedGames.push(selectedGame);
    }
  }

  return {
    selectedGame,
    games: completedGames.sort(newestFirst),

    metadata: {
      fetchedAt: new Date().toISOString(),
      dataUpdatedAt: null,
      isStale: false,
    },
  };
}
