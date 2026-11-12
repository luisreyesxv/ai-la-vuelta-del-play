# La Vuelta Del Play ⚾📺

> _¡La pelota se vive aquí!_

**La Vuelta Del Play** is a mobile-first bilingual (Spanish/English) baseball companion Progressive Web App (PWA) built specifically for Dominican baseball fans and Águilas Cibaeñas supporters.

It solves a common frustration for fans: having to jump between YouTube playlists to watch game broadcasts and separate sports portals to check live scores, standings, and game schedules. La Vuelta Del Play consolidates the live video broadcast and real-time LIDOM (Liga de Béisbol Profesional de la República Dominicana) statistics into a single, cohesive, dark-themed sports-broadcast destination.

## 🌟 Key Features

- **Persistent Floating YouTube Player:** Automatically fetches and embeds the latest relevant broadcasts from configured YouTube playlists inside a sticky/floating video player that remains active and uninterrupted while users browse game scores, schedules, and standings.
- **Águilas Cibaeñas-First Priority Engine:** Designed with a dedicated team priority hierarchy. It automatically detects yesterday's games using the Dominican Republic timezone (`America/Santo_Domingo`), ensuring Águilas Cibaeñas games always take precedence over fallback or secondary league content.
- **Robust LIDOM Scoreboard & Schedules:** Integrates server-side with the MLB StatsAPI (Sport ID `17`, League ID `131`) to retrieve live scores, box scores, inning-by-inning breakdowns, hits, errors, and pitcher decisions without exposing keys or hitting providers directly from the browser.
- **Smart Historical Fallback:** When no live or current-day games are active, the application gracefully falls back to display the last completed Águilas game, ensuring the main scoreboard remains a useful, living dashboard rather than an empty placeholder.
- **Bilingual Support (ES/EN):** Seamlessly switch between Spanish (default) and English without full-page reloads, preserving video playback state and localizing dates/numbers.
- **Dark Sports-Broadcast Aesthetic:** Built with Tailwind CSS and an authentic stadium-inspired color palette (#111111 dark charcoal background accented with vibrant team gold/yellow highlights).

---

## 🏗️ Technical Architecture

La Vuelta Del Play is built using a modern **Next.js App Router** architecture ensuring server-side security and performance:

```
External MLB / YouTube APIs
↓
Server-Side API Routes & Adapters (/app/api/\*)
↓
Normalized Internal Data Models (/types/baseball.ts)
↓
React Components & Custom Hooks
```

- **Framework:** Next.js (App Router)
- **UI Library:** React & Tailwind CSS
- **Language:** TypeScript
- **Data Sources:** MLB StatsAPI (`https://statsapi.mlb.com/api/v1`) & YouTube Data APIv3

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, pnpm, or yarn

### Installation & Local Development

1. Clone the repository:
   ```bash
   git clone [https://github.com/luisreyesxv/ai-la-vuelta-del-play.git](https://github.com/luisreyesxv/ai-la-vuelta-del-play.git)
   cd ai-la-vuelta-del-play
   Install dependencies:
   ```

Bash
npm install
Create a .env.local file in the root directory and add your credentials:

| .env key            | value                              |
| ------------------- | ---------------------------------- |
| YOUTUBE_API_KEY     | your_youtube_api_key_here          |
| YOUTUBE_PLAYLIST_ID | PLWyVDPWZPY-2e_KlcP35g7IFHrOpoSaLg |

Run the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.

🛠️ Project Structure

```
app/
├── api/
│ ├── baseball/
│ │ ├── games/
│ │ ├── schedule/
│ │ ├── standings/
│ │ └── featured/
│ └── youtube/
│ └── yankees/
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── layout/ # AppHeader, BottomNavigation, AppFooter
├── broadcast/ # FloatingVideo, BroadcastInfo
├── scoreboard/ # Scoreboard, GameCard, TeamScore, GameStatus
├── standings/ # Standings, StandingsTable
└── schedule/ # Schedule, ScheduleCard

lib/
└── baseball/ # api.ts, games.ts, standings.ts, schedule.ts, featured-game.ts

types/
└── baseball.ts # Normalized application TypeScript models
```

## 💡 Key Engineering Challenges & Solutions

Persistent Media State Across Routes: Standard Single Page Applications unmount media players upon navigation. By lifting the YouTube player state and anchoring it to the root layout level, audio/video playback remains completely uninterrupted while users explore complex box scores and league standings.

Timezone-Safe Sports Data Normalization: Standardizing timestamps from MLB StatsAPI into local Caribbean time (America/Santo_Domingo) solved edge cases where late-night games misaligned against server UTC clocks, ensuring accurate "yesterday" game detection.

Resilient Data Contracts: To insulate React components from upstream API volatility, raw JSON responses are piped through robust normalization layers that safely coerce data types, handle missing linescores, and sanitize player decisions.

## 🛡️ License & Disclaimer

This project is an independent fan application created for educational and portfolio purposes. It is not officially affiliated with Águilas Cibaeñas, LIDOM, or Major League Baseball.
