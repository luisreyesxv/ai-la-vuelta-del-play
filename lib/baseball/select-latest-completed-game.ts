import { BaseballGame } from "@/types/baseball";

export function selectLatestCompletedGame(
  games: BaseballGame[],
): BaseballGame | null {
  const completedGames = games
    .filter((game) => game.status.type === "final")
    .sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
    );

  return completedGames[0] ?? null;
}
