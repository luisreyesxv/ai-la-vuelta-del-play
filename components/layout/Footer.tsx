"use client";
import { useTeam } from "@/contexts/TeamContext";

export default function Footer() {
  const { selectedTeam } = useTeam();

  return (
    <footer className="px-4 pb-8 pt-12 text-center">
      <p className="font-[family-name:var(--font-oswald)] text-xl font-bold text-accent uppercase">
        {selectedTeam === "aguilas"
          ? " ¡ARRIBA LAS ÁGUILAS!"
          : "Let's Go Yankees!"}
      </p>
      <p className="mt-3 text-xs text-subtle">
        La Vuelta Del Play · Independent baseball project.
      </p>
    </footer>
  );
}
