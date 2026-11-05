"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTeam, type TeamId } from "@/contexts/TeamContext";

const PLAYLISTS: Record<TeamId, string> = {
  aguilas: "PLWyVDPWZPY-2e_KlcP35g7IFHrOpoSaLg",
  yankees: "PLQuo11i5dqjh27TPCDhZoX_Wz68Val4ai",
};

const TEAM_NAMES: Record<TeamId, string> = {
  aguilas: "Águilas Cibaeñas",
  yankees: "New York Yankees",
};

interface FloatingVideoProps {
  children: ReactNode;
}

export default function FloatingVideo({ children }: FloatingVideoProps) {
  const { setSelectedTeam } = useTeam();

  const [videoTeam, setVideoTeam] = useState<TeamId>("aguilas");
  const [isMini, setIsMini] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderHidden(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  function handleTeamChange() {
    const nextTeam: TeamId = videoTeam === "aguilas" ? "yankees" : "aguilas";

    setVideoTeam(nextTeam);
    setSelectedTeam(nextTeam);
  }

  const isVideoAguilas = videoTeam === "aguilas";

  // Mobile: preserve the original 40dvh dimensions.
  // Desktop: preserve the larger desktop dimensions.
  const sizeClasses = isMini
    ? "h-[220px] min-h-[220px] max-h-[220px] lg:h-[230px] lg:min-h-[230px] lg:max-h-[230px]"
    : "h-[calc(40dvh+64px)] min-h-[284px] max-h-[484px] lg:h-[calc(min(30vw,525px)+64px)] lg:min-h-0 lg:max-h-none";

  return (
    <>
      <section
        data-floating-video
        className={`sticky z-30 w-full border-b border-border bg-background shadow-2xl transition-[height,top] duration-300 ${
          isHeaderHidden ? "top-0" : "top-16"
        } ${sizeClasses}`}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-2 overflow-hidden p-2">
          {/* VIDEO */}

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-primary p-1 lg:p-2">
            <div
              className={`relative aspect-video shrink-0 max-h-full ${
                isMini
                  ? "h-full w-auto max-w-[50%] lg:max-w-[50%]"
                  : "h-full w-full lg:w-auto lg:max-w-full"
              }`}
            >
              <iframe
                key={videoTeam}
                className="absolute inset-0 h-full w-full rounded-md border-0"
                src={`https://www.youtube.com/embed/videoseries?list=${PLAYLISTS[videoTeam]}`}
                title={`La Vuelta Del Play - ${TEAM_NAMES[videoTeam]}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          {/* CONTROLS */}

          <div className="flex shrink-0 items-center justify-between gap-2 rounded-lg bg-surface-overlay px-2 py-2 sm:px-4">
            {/* TEAM INFORMATION */}

            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xl text-on-primary">
                {isVideoAguilas ? "🇩🇴" : "🇺🇸"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-white sm:text-sm">
                  {TEAM_NAMES[videoTeam]}
                </p>

                <p className="truncate text-[10px] text-muted sm:text-xs">
                  {isVideoAguilas ? "KQ94.5" : "Major League Baseball podcasts"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleTeamChange}
                className="rounded-lg border border-primary px-3 py-2 text-[10px] font-extrabold text-white transition-colors hover:bg-primary-hover sm:text-xs"
              >
                {videoTeam === "aguilas" ? "🇺🇸 YANKEES" : "🇩🇴 ÁGUILAS"}
              </button>

              <button
                type="button"
                onClick={() => setIsMini((previous) => !previous)}
                aria-label={isMini ? "Maximizar video" : "Minimizar video"}
                aria-pressed={isMini}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent text-accent transition-colors hover:bg-accent hover:text-background"
              >
                {isMini ? "⛶" : "⊖"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WEBSITE CONTENT */}

      <div className="font-athletic">{children}</div>
    </>
  );
}
