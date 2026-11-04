import Scoreboard from "@/components/scoreboard/Scoreboard";
import Standings from "@/components/standings/Standings";
import Schedule from "@/components/schedule/Schedule";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
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
    </main>
  );
}
