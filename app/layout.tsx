import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Oswald } from "next/font/google";
import Link from "next/link";

import "./globals.css";

import FloatingVideo from "@/components/broadcast/FloatingVideo";
import { TeamProvider } from "@/contexts/TeamContext";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "La Vuelta Del Play",
    template: "%s | La Vuelta Del Play",
  },
  description:
    "¡La pelota se vive aquí! Sigue las Águilas Cibaeñas y todo el béisbol dominicano.",
  applicationName: "La Vuelta Del Play",
  appleWebApp: {
    capable: true,
    title: "La Vuelta Del Play",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${oswald.variable} ${nunitoSans.variable}`}>
        <TeamProvider>
          <header className=" top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
              <div>
                <h1 className="font-[family-name:var(--font-oswald)] text-xl font-bold tracking-wide sm:text-2xl">
                  LA VUELTA <span className="text-primary">DEL PLAY</span>
                </h1>
                <p className="text-[10px] font-bold tracking-widest text--muted">
                  ¡LA PELOTA SE VIVE AQUÍ!
                </p>
              </div>

              <button
                type="button"
                aria-label="Idioma actual: español"
                className="rounded-full border border-border px-3 py-2 text-xs font-extrabold text-primary"
              >
                ES <span className="text-subtle">/ EN</span>
              </button>
            </div>
          </header>

          <FloatingVideo />
          {children}
          <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-overlay/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
              <Link
                href="/#"
                className="flex flex-col items-center justify-center gap-1 text-primary"
              >
                <span className="text-xl">⌂</span>
                <span className="text-[10px] font-bold">Inicio</span>
              </Link>
              <Link
                href="/#marcadores"
                className="flex flex-col items-center justify-center gap-1 text--muted"
              >
                <span className="text-xl">⚾</span>
                <span className="text-[10px] font-bold">Marcadores</span>
              </Link>
              <Link
                href="/#posiciones"
                className="flex flex-col items-center justify-center gap-1 text--muted"
              >
                <span className="text-xl">🏆</span>
                <span className="text-[10px] font-bold">Posiciones</span>
              </Link>
              <Link
                href="/#juegos"
                className="flex flex-col items-center justify-center gap-1 text--muted"
              >
                <span className="text-xl">📅</span>
                <span className="text-[10px] font-bold">Juegos</span>
              </Link>
            </div>
          </nav>
        </TeamProvider>
      </body>
    </html>
  );
}
