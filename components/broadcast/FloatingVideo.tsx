"use client";

import { useEffect, useState } from "react";

const PLAYLIST_ID = "PLWyVDPWZPY-2e_KlcP35g7IFHrOpoSaLg";

export default function FloatingVideo() {
  const [isHeaderHidden, setIsHeaderHidden] = useState<boolean>(false);

  useEffect(() => {
    // Selects your global layout header element
    const header = document.querySelector("header");
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Triggers true as soon as the site header is completely out of the viewport
        setIsHeaderHidden(!entry.isIntersecting);
      },
      {
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      },
    );

    observer.observe(header);

    return () => {
      observer.unobserve(header);
    };
  }, []);

  return (
    <>
      {/* Reserves layout positioning space within the document flow */}
      <div
        aria-hidden="true"
        className="h-[40dvh] min-h-[220px] max-h-[420px] lg:h-[min(30vw,70dvh)] lg:min-h-0 lg:max-h-none"
      />

      {/* 
        Fixed Video Panel:
        Maintains fixed positioning but dynamically adapts to top-0 when the header collapses.
      */}
      <section
        className={`fixed inset-x-0 z-30 h-[40dvh] min-h-[220px] max-h-[420px] border-b border-[#3a3a3a] bg-[#111111] p-2 shadow-2xl transition-all duration-200 lg:h-[min(30vw,70dvh)] lg:min-h-0 lg:max-h-none ${
          isHeaderHidden
            ? "top-0"
            : "top-16" /* Match this value to your physical header element's height layout class */
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#f5c400] p-1 lg:p-2 rounded-sm">
            <div className="relative h-full aspect-video max-w-full">
              <iframe
                className="absolute inset-0 h-full w-full border-0 rounded-sm"
                src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`}
                title="La Vuelta Del Play - Transmisión de béisbol"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 bg-[#181818] px-4 py-2 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5c400] text-lg text-black">
              ⚾
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-white">
                Béisbol dominicano
              </p>
              <p className="text-xs text-[#999999]">
                Disfruta las transmisiones de nuestra playlist
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
