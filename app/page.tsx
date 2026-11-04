import FloatingVideo from "@/components/broadcast/FloatingVideo";
import Scoreboard from "@/components/scoreboard/Scoreboard";
import Standings from "@/components/standings/Standings";
import Schedule from "@/components/schedule/Schedule";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
      <header className=" top-0 z-40 border-b border-[#3a3a3a] bg-[#111111]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="font-[family-name:var(--font-oswald)] text-xl font-bold tracking-wide sm:text-2xl">
              LA VUELTA <span className="text-[#f5c400]">DEL PLAY</span>
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-[#999999]">
              ¡LA PELOTA SE VIVE AQUÍ!
            </p>
          </div>

          <button
            type="button"
            aria-label="Idioma actual: español"
            className="rounded-full border border-[#3a3a3a] px-3 py-2 text-xs font-extrabold text-[#f5c400]"
          >
            ES <span className="text-[#777777]">/ EN</span>
          </button>
        </div>
      </header>

      <FloatingVideo />

      <div className="mx-auto max-w-6xl">
        <section id="marcadores" className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <Scoreboard />
        </section>

        <section id="posiciones" className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <Standings />
        </section>

        <section id="juegos" className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <Schedule />
        </section>

        <footer className="px-4 pb-8 pt-12 text-center">
          <p className="font-[family-name:var(--font-oswald)] text-xl font-bold text-[#f5c400]">
            ¡ARRIBA LAS ÁGUILAS!
          </p>
          <p className="mt-3 text-xs text-[#777777]">
            La Vuelta Del Play · Proyecto independiente de béisbol.
          </p>
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#3a3a3a] bg-[#181818]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
          <a
            href="#"
            className="flex flex-col items-center justify-center gap-1 text-[#f5c400]"
          >
            <span className="text-xl">⌂</span>
            <span className="text-[10px] font-bold">Inicio</span>
          </a>
          <a
            href="#marcadores"
            className="flex flex-col items-center justify-center gap-1 text-[#999999]"
          >
            <span className="text-xl">⚾</span>
            <span className="text-[10px] font-bold">Marcadores</span>
          </a>
          <a
            href="#posiciones"
            className="flex flex-col items-center justify-center gap-1 text-[#999999]"
          >
            <span className="text-xl">🏆</span>
            <span className="text-[10px] font-bold">Posiciones</span>
          </a>
          <a
            href="#juegos"
            className="flex flex-col items-center justify-center gap-1 text-[#999999]"
          >
            <span className="text-xl">📅</span>
            <span className="text-[10px] font-bold">Juegos</span>
          </a>
        </div>
      </nav>
    </main>
  );
}
