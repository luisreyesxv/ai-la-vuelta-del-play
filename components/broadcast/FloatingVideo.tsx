"use client";

import { useEffect, useRef, useState } from "react";

const PLAYLIST_ID = "PLWyVDPWZPY-2e_KlcP35g7IFHrOpoSaLg";

export default function FloatingVideo() {
  const playerSlotRef = useRef(null);
  const [isFloating, setIsFloating] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const slot = playerSlotRef.current;
    if (!slot) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full">
      {/* This slot preserves the page layout while the player floats. */}
      <div
        ref={playerSlotRef}
        className="relative mx-auto aspect-video w-full max-w-6xl bg-black sm:px-6"
      >
        {!isClosed && (
          <div
            className={
              isFloating
                ? "fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-3 z-[60] w-[min(78vw,360px)] overflow-hidden rounded-xl border border-[#3a3a3a] bg-black shadow-2xl sm:bottom-6 sm:right-6"
                : "absolute inset-0 overflow-hidden bg-black sm:rounded-xl"
            }
          >
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`}
                title="La Vuelta Del Play - Transmisión de béisbol"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />

              {isFloating && (
                <button
                  type="button"
                  onClick={() => setIsClosed(true)}
                  aria-label="Cerrar reproductor"
                  className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-xl text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isFloating && !isClosed && (
        <div className="flex items-center gap-3 border-b border-[#3a3a3a] bg-[#181818] px-4 py-3 sm:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5c400] text-xl text-black">
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
      )}
    </section>
  );
}
