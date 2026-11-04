import { NextResponse } from "next/server";

import { getBaseballStandings } from "@/lib/baseball/standings";

export async function GET() {
  try {
    const standings = await getBaseballStandings();

    return NextResponse.json(standings);
  } catch (error) {
    console.error("LIDOM standings API error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve LIDOM standings.",
      },
      {
        status: 502,
      },
    );
  }
}
