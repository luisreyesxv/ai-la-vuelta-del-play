"use client";

import React, { useEffect, useState } from "react";

import { BaseballGame } from "@/types/baseball";

type ScheduleFilter = "upcoming" | "completed" | "suspended";

const AGUILAS_TEAM_ID = 667;

export default function Schedule() {
  const [games, setGames] = useState<BaseballGame[]>([]);
  const [filter, setFilter] = useState<ScheduleFilter>("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch("/api/baseball/schedule", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to retrieve schedule");
        }

        const result = await response.json();

        setGames(result.games);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void fetchSchedule();
  }, []);

  const aguilasGames = games.filter(
    (game) =>
      game.home.team.id === AGUILAS_TEAM_ID ||
      game.away.team.id === AGUILAS_TEAM_ID,
  );

  const upcomingGames = aguilasGames
    .filter((game) =>
      ["scheduled", "live", "delayed"].includes(game.status.type),
    )
    .sort(
      (a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime(),
    )
    .slice(0, 3);

  const suspendedGames = aguilasGames
    .filter((game) => game.status.type === "suspended")
    .sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
    );

  const completedGames = aguilasGames
    .filter((game) => ["final", "delayed"].includes(game.status.type))
    .sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
    )
    .slice(0, 5);

  const displayedGames =
    filter === "upcoming"
      ? upcomingGames
      : filter === "completed"
        ? completedGames
        : suspendedGames;

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("es-DO", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Santo_Domingo",
    }).format(new Date(date));

  if (loading) {
    return (
      <section className="py-8 text-center text-sm text-[#999999]">
        Cargando calendario de las Águilas...
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 text-center text-sm text-red-400">
        No fue posible cargar el calendario.
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
          Nuestro equipo
        </p>

        <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase">
          Calendario Águilas
        </h2>

        <p className="mt-1 text-xs text-[#999999]">
          Sigue cada paso de las Águilas Cibaeñas.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 rounded-xl border border-[#3a3a3a] bg-[#242424] p-1">
        <button
          onClick={() => setFilter("upcoming")}
          className={`rounded-lg py-3 text-xs font-extrabold transition-colors ${
            filter === "upcoming" ? "bg-[#f5c400] text-black" : "text-[#999999]"
          }`}
        >
          PRÓXIMOS ({upcomingGames.length})
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`rounded-lg py-3 text-xs font-extrabold transition-colors ${
            filter === "completed"
              ? "bg-[#f5c400] text-black"
              : "text-[#999999]"
          }`}
        >
          FINALIZADOS ({completedGames.length})
        </button>

        <button
          onClick={() => setFilter("suspended")}
          className={`rounded-lg py-3 text-xs font-extrabold transition-colors ${
            filter === "suspended"
              ? "bg-[#f5c400] text-black"
              : "text-[#999999]"
          }`}
        >
          SUSPENDIDOS ({suspendedGames.length})
        </button>
      </div>

      <div className="space-y-3">
        {displayedGames.length === 0 && (
          <div className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-6 text-center">
            <p className="font-bold text-[#f5c400]">
              No hay partidos disponibles.
            </p>

            <p className="mt-2 text-sm text-[#999999]">
              {filter === "upcoming"
                ? "Próximamente tendremos más acción de las Águilas."
                : filter === "completed"
                  ? "Todavía no hay partidos finalizados disponibles."
                  : "No hay partidos suspendidos disponibles."}
            </p>
          </div>
        )}

        {displayedGames.map((game) => {
          const isAguilasHome = game.home.team.id === AGUILAS_TEAM_ID;

          const aguilas = isAguilasHome ? game.home : game.away;

          const opponent = isAguilasHome ? game.away : game.home;

          const isFinal = game.status.type === "final";

          return (
            <article
              key={game.gamePk}
              className="overflow-hidden rounded-xl border border-[#806600] bg-gradient-to-br from-[#29230c] to-[#191919]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-xs font-bold capitalize text-[#999999]">
                  {formatDate(game.gameDate)}
                </span>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c400]">
                  {isFinal
                    ? "FINAL"
                    : game.status.type === "live"
                      ? "EN VIVO"
                      : game.status.type === "delayed"
                        ? "DEMORADO"
                        : game.status.type === "suspended"
                          ? "SUSPENDIDO"
                          : "PRÓXIMO"}
                </span>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* VISITANTE - ALWAYS LEFT */}
                  <div className="text-center">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-[#999999]">
                      VISITANTE
                    </p>

                    <p
                      className={`text-sm font-extrabold ${
                        !isAguilasHome ? "text-[#f5c400]" : "text-white"
                      }`}
                    >
                      {game.away.team.name}
                    </p>

                    {isFinal && (
                      <p
                        className={`mt-1 font-[family-name:var(--font-oswald)] text-4xl font-bold ${
                          !isAguilasHome ? "text-[#f5c400]" : "text-white"
                        }`}
                      >
                        {game.away.score?.runs ?? "—"}
                      </p>
                    )}
                  </div>

                  <span className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#777777]">
                    VS
                  </span>

                  {/* LOCAL - ALWAYS RIGHT */}
                  <div className="text-center">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-[#999999]">
                      LOCAL
                    </p>

                    <p
                      className={`text-sm font-extrabold ${
                        isAguilasHome ? "text-[#f5c400]" : "text-white"
                      }`}
                    >
                      {game.home.team.name}
                    </p>

                    {isFinal && (
                      <p
                        className={`mt-1 font-[family-name:var(--font-oswald)] text-4xl font-bold ${
                          isAguilasHome ? "text-[#f5c400]" : "text-white"
                        }`}
                      >
                        {game.home.score?.runs ?? "—"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isFinal && (
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-[#f5c400]">
                    Estadísticas finales
                  </p>

                  <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,36px)] gap-2 text-center">
                    <span className="text-left text-[10px] text-[#777777]">
                      EQUIPO
                    </span>
                    <span className="text-[10px] font-bold text-[#999999]">
                      R
                    </span>
                    <span className="text-[10px] font-bold text-[#999999]">
                      H
                    </span>
                    <span className="text-[10px] font-bold text-[#999999]">
                      E
                    </span>

                    {[game.away, game.home].map((team) => (
                      <React.Fragment key={team.team.id}>
                        <span
                          className={`truncate text-left text-xs font-bold ${
                            team.team.id === AGUILAS_TEAM_ID
                              ? "text-[#f5c400]"
                              : "text-white"
                          }`}
                        >
                          {team.team.name}
                        </span>

                        <span className="text-sm font-extrabold text-white">
                          {team.score?.runs ?? "—"}
                        </span>

                        <span className="text-sm text-[#bbbbbb]">
                          {team.score?.hits ?? "—"}
                        </span>

                        <span className="text-sm text-[#bbbbbb]">
                          {team.score?.errors ?? "—"}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>

                  {game.inning?.scores && game.inning.scores.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-center text-xs">
                        <thead>
                          <tr className="text-[#999999]">
                            <th className="py-2 text-left">INN</th>

                            {game.inning.scores.map((inning) => (
                              <th key={inning.inning} className="px-2">
                                {inning.inning}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {[
                            { label: "V", key: "awayRuns" as const },
                            { label: "L", key: "homeRuns" as const },
                          ].map((team) => (
                            <tr
                              key={team.label}
                              className="border-t border-white/5"
                            >
                              <td className="py-2 text-left font-bold text-[#f5c400]">
                                {team.label}
                              </td>

                              {game.inning!.scores.map((inning) => (
                                <td
                                  key={inning.inning}
                                  className="px-2 text-white"
                                >
                                  {inning[team.key] ?? "—"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {game.venue && (
                    <p className="mt-4 border-t border-white/5 pt-3 text-xs text-[#999999]">
                      📍 {game.venue}
                    </p>
                  )}
                </div>
              )}

              {!isFinal && game.venue && (
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="text-xs text-[#999999]">📍 {game.venue}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
