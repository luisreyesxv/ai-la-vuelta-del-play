import { NextResponse } from "next/server";

import { getCurrentLidomSeason } from "@/lib/baseball/dates";
import { getSeasonSchedule } from "@/lib/baseball/schedule";
import { normalizeGame } from "@/lib/baseball/normalize";

export async function GET() {
  try {
    const season = getCurrentLidomSeason();

    const rawGames = await getSeasonSchedule(season);

    const games = rawGames
      .map(normalizeGame)
      .filter((game) => game !== null)
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
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("LIDOM schedule API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve LIDOM schedule." },
      { status: 502 },
    );
  }
}
