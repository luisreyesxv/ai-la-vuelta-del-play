import { GameTeam } from "@/types/baseball";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeamScoreProps {
  data: GameTeam;
  isAguilas: boolean;
  isHome: boolean;
}

export default function TeamScore({ data, isAguilas, isHome }: TeamScoreProps) {
  const scoreColor = isAguilas ? "text-accent" : "text-white";
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-xl p-3 ${
        isAguilas
          ? "border border-primary-muted  bg-primary/10"
          : "border border-white/5 bg-black/20"
      }`}
    >
      {/* Team and Score */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-extrabold ${
              isAguilas ? "text-accent" : "text-white"
            }`}
          >
            {data.team.name}
          </p>

          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-muted">
            {isHome ? t("homeTeam") : t("awayTeam")}
          </p>
        </div>

        <div
          className={`font-[family-name:var(--font-oswald)] text-4xl font-bold tabular-nums ${scoreColor}`}
        >
          {data.score?.runs ?? "—"}
        </div>
      </div>

      {/* Secondary Statistics */}
      <div className="mt-3 flex justify-center border-t border-white/10 pt-3">
        <div className="flex items-center gap-8 sm:gap-10">
          {[
            { label: "R", value: data.score?.runs },
            { label: "H", value: data.score?.hits },
            { label: "E", value: data.score?.errors },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-[9px] font-bold tracking-widest text-subtle">
                {stat.label}
              </span>

              <span className="text-sm font-bold tabular-nums text--secondary">
                {stat.value ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
