import { BaseballGame } from "@/types/baseball";

import GameStatus from "@/components/scoreboard/GameStatus";
import TeamScore from "@/components/scoreboard/TeamScore";

interface GameCardProps {
  game: BaseballGame;
}

const AGUILAS_TEAM_ID = 667;

export default function GameCard({ game }: GameCardProps) {
  const isAguilasHome = game.home.team.id === AGUILAS_TEAM_ID;
  const isAguilasAway = game.away.team.id === AGUILAS_TEAM_ID;

  const opponent = isAguilasHome ? game.away.team.name : game.home.team.name;

  const formattedDate = new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(game.gameDate));

  return (
    <article className="overflow-hidden rounded-2xl border border-[#806600] bg-gradient-to-br from-[#29230c] to-[#191919]">
      {/* GAME INFORMATION */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <GameStatus
            status={game.status.type}
            description={game.status.description}
          />

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">
            ÚLTIMO PARTIDO
          </span>
        </div>

        <p className="mt-2 text-xs capitalize text-[#999999]">
          {formattedDate}
        </p>

        <p className="mt-1 text-xs text-[#999999]">
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
          <p className="text-xs text-[#999999]">📍 {game.venue}</p>
        </div>
      )}
    </article>
  );
}
