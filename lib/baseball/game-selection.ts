import { BaseballGame } from "@/types/baseball";
import { LIDOM_CONFIG } from "@/lib/baseball/api";

/**
 * Returns true when a game involves Águilas Cibaeñas.
 */
export function isAguilasGame(game: BaseballGame): boolean {
  return (
    game.home.team.id === LIDOM_CONFIG.aguilasTeamId ||
    game.away.team.id === LIDOM_CONFIG.aguilasTeamId
  );
}

/**
 * Sorts games from newest to oldest.
 */
export function newestFirst(a: BaseballGame, b: BaseballGame): number {
  return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
}

/**
 * Selects only the latest completed Águilas game.
 *
 * Live, scheduled, postponed, and cancelled games
 * are never eligible for the main scoreboard.
 */
export function selectAguilasGame(games: BaseballGame[]): BaseballGame | null {
  return (
    games
      .filter((game) => isAguilasGame(game) && game.status.type === "final")
      .sort(newestFirst)[0] ?? null
  );
}
