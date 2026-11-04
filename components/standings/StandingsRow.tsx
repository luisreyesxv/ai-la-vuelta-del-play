import { TeamStanding } from "@/types/baseball";

interface StandingRowProps {
  standing: TeamStanding;
}

export default function StandingsRow({ standing }: StandingRowProps) {
  const isAguilas = standing.team.id === 667;

  return (
    <div
      className={`grid grid-cols-[36px_minmax(0,1fr)_36px_36px_48px] items-center gap-2 border-b border-white/5 px-3 py-4 ${
        isAguilas ? "bg-[#f5c400]/10" : "bg-transparent"
      }`}
    >
      <span
        className={`font-[family-name:var(--font-oswald)] text-lg font-bold ${
          isAguilas ? "text-[#f5c400]" : "text-[#999999]"
        }`}
      >
        {standing.rank ?? "—"}
      </span>

      <div className="min-w-0">
        <p
          className={`truncate text-sm font-extrabold ${
            isAguilas ? "text-[#f5c400]" : "text-white"
          }`}
        >
          {standing.team.name}
        </p>

        {isAguilas && (
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#e9a900]">
            Nuestro equipo
          </span>
        )}
      </div>

      <span className="text-center font-[family-name:var(--font-oswald)] text-base font-bold text-white">
        {standing.wins ?? "—"}
      </span>

      <span className="text-center font-[family-name:var(--font-oswald)] text-base font-bold text-white">
        {standing.losses ?? "—"}
      </span>

      <span className="text-right font-[family-name:var(--font-oswald)] text-base font-bold text-white">
        {standing.winningPercentage !== null
          ? standing.winningPercentage.toFixed(3).replace(/^0/, "")
          : "—"}
      </span>
    </div>
  );
}
