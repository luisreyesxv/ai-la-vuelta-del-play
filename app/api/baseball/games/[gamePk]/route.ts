import { NextRequest, NextResponse } from "next/server";

import { fetchStatsApi, StatsApiError } from "@/lib/baseball/api";

import type { MLBScheduleResponse, MLBGame } from "@/lib/baseball/mlb-types";

interface RouteContext {
  params: Promise<{
    gamePk: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { gamePk } = await params;
    const id = Number(gamePk);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid game ID." }, { status: 400 });
    }

    const [boxscore, schedule] = await Promise.all([
      fetchStatsApi<Record<string, unknown>>(`/game/${id}/boxscore`, {
        revalidateSeconds: 300,
      }),

      fetchStatsApi<MLBScheduleResponse>("/schedule", {
        revalidateSeconds: 300,
        query: {
          gamePks: id,
          hydrate: "decisions",
        },
      }),
    ]);

    const game: MLBGame | undefined = schedule.dates
      ?.flatMap((date) => date.games ?? [])
      .find((item) => item.gamePk === id);

    if (!game) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({
      ...boxscore,
      decisions: game.decisions ?? {},
    });
  } catch (error) {
    console.error("[Baseball API] Boxscore error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof StatsApiError
            ? "Game statistics are temporarily unavailable."
            : "Unable to retrieve game statistics.",
      },
      { status: 502 },
    );
  }
}
