import { BaseballGame } from "@/types/baseball";

interface TeamFormProps {
  games: BaseballGame[];
  teamId: number;
  teamName: string;
}

export default function TeamForm({ games, teamId, teamName }: TeamFormProps) {
  const results = games
    .filter((game) => game.status.type === "final")
    .filter(
      (game) => game.home.team.id === teamId || game.away.team.id === teamId,
    )
    .sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
    )
    .flatMap((game) => {
      const isHome = game.home.team.id === teamId;

      const teamScore = isHome ? game.home.score?.runs : game.away.score?.runs;

      const opponentScore = isHome
        ? game.away.score?.runs
        : game.home.score?.runs;

      if (typeof teamScore !== "number" || typeof opponentScore !== "number") {
        return [];
      }

      return [{ won: teamScore > opponentScore }];
    })
    .slice(0, 5);

  const wins = results.filter((result) => result.won).length;
  const losses = results.length - wins;

  const percentage =
    results.length > 0 ? ((wins / results.length) * 100).toFixed(0) : "—";

  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4">
        <p className="text-lg font-logo font-bold uppercase tracking-widest text-accent">
          Rendimiento reciente
        </p>

        <h2 className="mt-1 font-varsity text-team-secondary text-xl font-bold uppercase">
          Últimos 5 partidos
        </h2>

        <p className="mt-1 text-xs text-muted">{teamName}</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-oswald)] text-3xl font-bold text-white">
            {wins}-{losses}
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
            Ganados - Perdidos
          </p>
        </div>

        <div className="text-right">
          <p className="font-[family-name:var(--font-oswald)] text-3xl font-bold text-accent">
            {percentage}
            {percentage !== "—" ? "%" : ""}
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
            Victorias
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div
              key={index}
              className={`flex h-10 flex-1 items-center justify-center rounded-lg font-extrabold ${
                result.won
                  ? "bg-green-600/20 text-green-400"
                  : "bg-red-600/20 text-red-400"
              }`}
            >
              {result.won ? "W" : "L"}
            </div>
          ))
        ) : (
          <p className="text-xs text-muted">
            No hay resultados recientes disponibles.
          </p>
        )}
      </div>
    </section>
  );
}
