"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useTeam } from "@/contexts/TeamContext";
import { BaseballGamesResponse } from "@/types/baseball";

import GameCard from "@/components/scoreboard/GameCard";
import TeamForm from "@/components/scoreboard/TeamForm";

const TEAM_NAMES = {
  aguilas: "Águilas Cibaeñas",
  yankees: "New York Yankees",
};

export default function Scoreboard() {
  const { selectedTeam } = useTeam();

  const [data, setData] = useState<BaseballGamesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGames = useCallback(
    async (manual = false) => {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          `/api/baseball/games?team=${selectedTeam}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener los marcadores.");
        }

        const result: BaseballGamesResponse = await response.json();

        setData(result);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar los marcadores.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedTeam],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/baseball/games?team=${selectedTeam}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener los marcadores.");
        }

        const result: BaseballGamesResponse = await response.json();

        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar los marcadores.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [selectedTeam]);

  const selectedGame = data?.selectedGame;

  const teamName = TEAM_NAMES[selectedTeam];

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Sigue la pelota
          </p>

          <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase">
            Marcadores
          </h2>

          <p className="mt-1 text-xs text-[#999999]">{teamName}</p>
        </div>

        <button
          type="button"
          onClick={() => void fetchGames(true)}
          disabled={refreshing}
          className="rounded-lg border border-[#3a3a3a] px-3 py-2 text-xs font-bold text-primary transition-colors hover:border-primary disabled:opacity-50"
        >
          {refreshing ? "ACTUALIZANDO..." : "↻ ACTUALIZAR"}
        </button>
      </div>

      {loading && !data && (
        <div className="animate-pulse rounded-2xl border border-[#3a3a3a] bg-[#242424] p-6">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="mt-5 h-12 rounded bg-white/10" />
          <div className="mt-3 h-12 rounded bg-white/10" />
        </div>
      )}

      {error && !data && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
          <p className="text-sm text-[#ff9999]">{error}</p>

          <button
            type="button"
            onClick={() => void fetchGames()}
            className="mt-3 text-xs font-bold text-primary"
          >
            INTENTAR DE NUEVO
          </button>
        </div>
      )}

      {error && data && (
        <p className="mb-3 text-xs text-[#ff9999]">
          No se pudo actualizar. Mostrando los últimos datos recibidos.
        </p>
      )}

      {!loading && !error && !selectedGame && (
        <div className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-5">
          <p className="font-bold text-primary">{teamName}</p>

          <p className="mt-2 text-sm text-[#999999]">
            Todavía no hay un partido finalizado disponible.
          </p>
        </div>
      )}

      {selectedGame && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">
              {selectedTeam === "aguilas" ? "🦅" : "⚾"}
            </span>

            <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Nuestro equipo
            </h3>
          </div>

          <GameCard
            game={selectedGame}
            teamId={selectedTeam === "aguilas" ? 667 : 147}
          />

          <Link
            href={`/games/${selectedGame.gamePk}?team=${selectedTeam}`}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-primary-muted  bg-primary px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-black transition-colors hover:bg-[#e9b900]"
          >
            VER DETALLES DEL PARTIDO →
          </Link>

          {data && (
            <TeamForm
              games={data.games}
              teamId={selectedTeam === "aguilas" ? 667 : 147}
              teamName={teamName}
            />
          )}

          {data?.metadata.fetchedAt && (
            <p className="mt-3 text-right text-[10px] text-[#777777]">
              Datos consultados:{" "}
              {new Date(data.metadata.fetchedAt).toLocaleTimeString("es-DO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
