import { NextResponse } from "next/server";

const PLAYLIST_ID = "PLQuo11i5dqjh27TPCDhZoX_Wz68Val4ai";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key is not configured." },
      { status: 500 },
    );
  }

  try {
    const videos: {
      videoId: string;
      title: string;
      thumbnail: string | null;
    }[] = [];

    let pageToken = "";

    do {
      const params = new URLSearchParams({
        part: "snippet",
        playlistId: PLAYLIST_ID,
        maxResults: "50",
        key: apiKey,
      });

      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
        {
          next: { revalidate: 300 },
        },
      );

      if (!response.ok) {
        throw new Error("YouTube API request failed.");
      }

      const data = await response.json();

      for (const item of data.items ?? []) {
        const title = item.snippet?.title ?? "";
        const videoId = item.snippet?.resourceId?.videoId;

        if (
          videoId &&
          title.toLowerCase().includes("yankees") &&
          title !== "Deleted video" &&
          title !== "Private video"
        ) {
          videos.push({
            videoId,
            title,
            thumbnail:
              item.snippet?.thumbnails?.medium?.url ??
              item.snippet?.thumbnails?.default?.url ??
              null,
          });
        }
      }

      pageToken = data.nextPageToken ?? "";
    } while (pageToken);

    return NextResponse.json(
      { videos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("[YouTube API]", error);

    return NextResponse.json(
      { error: "Unable to retrieve Yankees videos." },
      { status: 502 },
    );
  }
}
