import { NextResponse } from "next/server";

import { fetchStatsApi, StatsApiError } from "@/lib/baseball/api";

interface RouteContext {
  params: Promise<{
    gamePk: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
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

      fetchStatsApi<Record<string, unknown>>("/schedule", {
        revalidateSeconds: 300,
        query: {
          sportId: 1,
          gamePks: id,
          hydrate: "decisions",
        },
      }),
    ]);

    const dates = schedule.dates as
      | Array<{ games?: Array<Record<string, unknown>> }>
      | undefined;

    const game = dates
      ?.flatMap((date) => date.games ?? [])
      .find((item) => Number(item.gamePk) === id);

    const decisions = game?.decisions ?? {};

    return NextResponse.json({
      ...boxscore,
      decisions,
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
