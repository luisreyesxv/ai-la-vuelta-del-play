import { BaseballGame } from "@/types/baseball";

import { LIDOM_CONFIG } from "@/lib/baseball/api";

import { MLBGame } from "@/lib/baseball/mlb-types";

import { getGameLocalDate } from "@/lib/baseball/dates";

export function isAguilasGame(game: BaseballGame): boolean {
  return (
    game.home.team.id === LIDOM_CONFIG.aguilasTeamId ||
    game.away.team.id === LIDOM_CONFIG.aguilasTeamId
  );
}

export function newestFirst(a: BaseballGame, b: BaseballGame): number {
  return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
}

export function selectAguilasGame(
  games: BaseballGame[],
  rawGames: MLBGame[],
  today: string,
): BaseballGame | null {
  const aguilasGames = games.filter(isAguilasGame).sort(newestFirst);

  if (aguilasGames.length === 0) {
    return null;
  }

  // 1. Live Águilas game.
  const live = aguilasGames.find((game) => game.status.type === "live");

  if (live) return live;

  // 2. Today's Águilas game.
  const todayGame = aguilasGames
    .filter((game) => {
      const raw = rawGames.find((item) => item.gamePk === game.gamePk);

      return (
        raw &&
        getGameLocalDate(raw.gameDate, raw.officialDate) === today &&
        !["final", "cancelled", "postponed"].includes(game.status.type)
      );
    })
    .sort(
      (a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime(),
    )[0];

  if (todayGame) return todayGame;

  // 3. Latest completed Águilas game.
  const completed = aguilasGames.find((game) => game.status.type === "final");

  if (completed) return completed;

  // 4. Most recent available Águilas game.
  return aguilasGames[0];
}
