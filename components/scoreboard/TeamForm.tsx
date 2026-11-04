import { BaseballGame } from "@/types/baseball";

interface TeamFormProps {
  games: BaseballGame[];
}

const AGUILAS_TEAM_ID = 667;

export default function TeamForm({ games }: TeamFormProps) {
  const results = games
    .filter((game) => game.status.type === "final")
    .filter(
      (game) =>
        game.home.team.id === AGUILAS_TEAM_ID ||
        game.away.team.id === AGUILAS_TEAM_ID,
    )
    .sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
    )
    .flatMap((game) => {
      const isHome = game.home.team.id === AGUILAS_TEAM_ID;

      const aguilasScore = isHome
        ? game.home.score?.runs
        : game.away.score?.runs;

      const opponentScore = isHome
        ? game.away.score?.runs
        : game.home.score?.runs;

      // Never count incomplete or missing scores.
      if (
        typeof aguilasScore !== "number" ||
        typeof opponentScore !== "number"
      ) {
        return [];
      }

      return [
        {
          won: aguilasScore > opponentScore,
        },
      ];
    })
    .slice(0, 5);

  const wins = results.filter((result) => result.won).length;
  const losses = results.length - wins;

  const percentage =
    results.length > 0 ? ((wins / results.length) * 100).toFixed(0) : "—";

  return (
    <section className="mt-8 rounded-2xl border border-[#3a3a3a] bg-[#242424] p-4">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
          Rendimiento reciente
        </p>

        <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-xl font-bold uppercase">
          Últimos 5 partidos
        </h2>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-oswald)] text-3xl font-bold text-white">
            {wins}-{losses}
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-widest text-[#999999]">
            Ganados - Perdidos
          </p>
        </div>

        <div className="text-right">
          <p className="font-[family-name:var(--font-oswald)] text-3xl font-bold text-[#f5c400]">
            {percentage}
            {percentage !== "—" ? "%" : ""}
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-widest text-[#999999]">
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
          <p className="text-xs text-[#999999]">
            No hay resultados recientes disponibles.
          </p>
        )}
      </div>
    </section>
  );
}
