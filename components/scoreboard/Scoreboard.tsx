"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useTeam } from "@/contexts/TeamContext";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const { t } = useLanguage();

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
          <p className="text-md font-bold  font-logo uppercase tracking-widest text-accent">
            {t("followBaseball")}
          </p>

          <h2 className="mt-1 font-varsity  text-team-secondary text-3xl md:text-4xl">
            {t("scores")}
          </h2>

          <p className="mt-1 text-xs text-muted">{teamName}</p>
        </div>

        <button
          type="button"
          onClick={() => void fetchGames(true)}
          disabled={refreshing}
          className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-accent transition-colors hover:border-primary disabled:opacity-50"
        >
          {refreshing ? `${t("refreshing")}...` : `↻ ${t("refresh")}`}
        </button>
      </div>

      {loading && !data && (
        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="mt-5 h-12 rounded bg-white/10" />
          <div className="mt-3 h-12 rounded bg-white/10" />
        </div>
      )}

      {error && !data && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
          <p className="text-sm text-danger">{error}</p>

          <button
            type="button"
            onClick={() => void fetchGames()}
            className="mt-3 text-xs font-bold text-primary"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}

      {error && data && (
        <p className="mb-3 text-xs text-danger">{t("updateFailed")}</p>
      )}

      {!loading && !error && !selectedGame && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="font-bold text-primary">{teamName}</p>

          <p className="mt-2 text-sm text-muted">{t("noFinalGameAvailable")}</p>
        </div>
      )}

      {selectedGame && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-md font-light font-logo uppercase tracking-widest text-accent">
              {t("ourTeam")}
            </h3>
          </div>

          <GameCard
            game={selectedGame}
            teamId={selectedTeam === "aguilas" ? 667 : 147}
          />

          <Link
            href={`/games/${selectedGame.gamePk}?team=${selectedTeam}`}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-primary-muted  bg-accent px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-hover"
          >
            {t("viewGameDetails")} →
          </Link>

          {data && (
            <TeamForm
              games={data.games}
              teamId={selectedTeam === "aguilas" ? 667 : 147}
              teamName={teamName}
            />
          )}

          {data?.metadata.fetchedAt && (
            <p className="mt-3 text-right text-[10px] text-subtle">
              {t("dataRetrieved")}
              {": "}
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
