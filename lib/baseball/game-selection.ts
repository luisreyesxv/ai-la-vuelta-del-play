import type { BaseballGame } from "@/types/baseball";
import type { TeamId } from "@/contexts/TeamContext";

export const TEAM_IDS: Record<TeamId, number> = {
  aguilas: 667,
  yankees: 147,
};

export const TEAM_NAMES: Record<TeamId, string> = {
  aguilas: "Águilas Cibaeñas",
  yankees: "New York Yankees",
};

export function isTeamGame(game: BaseballGame, teamId: number): boolean {
  return game.home.team.id === teamId || game.away.team.id === teamId;
}

export function isAguilasGame(game: BaseballGame): boolean {
  return isTeamGame(game, TEAM_IDS.aguilas);
}

export function newestFirst(a: BaseballGame, b: BaseballGame): number {
  return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
}

export function isCompletedGame(game: BaseballGame): boolean {
  return (
    game.status.type === "final" &&
    typeof game.home.score?.runs === "number" &&
    typeof game.away.score?.runs === "number"
  );
}

export function selectTeamGame(
  games: BaseballGame[],
  teamId: number,
): BaseballGame | null {
  return (
    games
      .filter((game) => isTeamGame(game, teamId) && isCompletedGame(game))
      .sort(newestFirst)[0] ?? null
  );
}

export function selectAguilasGame(games: BaseballGame[]): BaseballGame | null {
  return selectTeamGame(games, TEAM_IDS.aguilas);
}
