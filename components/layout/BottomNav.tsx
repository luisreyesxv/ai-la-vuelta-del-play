"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

function scrollToSection(
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string,
) {
  event.preventDefault();

  const target = document.getElementById(id);
  const video = document.querySelector<HTMLElement>("[data-floating-video]");

  if (!target) return;

  const videoHeight = video?.offsetHeight ?? 0;

  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - videoHeight;

  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: "smooth",
  });

  window.history.replaceState(null, "", `/#${id}`);
}

export default function BottomNav() {
  const { t } = useLanguage();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-overlay/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
        <Link
          href="/#"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            window.history.replaceState(null, "", "/");
          }}
          className="flex flex-col items-center justify-center gap-1 text-primary"
        >
          <span className="text-xl">⌂</span>
          <span className="text-[10px] font-bold">{t("home")}</span>
        </Link>

        <Link
          href="/#marcadores"
          onClick={(e) => scrollToSection(e, "marcadores")}
          className="flex flex-col items-center justify-center gap-1 text-muted"
        >
          <span className="text-xl">⚾</span>
          <span className="text-[10px] font-bold">{t("scores")}</span>
        </Link>

        <Link
          href="/#posiciones"
          onClick={(e) => scrollToSection(e, "posiciones")}
          className="flex flex-col items-center justify-center gap-1 text-muted"
        >
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-bold">{t("standings")}</span>
        </Link>

        <Link
          href="/#juegos"
          onClick={(e) => scrollToSection(e, "juegos")}
          className="flex flex-col items-center justify-center gap-1 text-muted"
        >
          <span className="text-xl">📅</span>
          <span className="text-[10px] font-bold">{t("games")}</span>
        </Link>
      </div>
    </nav>
  );
}
