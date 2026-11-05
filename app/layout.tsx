import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Oswald } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import FloatingVideo from "@/components/broadcast/FloatingVideo";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/layout/LanguageToggle";

import { TeamProvider } from "@/contexts/TeamContext";

const logoFont = localFont({
  src: "../public/fonts/PunkrockshowRegular-xP4m.ttf",
  variable: "--font-logo",
});

const varsityFont = localFont({
  src: "../public/fonts/sport brand.ttf",
  variable: "--font-varsity",
});

const athleticFont = localFont({
  src: "../public/fonts/EA Sports Covers SC 1.5.ttf",
  variable: "--font-athletic",
});

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
  function scrollToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    event.preventDefault();

    const target = document.getElementById(id);
    const video = document.querySelector("[data-floating-video]");

    if (!target) return;

    const videoBottom = video ? video.getBoundingClientRect().bottom : 0;

    const margin = 28;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      videoBottom -
      margin;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `/#${id}`);
  }

  return (
    <html lang="es">
      <body
        className={`${oswald.variable} ${nunitoSans.variable} ${logoFont.variable} ${varsityFont.variable} ${athleticFont.variable}`}
      >
        <TeamProvider>
          <LanguageProvider>
            <header className=" top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
              <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <div>
                  <h1 className="font-logo text-team-secondary text-xl font-bold  uppercase tracking-wide sm:text-5xl">
                    LA VUELTA{" "}
                    <span className="text-team-secondary lowercase font-extrabold">
                      DEL PLAY
                    </span>
                  </h1>
                  <p className="text-[15px] font-logo uppercase font-bold tracking-widest text-accent">
                    ¡LA PELOTA SE VIVE AQUÍ!
                  </p>
                </div>

                <LanguageToggle />
              </div>
            </header>

            <FloatingVideo>
              <>
                {children}
                <Footer />
              </>
            </FloatingVideo>
            <BottomNav />
          </LanguageProvider>
        </TeamProvider>
      </body>
    </html>
  );
}
