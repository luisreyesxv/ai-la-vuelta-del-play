import Scoreboard from "@/components/scoreboard/Scoreboard";
import Standings from "@/components/standings/Standings";
import Schedule from "@/components/schedule/Schedule";

export default function Home() {
  return (
    <main className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
      <div className="mx-auto max-w-6xl">
        <section id="marcadores" className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <Scoreboard />
        </section>

        <section className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <Standings />
        </section>

        <section className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <Schedule />
        </section>

        {/* <Footer /> */}
      </div>
    </main>
  );
}
