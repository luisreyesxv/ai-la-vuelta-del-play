import { NextResponse } from "next/server";

import { getFeaturedGame } from "@/lib/baseball/featured-game";

export async function GET() {
  try {
    const featuredGame = await getFeaturedGame();

    return NextResponse.json(featuredGame, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Baseball API] Featured game error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve yesterday's featured game.",
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
