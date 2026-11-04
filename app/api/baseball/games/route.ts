import { NextResponse } from "next/server";

import { getBaseballGames } from "@/lib/baseball/games";
import { StatsApiError } from "@/lib/baseball/api";

/**
 * GET /api/baseball/games
 *
 * Returns normalized LIDOM games.
 *
 * The browser communicates with this route.
 * MLB StatsAPI requests remain server-side.
 */

export async function GET() {
  try {
    const data = await getBaseballGames();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Baseball API] Unable to retrieve LIDOM games:", error);

    if (error instanceof StatsApiError) {
      return NextResponse.json(
        {
          error: "Baseball data is temporarily unavailable.",
        },
        {
          status: 502,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred retrieving baseball data.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
