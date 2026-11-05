import { BaseballGame } from "@/types/baseball";

import GameStatus from "@/components/scoreboard/GameStatus";
import TeamScore from "@/components/scoreboard/TeamScore";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameCardProps {
  game: BaseballGame;
  teamId: number;
}

export default function GameCard({ game, teamId }: GameCardProps) {
  const isAguilasHome = game.home.team.id === teamId;
  const isAguilasAway = game.away.team.id === teamId;
  const { t } = useLanguage();

  const opponent = isAguilasHome ? game.away.team.name : game.home.team.name;

  const formattedDate = new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(game.gameDate));

  return (
    <article className="overflow-hidden rounded-2xl border border-primary-muted  bg-gradient-to-br from-(--color-background-gradient) to-surface-overlay">
      {/* GAME INFORMATION */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <GameStatus
            status={game.status.type}
            description={game.status.description}
          />

          <span className="text-[10px] font-bold uppercase tracking-widest text-team-secondary">
            {t("lastGame")}
          </span>
        </div>

        <p className="mt-2 text-xs capitalize text-muted">{formattedDate}</p>

        <p className="mt-1 text-xs text-muted">
          Rival: <span className="font-bold text-white">{opponent}</span>
        </p>
      </div>

      {/* SCOREBOARD */}
      <div className="p-4">
        <div className="space-y-2">
          <TeamScore
            data={game.away}
            isAguilas={isAguilasAway}
            isHome={false}
          />

          <TeamScore data={game.home} isAguilas={isAguilasHome} isHome={true} />
        </div>
      </div>

      {/* VENUE */}
      {game.venue && (
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-xs text-muted">📍 {game.venue}</p>
        </div>
      )}
    </article>
  );
}
