"use client";

import { useCallback, useEffect, useState } from "react";

import { useTeam } from "@/contexts/TeamContext";
import { BaseballStandingsResponse } from "@/types/baseball";

import StandingsTable from "./StandingsTable";
import StandingsUpdate from "./StandingsUpdate";

const TEAM_NAMES = {
  aguilas: "Águilas Cibaeñas",
  yankees: "New York Yankees",
};

const LEAGUE_NAMES = {
  aguilas: "LIDOM",
  yankees: "MLB",
};

export default function Standings() {
  const { selectedTeam } = useTeam();

  const [data, setData] = useState<BaseballStandingsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = useCallback(
    async (manual = false) => {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          `/api/baseball/standings?team=${selectedTeam}`,
          { cache: "no-store" },
        );

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
    },
    [selectedTeam],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/baseball/standings?team=${selectedTeam}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve standings.");
        }

        const result: BaseballStandingsResponse = await response.json();

        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("No fue posible actualizar las posiciones.");
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

  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-md font-bold font-logo uppercase tracking-widest text-accent">
          La temporada
        </p>

        <h2 className="mt-1 font-varsity text-team-secondary text-3xl md:text-4xl font-bold uppercase">
          Posiciones {LEAGUE_NAMES[selectedTeam]}
        </h2>

        <p className="mt-1 text-xs text-muted">
          Así marcha {TEAM_NAMES[selectedTeam]} en su liga.
        </p>
      </div>

      {loading && !data && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted">Cargando posiciones...</p>
        </div>
      )}

      {error && !data && (
        <div className="rounded-xl border border-[#713d28] bg-surface p-5">
          <p className="text-sm text-white">{error}</p>

          <button
            onClick={() => void fetchStandings(true)}
            className="mt-3 text-xs font-bold text-primary"
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
            <p className="mt-2 text-xs text-accent">
              {error} Mostrando los últimos datos recibidos.
            </p>
          )}
        </>
      )}

      {data && data.data.standings.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted">
            No hay posiciones disponibles actualmente.
          </p>
        </div>
      )}
    </section>
  );
}
