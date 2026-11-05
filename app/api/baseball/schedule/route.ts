import { NextRequest, NextResponse } from "next/server";

import { getCurrentLidomSeason } from "@/lib/baseball/dates";
import type { BaseballGame } from "@/types/baseball";
import {
  getMLBSeasonSchedule,
  getSeasonSchedule,
} from "@/lib/baseball/schedule";

import { fetchStatsApi } from "@/lib/baseball/api";

import type { MLBScheduleResponse } from "@/lib/baseball/mlb-types";

import { normalizeGame } from "@/lib/baseball/normalize";
import type { TeamId } from "@/contexts/TeamContext";

export async function GET(request: NextRequest) {
  try {
    const gamePkParam = request.nextUrl.searchParams.get("gamePk");

    if (gamePkParam) {
      const gamePk = Number(gamePkParam);

      if (!Number.isSafeInteger(gamePk) || gamePk <= 0) {
        return NextResponse.json(
          { error: "Invalid game ID." },
          { status: 400 },
        );
      }

      const schedule = await fetchStatsApi<MLBScheduleResponse>("/schedule", {
        query: {
          gamePks: gamePk,
          hydrate: "team,linescore,decisions",
        },
      });

      const game = schedule.dates
        ?.flatMap((date) => date.games ?? [])
        .map(normalizeGame)
        .find(
          (item): item is BaseballGame =>
            item !== null && item.gamePk === gamePk,
        );

      return NextResponse.json(
        {
          games: game ? [game] : [],
          metadata: {
            fetchedAt: new Date().toISOString(),
            gamePk,
          },
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const requestedTeam = request.nextUrl.searchParams.get("team") ?? "aguilas";

    if (requestedTeam !== "aguilas" && requestedTeam !== "yankees") {
      return NextResponse.json({ error: "Invalid team." }, { status: 400 });
    }

    const team = requestedTeam as TeamId;

    const season =
      team === "aguilas" ? getCurrentLidomSeason() : new Date().getFullYear();

    const rawGames =
      team === "aguilas"
        ? await getSeasonSchedule(season, false, true)
        : await getMLBSeasonSchedule(season, 147);

    const teamId = team === "aguilas" ? 667 : 147;

    const games = rawGames
      .map(normalizeGame)
      .filter(
        (game): game is BaseballGame =>
          game !== null &&
          (game.home.team.id === teamId || game.away.team.id === teamId),
      )
      .sort(
        (a, b) =>
          new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime(),
      );

    return NextResponse.json(
      {
        games,
        metadata: {
          fetchedAt: new Date().toISOString(),
          season,
          team,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Baseball schedule API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve baseball schedule." },
      { status: 502 },
    );
  }
}
