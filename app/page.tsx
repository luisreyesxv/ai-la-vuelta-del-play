import FloatingVideo from "@/components/broadcast/FloatingVideo";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
      <header className="sticky top-0 z-40 border-b border-[#3a3a3a] bg-[#111111]/95 backdrop-blur">
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
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
                Sigue la pelota
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase">
                Marcadores
              </h2>
            </div>
            <span className="text-xs text-[#999999]">LIDOM</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#806600] bg-gradient-to-br from-[#29230c] to-[#191919] p-4 sm:p-6">
            <div className="pointer-events-none absolute -right-5 -top-7 text-8xl opacity-[0.07]">
              ⚾
            </div>
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f5c400]" />
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#f5c400]">
                  Nuestro equipo
                </p>
              </div>
              <h3 className="font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase">
                Águilas Cibaeñas
              </h3>
              <p className="mt-1 text-sm text-[#b8b8b8]">
                Aquí seguimos a las Águilas.
              </p>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm text-[#d8d8d8]">
                  Los marcadores aparecerán aquí cuando estén disponibles.
                </p>
              </div>
            </div>
          </div>

          <div
            id="juegos"
            className="scroll-mt-20 mt-4 rounded-xl border border-[#3a3a3a] bg-[#242424] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🏟️</span>
              <h3 className="font-[family-name:var(--font-oswald)] text-lg font-bold uppercase">
                Juegos de LIDOM
              </h3>
            </div>
            <p className="mt-2 text-sm text-[#999999]">
              Consulta los resultados y próximos encuentros de todos los
              equipos.
            </p>
          </div>
        </section>

        <section id="posiciones" className="scroll-mt-20 px-4 pt-8 sm:px-6">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f5c400]">
              La temporada
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase">
              Béisbol dominicano
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="#posiciones"
              className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-4 transition-colors hover:border-[#f5c400]"
            >
              <span className="text-2xl">🏆</span>
              <h3 className="mt-3 font-bold">Posiciones</h3>
              <p className="mt-1 text-xs text-[#999999]">Tabla de la liga</p>
            </a>

            <a
              href="#juegos"
              className="rounded-xl border border-[#3a3a3a] bg-[#242424] p-4 transition-colors hover:border-[#f5c400]"
            >
              <span className="text-2xl">📅</span>
              <h3 className="mt-3 font-bold">Calendario</h3>
              <p className="mt-1 text-xs text-[#999999]">Próximos encuentros</p>
            </a>
          </div>
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
