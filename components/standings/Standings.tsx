"use client";

import { useCallback, useEffect, useState } from "react";

import { BaseballStandingsResponse } from "@/types/baseball";

import StandingsTable from "./StandingsTable";
import StandingsUpdate from "./StandingsUpdate";

export default function Standings() {
  const [data, setData] = useState<BaseballStandingsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/baseball/standings", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las posiciones.");
      }

      const result: BaseballStandingsResponse = await response.json();

      setData(result);
      setError(null);
    } catch {
      setError("No fue posible actualizar las posiciones.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchStandings();
  }, [fetchStandings]);

  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
          La temporada
        </p>

        <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase">
          Posiciones LIDOM
        </h2>

        <p className="mt-1 text-xs text-[#999999]">
          Así marcha la pelota dominicana.
        </p>
      </div>

      {loading && !data && (
        <div className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-6 text-center">
          <p className="text-sm text-[#999999]">Cargando posiciones...</p>
        </div>
      )}

      {error && !data && (
        <div className="rounded-xl border border-[#713d28] bg-[#242424] p-5">
          <p className="text-sm text-white">{error}</p>

          <button
            onClick={() => void fetchStandings(true)}
            className="mt-3 text-xs font-bold text-[#f5c400]"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {data && data.data.standings.length > 0 && (
        <>
          <StandingsTable standings={data.data.standings} />

          <StandingsUpdate
            updatedAt={data.metadata.dataUpdatedAt}
            isRefreshing={refreshing}
            onRefresh={() => void fetchStandings(true)}
          />

          {error && (
            <p className="mt-2 text-xs text-[#f28c00]">
              {error} Mostrando los últimos datos recibidos.
            </p>
          )}
        </>
      )}

      {data && data.data.standings.length === 0 && (
        <div className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-6 text-center">
          <p className="text-sm text-[#999999]">
            No hay posiciones disponibles actualmente.
          </p>
        </div>
      )}
    </section>
  );
}
