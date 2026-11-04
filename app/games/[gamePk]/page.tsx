"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BaseballGame } from "@/types/baseball";
import { GameBoxscore } from "@/types/boxscore";

type Props = {
  params: Promise<{ gamePk: string }>;
};

type Tab = "summary" | "batting" | "pitching";
export default function GameDetailsPage({ params }: Props) {
  const router = useRouter();

  const [gamePk, setGamePk] = useState<string | null>(null);
  const [game, setGame] = useState<BaseballGame | null>(null);
  const [boxscore, setBoxscore] = useState<GameBoxscore | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [loading, setLoading] = useState(true);
  const [boxscoreLoading, setBoxscoreLoading] = useState(false);
  const [error, setError] = useState(false);

  // Resolve dynamic route parameters without useParams().
  useEffect(() => {
    let cancelled = false;

    params.then(({ gamePk }) => {
      if (!cancelled) setGamePk(gamePk);
    });

    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!gamePk) return;

    let cancelled = false;

    async function fetchGame() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch("/api/baseball/schedule", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to retrieve game.");
        }

        const result = await response.json();

        const selected = result.games.find(
          (item: BaseballGame) => item.gamePk === Number(gamePk),
        );

        if (!selected) {
          throw new Error("Game not found.");
        }

        if (cancelled) return;

        setGame(selected);

        if (selected.status.type === "final") {
          setBoxscoreLoading(true);

          const boxscoreResponse = await fetch(
            `/api/baseball/games/${gamePk}`,
            { cache: "no-store" },
          );

          if (!boxscoreResponse.ok) {
            throw new Error("Unable to retrieve boxscore.");
          }

          const data: GameBoxscore = await boxscoreResponse.json();

          if (!cancelled) setBoxscore(data);
        }
      } catch (err) {
        console.error("Unable to load game:", err);

        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setBoxscoreLoading(false);
        }
      }
    }

    void fetchGame();

    return () => {
      cancelled = true;
    };
  }, [gamePk]);

  if (loading || !gamePk) {
    return (
      <main className="min-h-screen bg-[#111111] p-8 text-center text-white">
        Cargando detalles del partido...
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="min-h-screen bg-[#111111] p-8 text-center text-white">
        <p>No fue posible cargar los detalles del partido.</p>

        <button
          onClick={() => router.back()}
          className="mt-5 font-bold text-[#f5c400]"
        >
          ← VOLVER
        </button>
      </main>
    );
  }

  const isFinal = game.status.type === "final";

  const formattedDate = new Intl.DateTimeFormat("es-DO", {
    dateStyle: "full",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(game.gameDate));

  const teams = [
    { label: "Visitante", data: boxscore?.teams?.away },
    { label: "Local", data: boxscore?.teams?.home },
  ];

  const winningPitcher = boxscore?.decisions?.winner;
  const losingPitcher = boxscore?.decisions?.loser;
  const savePitcher = boxscore?.decisions?.save;

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Resumen" },
    { id: "batting", label: "Bateadores" },
    { id: "pitching", label: "Lanzadores" },
  ];

  return (
    <main className="min-h-screen bg-[#111111] px-4 pb-28 pt-6 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-xs font-bold text-[#f5c400]"
        >
          ← VOLVER
        </button>

        <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
          Detalles del partido
        </p>

        <h1 className="mt-2 text-2xl font-extrabold uppercase">
          {game.away.team.name} VS {game.home.team.name}
        </h1>

        <p className="mt-2 text-sm capitalize text-[#999999]">
          {formattedDate}
        </p>

        {/* SCORE */}

        <section className="mt-6 rounded-2xl border border-[#806600] bg-gradient-to-br from-[#29230c] to-[#191919] p-5">
          <p className="mb-5 text-center text-xs font-extrabold tracking-widest text-[#f5c400]">
            {isFinal ? "FINAL" : (game.status.description ?? "PARTIDO")}
          </p>

          {[game.away, game.home].map((team) => (
            <div
              key={team.team.id}
              className="flex items-center justify-between border-t border-white/10 py-5"
            >
              <span className="font-bold">{team.team.name}</span>

              <span className="font-[family-name:var(--font-oswald)] text-4xl font-bold text-[#f5c400]">
                {team.score?.runs ?? "—"}
              </span>
            </div>
          ))}

          {game.venue && (
            <p className="mt-3 border-t border-white/10 pt-4 text-xs text-[#999999]">
              📍 {game.venue}
            </p>
          )}
        </section>

        {/* GAME DECISIONS */}

        {isFinal && boxscore && (
          <section className="mt-6 rounded-2xl border border-[#3a3a3a] bg-[#242424] p-5">
            <h2 className="mb-5 text-sm font-extrabold uppercase tracking-widest text-[#f5c400]">
              Decisiones del partido
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-4">
                <p className="text-xs font-bold uppercase text-[#999999]">
                  Pitcher ganador
                </p>

                <p className="mt-2 font-extrabold text-[#f5c400]">
                  {game.decisions?.winner?.fullName ?? "No disponible"}
                </p>
              </div>

              <div className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-4">
                <p className="text-xs font-bold uppercase text-[#999999]">
                  Pitcher perdedor
                </p>

                <p className="mt-2 font-extrabold text-[#f5c400]">
                  {game.decisions?.loser?.fullName ?? "No disponible"}
                </p>
              </div>
            </div>

            {savePitcher?.fullName && (
              <div className="mt-4 rounded-xl bg-[#191919] p-4">
                <p className="text-xs font-bold uppercase text-[#f5c400]">
                  Juego salvado
                </p>
                <p className="mt-2 font-extrabold">{savePitcher.fullName}</p>
              </div>
            )}
          </section>
        )}

        {/* NAVIGATION */}

        <div className="sticky z-20 mt-8 overflow-x-auto border-b border-[#3a3a3a] bg-[#111111]">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-4 py-4 text-xs font-extrabold uppercase transition-colors ${
                  activeTab === tab.id
                    ? "border-[#f5c400] text-[#f5c400]"
                    : "border-transparent text-[#777777]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SUMMARY */}

        {activeTab === "summary" && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-extrabold uppercase">
              Resultados por entrada
            </h2>

            {game.inning?.scores?.length ? (
              <div className="overflow-x-auto rounded-xl border border-[#3a3a3a] bg-[#242424]">
                <table className="w-full text-center text-sm">
                  <thead className="text-[#f5c400]">
                    <tr>
                      <th className="p-3 text-left">Equipo</th>
                      {game.inning.scores.map((inning) => (
                        <th key={inning.inning} className="p-3">
                          {inning.inning}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {[game.away, game.home].map((team, index) => (
                      <tr
                        key={team.team.id}
                        className="border-t border-white/10"
                      >
                        <td className="p-3 text-left font-bold">
                          {/*  */}
                          {team.team.name} (
                          {index === 0 ? "Visitante" : "Local"})
                        </td>

                        {game.inning!.scores.map((inning) => (
                          <td key={inning.inning} className="p-3">
                            {index === 0
                              ? (inning.awayRuns ?? "—")
                              : (inning.homeRuns ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl bg-[#242424] p-4 text-sm text-[#999999]">
                Resultados por entrada no disponibles.
              </p>
            )}
          </section>
        )}

        {/* BATTING */}

        {activeTab === "batting" && (
          <section className="mt-8 space-y-8">
            <h2 className="text-xl font-extrabold uppercase">
              Estadísticas de bateadores
            </h2>

            {boxscoreLoading && (
              <p className="text-sm text-[#999999]">Cargando estadísticas...</p>
            )}

            {!boxscoreLoading && !boxscore && (
              <p className="rounded-xl bg-[#242424] p-4 text-sm text-[#999999]">
                Las estadísticas no están disponibles.
              </p>
            )}

            {boxscore &&
              teams.map(({ label, data }) => {
                const players = Object.values(data?.players ?? {}).filter(
                  (player) => player.stats?.batting,
                );

                return (
                  <div key={label}>
                    <h3 className="mb-3 font-extrabold uppercase text-[#f5c400]">
                      {label}
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-[#3a3a3a] bg-[#242424]">
                      <table className="w-full text-center text-xs">
                        <thead className="text-[#f5c400]">
                          <tr>
                            <th className="p-3 text-left">Jugador</th>
                            <th>AB</th>
                            <th>H</th>
                            <th>R</th>
                            <th>RBI</th>
                            <th>HR</th>
                            <th>SO</th>
                            <th>AVG</th>
                            <th>OBP</th>
                            <th>SLG</th>
                            <th>OPS</th>
                          </tr>
                        </thead>

                        <tbody>
                          {players.map((player, index) => {
                            const stats = player.stats!.batting!;

                            return (
                              <tr
                                key={player.person?.id ?? index}
                                className="border-t border-white/5"
                              >
                                <td className="p-3 text-left font-bold">
                                  {player.person?.fullName ?? "Jugador"}
                                </td>
                                <td>{stats.atBats ?? "—"}</td>
                                <td>{stats.hits ?? "—"}</td>
                                <td>{stats.runs ?? "—"}</td>
                                <td>{stats.rbi ?? "—"}</td>
                                <td>{stats.homeRuns ?? "—"}</td>
                                <td>{stats.strikeOuts ?? "—"}</td>
                                <td>{stats.avg ?? "—"}</td>
                                <td>{stats.obp ?? "—"}</td>
                                <td>{stats.slg ?? "—"}</td>
                                <td>{stats.ops ?? "—"}</td>
                              </tr>
                            );
                          })}

                          {players.length === 0 && (
                            <tr>
                              <td colSpan={11} className="p-4 text-[#999999]">
                                Estadísticas no disponibles.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
          </section>
        )}

        {/* PITCHING */}

        {activeTab === "pitching" && (
          <section className="mt-8 space-y-8">
            <h2 className="text-xl font-extrabold uppercase">
              Estadísticas de lanzadores
            </h2>

            {boxscore &&
              teams.map(({ label, data }) => {
                const players = Object.values(data?.players ?? {}).filter(
                  (player) => player.stats?.pitching,
                );

                return (
                  <div key={label}>
                    <h3 className="mb-3 font-extrabold uppercase text-[#f5c400]">
                      {label}
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-[#3a3a3a] bg-[#242424]">
                      <table className="w-full text-center text-xs">
                        <thead className="text-[#f5c400]">
                          <tr>
                            <th className="p-3 text-left">Lanzador</th>
                            <th>IP</th>
                            <th>H</th>
                            <th>R</th>
                            <th>ER</th>
                            <th>BB</th>
                            <th>SO</th>
                            <th>HR</th>
                            <th>ERA</th>
                          </tr>
                        </thead>

                        <tbody>
                          {players.map((player, index) => {
                            const stats = player.stats!.pitching!;

                            return (
                              <tr
                                key={player.person?.id ?? index}
                                className="border-t border-white/5"
                              >
                                <td className="p-3 text-left font-bold">
                                  {player.person?.fullName ?? "Lanzador"}
                                </td>
                                <td>{stats.inningsPitched ?? "—"}</td>
                                <td>{stats.hits ?? "—"}</td>
                                <td>{stats.runs ?? "—"}</td>
                                <td>{stats.earnedRuns ?? "—"}</td>
                                <td>{stats.baseOnBalls ?? "—"}</td>
                                <td>{stats.strikeOuts ?? "—"}</td>
                                <td>{stats.homeRuns ?? "—"}</td>
                                <td>{stats.era ?? "—"}</td>
                              </tr>
                            );
                          })}

                          {players.length === 0 && (
                            <tr>
                              <td colSpan={9} className="p-4 text-[#999999]">
                                Estadísticas no disponibles.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

            {boxscoreLoading && (
              <p className="text-sm text-[#999999]">Cargando estadísticas...</p>
            )}

            {!boxscoreLoading && !boxscore && (
              <p className="text-sm text-[#999999]">
                Estadísticas no disponibles.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
