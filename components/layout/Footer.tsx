"use client";

import { useTeam } from "@/contexts/TeamContext";
import { useSyncExternalStore } from "react";

function getYear() {
  return new Date().getFullYear();
}

function subscribe() {
  return () => {};
}

function getServerYear() {
  return 2026;
}

function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getYear, getServerYear);

  return <>{year}</>;
}

export default function Footer() {
  const { selectedTeam } = useTeam();

  return (
    <footer className="w-full px-5 pb-24 pt-12 text-center sm:px-8 lg:px-12 font-athletic">
      <p className=" text-xl font-bold uppercase text-team-secondary">
        {selectedTeam === "aguilas" ? "La Leña Está Aquí" : "LET'S GO YANKEES!"}
      </p>

      <p className="mt-3 text-xs text-subtle">
        <span className="text-accent font-black text-xs">
          La Vuelta Del Play
        </span>{" "}
        · Independent baseball fan project.
      </p>

      <div className="mx-auto mt-5 w-full space-y-3">
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="text-accent font-black text-[15px]">
            La Vuelta Del Play
          </span>{" "}
          is an unofficial, independent fan project. It is not affiliated with,
          endorsed by, or sponsored by MLB, the Águilas Cibaeñas, the New York
          Yankees, or their respective organizations.
        </p>

        <p className="text-[11px] leading-relaxed text-muted">
          All team names, logos, trademarks, and related imagery belong to their
          respective owners and are used for identification purposes only.
        </p>
      </div>

      <p className="mt-5 text-[10px] text-subtle">
        © <CurrentYear />{" "}
        <span className="text-accent font-black text-[13px]">
          La Vuelta Del Play
        </span>
        .
      </p>
    </footer>
  );
}
