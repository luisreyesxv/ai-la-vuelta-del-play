"use client";

import { useEffect, useState } from "react";
import { useTeam, type TeamId } from "@/contexts/TeamContext";

const PLAYLISTS: Record<TeamId, string> = {
  aguilas: "PLWyVDPWZPY-2e_KlcP35g7IFHrOpoSaLg",
  yankees: "PLQuo11i5dqjh27TPCDhZoX_Wz68Val4ai",
};

const TEAM_NAMES: Record<TeamId, string> = {
  aguilas: "Águilas Cibaeñas",
  yankees: "New York Yankees",
};

export default function FloatingVideo() {
  const { selectedTeam, setSelectedTeam } = useTeam();

  // Independent state: changing the baseball team never changes this.
  const [videoTeam, setVideoTeam] = useState<TeamId>("aguilas");

  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");

    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hidden = !entry.isIntersecting;

        setIsHeaderHidden((previous) =>
          previous === hidden ? previous : hidden,
        );
      },
      { threshold: 0 },
    );

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  /**
   * Changes baseball information only.
   * The YouTube iframe remains untouched.
   */
  function handleInformationTeamChange(team: TeamId) {
    setSelectedTeam(team);
  }

  /**
   * Changes the broadcast only after explicit confirmation.
   */

  function handleBroadcastChange() {
    if (selectedTeam === videoTeam) return;

    const currentTeamName = TEAM_NAMES[videoTeam];
    const nextTeamName = TEAM_NAMES[selectedTeam];

    const confirmed = window.confirm(
      `¿Cambiar la transmisión?\n\n` +
        `Actualmente estás viendo: ${currentTeamName}.\n\n` +
        `La información del equipo puede cambiar sin interrumpir ` +
        `el video actual.\n\n` +
        `Si continúas, la transmisión actual de ${currentTeamName} ` +
        `será reemplazada por la transmisión de ${nextTeamName}.\n\n` +
        `¿Deseas continuar?`,
    );

    if (!confirmed) return;

    setVideoTeam(selectedTeam);
  }

  const isVideoAguilas = videoTeam === "aguilas";

  const isSelectedTeamDifferent = selectedTeam !== videoTeam;

  return (
    <>
      <div
        aria-hidden="true"
        className="h-[40dvh] min-h-[220px] max-h-[420px] lg:h-[min(30vw,70dvh)] lg:min-h-0 lg:max-h-none"
      />

      <section
        className={`fixed inset-x-0 z-30 h-[40dvh] min-h-[220px] max-h-[420px] border-b border-[#3a3a3a] bg-background p-2 shadow-2xl transition-all duration-200 lg:h-[min(30vw,70dvh)] lg:min-h-0 lg:max-h-none ${
          isHeaderHidden ? "top-0" : "top-16"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-sm bg-primary p-1 lg:p-2">
            <div className="relative h-full aspect-video max-w-full">
              <iframe
                key={videoTeam}
                className="absolute inset-0 h-full w-full rounded-sm border-0"
                src={`https://www.youtube.com/embed/videoseries?list=${PLAYLISTS[videoTeam]}`}
                title={`La Vuelta Del Play - ${TEAM_NAMES[videoTeam]}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 bg-[#181818] px-4 py-2 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-black">
                ⚾
              </div>

              <div className="min-w-0">
                <p className="text-sm font-extrabold text-white">
                  {TEAM_NAMES[videoTeam]}
                </p>

                <p className="text-xs text-[#999999]">
                  {isVideoAguilas
                    ? "Béisbol dominicano"
                    : "Major League Baseball"}
                </p>

                <p className="text-[10px] text-primary">Transmisión actual</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 text-primary">
              {isSelectedTeamDifferent && (
                <button
                  type="button"
                  onClick={handleBroadcastChange}
                  className="w-full rounded-lg border border-primary px-3 py-2 text-xs 
                  font-extrabold transition-colors duration-200
                   hover:border-red-500 hover:text-red-500 sm:w-auto
"
                >
                  CAMBIAR TRANSMISIÓN →
                </button>
              )}
              <button
                type="button"
                onClick={() => handleInformationTeamChange("aguilas")}
                aria-pressed={selectedTeam === "aguilas"}
                className={`rounded-lg px-3 py-2 text-xs font-extrabold transition-colors ${
                  selectedTeam === "aguilas"
                    ? "bg-primary text-black"
                    : "border border-[#444444] text-white"
                }`}
              >
                🦅 ÁGUILAS
              </button>

              <button
                type="button"
                onClick={() => handleInformationTeamChange("yankees")}
                aria-pressed={selectedTeam === "yankees"}
                className={`rounded-lg px-3 py-2 text-xs font-extrabold transition-colors ${
                  selectedTeam === "yankees"
                    ? "bg-primary text-black"
                    : "border border-[#444444] text-white"
                }`}
              >
                ⚾ YANKEES
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
