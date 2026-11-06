"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useTeam } from "@/contexts/TeamContext";
import { BaseballGame } from "@/types/baseball";
import { useLanguage } from "@/contexts/LanguageContext";

type ScheduleFilter = "upcoming" | "completed" | "suspended";

const TEAM_IDS = {
  aguilas: 667,
  yankees: 147,
};

const TEAM_NAMES = {
  aguilas: "Águilas Cibaeñas",
  yankees: "New York Yankees",
};

export default function Schedule() {
  const [games, setGames] = useState<BaseballGame[]>([]);
  const [filter, setFilter] = useState<ScheduleFilter>("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { selectedTeam } = useTeam();
  const { t, tReplace } = useLanguage();

  const teamId = TEAM_IDS[selectedTeam];
  const teamName = TEAM_NAMES[selectedTeam];

  useEffect(() => {
    let cancelled = false;

    async function fetchSchedule() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/baseball/schedule?team=${selectedTeam}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve schedule");
        }

        const result = await response.json();

        if (!cancelled) {
          setGames(result.games);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchSchedule();

    return () => {
      cancelled = true;
    };
  }, [selectedTeam]);

  const teamGames = games.filter(
    (game) => game.home.team.id === teamId || game.away.team.id === teamId,
  );

  const upcomingGames = teamGames
    .filter((game) =>
      ["scheduled", "live", "delayed"].includes(game.status.type),
    )
    .sort(
      (a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime(),
    )
    .slice(0, 3);

  const suspendedGames = teamGames
    .filter((game) => game.status.type === "suspended")
    .sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
    );

  const completedGames = teamGames
    .filter((game) => game.status.type === "final")
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
      <section className="py-8 text-center text-sm text-muted">
        {tReplace("loadingCalendar", teamName)}
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 text-center text-sm text-red-400">
        {t("failLoadingCalendar")}.
      </section>
    );
  }

  return (
    <section id="juegos" className="mt-10">
      <div className="mb-4 ">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          {t("ourTeam")}
        </p>

        <h2 className="mt-1 font-varsity text-team-secondary text-3xl md:text-4xl font-bold uppercase">
          {t("calendar")} {teamName}
        </h2>

        <p className="mt-1 text-xs text-muted">
          {tReplace("followTheTeam", teamName)}.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 rounded-xl border border-border bg-surface p-1">
        <button
          onClick={() => setFilter("upcoming")}
          className={`rounded-lg py-3 text-xs font-extrabold transition-colors uppercase ${
            filter === "upcoming" ? "bg-primary text-on-primary" : "text-muted"
          }`}
        >
          {t("upcoming")} ({upcomingGames.length})
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`rounded-lg py-3 text-xs font-extrabold transition-colors uppercase ${
            filter === "completed" ? "bg-primary text-on-primary" : "text-muted"
          }`}
        >
          {t("completed")} ({completedGames.length})
        </button>

        <button
          onClick={() => setFilter("suspended")}
          className={`rounded-lg py-3 text-xs font-extrabold transition-colors uppercase ${
            filter === "suspended" ? "bg-primary text-on-primary" : "text-muted"
          }`}
        >
          {t("suspended")} ({suspendedGames.length})
        </button>
      </div>

      <div className="space-y-3">
        {displayedGames.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-bold text-primary">{t("noGamesAvailable")}</p>

            <p className="mt-2 text-sm text-muted">
              {filter === "upcoming"
                ? tReplace("moreGamesComingSoon", teamName)
                : filter === "completed"
                  ? tReplace("noCompletedGames", teamName)
                  : tReplace("noSuspendedGames", teamName)}
            </p>
          </div>
        )}

        {displayedGames.map((game, index) => {
          const isTeamHome = game.home.team.id === teamId;
          const isFinal = game.status.type === "final";

          return (
            <div
              key={`${game.gamePk}-${filter} ${index}-historic`}
              className="mb-10 rounded-xl border border-primary-muted"
            >
              <article
                key={game.gamePk}
                className={`overflow-hidden rounded-xl bg-gradient-to-br from-(--color-background-gradient) to-surface-overlay ${
                  isFinal
                    ? "transition-all hover:border-primary hover:shadow-lg"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="text-xs font-bold capitalize text-muted">
                    {formatDate(game.gameDate)}
                  </span>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    {isFinal
                      ? t("final")
                      : game.status.type === "live"
                        ? t("live")
                        : game.status.type === "delayed"
                          ? t("delayed")
                          : game.status.type === "suspended"
                            ? t("suspended")
                            : t("upcoming")}
                  </span>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="text-center ">
                      <p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-muted">
                        {t("awayTeam")}
                      </p>

                      <p
                        className={`text-sm font-extrabold ${
                          !isTeamHome ? "text-primary" : "text-white"
                        }`}
                      >
                        {game.away.team.name}
                      </p>

                      {isFinal && (
                        <p
                          className={`mt-1 font-[family-name:var(--font-oswald)] text-4xl font-bold ${
                            !isTeamHome ? "text-primary" : "text-white"
                          }`}
                        >
                          {game.away.score?.runs ?? "—"}
                        </p>
                      )}
                    </div>

                    <span className="font-[family-name:var(--font-oswald)] text-lg font-bold text-subtle">
                      VS
                    </span>

                    <div className="text-center">
                      <p className="mb-2 text-[9px] font-extrabold uppercase tracking-widest text-muted">
                        {t("homeTeam")}
                      </p>

                      <p
                        className={`text-sm font-extrabold ${
                          isTeamHome ? "text-primary" : "text-white"
                        }`}
                      >
                        {game.home.team.name}
                      </p>

                      {isFinal && (
                        <p
                          className={`mt-1 font-[family-name:var(--font-oswald)] text-4xl font-bold ${
                            isTeamHome ? "text-primary" : "text-white"
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
                    <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                      {t("finalStatistics")}
                    </p>

                    <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,36px)] gap-2 text-center">
                      <span className="text-left text-[10px] text-subtle uppercase">
                        {t("team")}
                      </span>
                      <span className="text-[10px] font-bold text-muted">
                        R
                      </span>
                      <span className="text-[10px] font-bold text-muted">
                        H
                      </span>
                      <span className="text-[10px] font-bold text-muted">
                        E
                      </span>

                      {[game.away, game.home].map((team) => (
                        <React.Fragment key={team.team.id}>
                          <span
                            className={`truncate text-left text-xs font-bold ${
                              team.team.id === teamId
                                ? "text-primary"
                                : "text-white"
                            }`}
                          >
                            {team.team.name}
                          </span>

                          <span className="text-sm font-extrabold text-white">
                            {team.score?.runs ?? "—"}
                          </span>

                          <span className="text-sm text-secondary">
                            {team.score?.hits ?? "—"}
                          </span>

                          <span className="text-sm text-secondary">
                            {team.score?.errors ?? "—"}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>

                    {game.inning?.scores && game.inning.scores.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-center text-xs">
                          <thead>
                            <tr className="text-muted">
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
                                <td className="py-2 text-left font-bold text-primary">
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
                      <p className="mt-4 border-t border-white/5 pt-3 text-xs text-muted">
                        📍 {game.venue}
                      </p>
                    )}
                  </div>
                )}

                {!isFinal && game.venue && (
                  <div className="border-t border-white/10 px-4 py-3">
                    <p className="text-xs text-muted">📍 {game.venue}</p>
                  </div>
                )}
              </article>

              <Link
                href={`/games/${game.gamePk}?team=${selectedTeam}`}
                className="flex items-center justify-center gap-2 border-t border-white/10 bg-primary/80 px-4 py-4 text-xs font-extrabold uppercase tracking-widest text-primary transition-colors hover:bg-primary/90"
              >
                {t("viewGameDetails")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
