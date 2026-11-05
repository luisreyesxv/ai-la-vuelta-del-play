"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  useEffect,
  type ReactNode,
} from "react";

export type TeamId = "aguilas" | "yankees";

type TeamContextType = {
  selectedTeam: TeamId;
  setSelectedTeam: (team: TeamId) => void;
};

const STORAGE_KEY = "la-vuelta-del-play-team";

const TeamContext = createContext<TeamContextType | null>(null);

function getSelectedTeam(): TeamId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    return saved === "yankees" ? "yankees" : "aguilas";
  } catch {
    return "aguilas";
  }
}

function getServerTeam(): TeamId {
  return "aguilas";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("team-selection-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("team-selection-change", callback);
  };
}

export function TeamProvider({ children }: { children: ReactNode }) {
  const selectedTeam = useSyncExternalStore(
    subscribe,
    getSelectedTeam,
    getServerTeam,
  );

  const setSelectedTeam = useCallback((team: TeamId) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, team);
      window.dispatchEvent(new Event("team-selection-change"));
    } catch {
      console.error("Unable to save team preference.");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.team = selectedTeam;
  }, [selectedTeam]);

  return (
    <TeamContext.Provider value={{ selectedTeam, setSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error("useTeam must be used inside TeamProvider");
  }

  return context;
}
