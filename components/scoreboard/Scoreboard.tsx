"use client";

import { useCallback, useEffect, useState } from "react";

import { BaseballGamesResponse } from "@/types/baseball";

import GameCard from "@/components/scoreboard/GameCard";
import TeamForm from "@/components/scoreboard/TeamForm";

export default function Scoreboard() {
  const [data, setData] = useState<BaseballGamesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGames = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/baseball/games", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener los marcadores.");
      }

      const result: BaseballGamesResponse = await response.json();

      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los marcadores.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);

  const selectedGame = data?.selectedGame;

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
            Sigue la pelota
          </p>

          <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase">
            Marcadores
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void fetchGames(true)}
          disabled={refreshing}
          className="rounded-lg border border-[#3a3a3a] px-3 py-2 text-xs font-bold text-[#f5c400] transition-colors hover:border-[#f5c400] disabled:opacity-50"
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
            className="mt-3 text-xs font-bold text-[#f5c400]"
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
          <p className="font-bold text-[#f5c400]">Águilas Cibaeñas</p>

          <p className="mt-2 text-sm text-[#999999]">
            Todavía no hay un partido de las Águilas disponible.
          </p>
        </div>
      )}

      {selectedGame && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">🦅</span>

            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f5c400]">
              Nuestro equipo
            </h3>
          </div>

          <GameCard game={selectedGame} />
          {data && <TeamForm games={data.games} />}

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
