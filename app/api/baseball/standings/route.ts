import { NextRequest, NextResponse } from "next/server";

import { getBaseballStandings } from "@/lib/baseball/standings";
import type { TeamId } from "@/contexts/TeamContext";

export async function GET(request: NextRequest) {
  try {
    const requestedTeam = request.nextUrl.searchParams.get("team") ?? "aguilas";

    if (requestedTeam !== "aguilas" && requestedTeam !== "yankees") {
      return NextResponse.json({ error: "Invalid team." }, { status: 400 });
    }

    const data = await getBaseballStandings(requestedTeam as TeamId);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Baseball standings API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve baseball standings." },
      { status: 502 },
    );
  }
}
