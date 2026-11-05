import { NextRequest, NextResponse } from "next/server";

import { getBaseballGames } from "@/lib/baseball/games";
import { StatsApiError } from "@/lib/baseball/api";

import type { TeamId } from "@/contexts/TeamContext";

export async function GET(request: NextRequest) {
  try {
    const requestedTeam = request.nextUrl.searchParams.get("team") ?? "aguilas";

    if (requestedTeam !== "aguilas" && requestedTeam !== "yankees") {
      return NextResponse.json({ error: "Invalid team." }, { status: 400 });
    }

    const data = await getBaseballGames(requestedTeam as TeamId);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Baseball API] Games error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof StatsApiError
            ? "Baseball data is temporarily unavailable."
            : "Unable to retrieve baseball games.",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
