"use client";
import { useTeam } from "@/contexts/TeamContext";

export default function Footer() {
  const { selectedTeam } = useTeam();

  return (
    <footer className="px-4 pb-8 pt-12 text-center">
      <p className="font-[family-name:var(--font-oswald)] text-xl font-bold text-primary">
        {selectedTeam === "aguilas"
          ? " ¡ARRIBA LAS ÁGUILAS!"
          : "Lets Go Yankees!"}
      </p>
      <p className="mt-3 text-xs text-[#777777]">
        La Vuelta Del Play · Proyecto independiente de béisbol.
      </p>
    </footer>
  );
}
