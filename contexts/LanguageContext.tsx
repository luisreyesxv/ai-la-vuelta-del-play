"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "es" | "en";

const WILDCARD = "%";

const translations = {
  es: {
    home: "Inicio",
    scores: "Marcadores",
    standings: "Posiciones",
    games: "Juegos",
    latestUpdate: "Última actualización",
    refresh: "Actualizar",
    refreshing: "Actualizando",
    loading: "Cargando...",
    unavailable: "Información no disponible",
    recentPerformance: "Rendimiento reciente",
    lastFiveGames: "Últimos 5 partidos",
    wins: "Ganados",
    losses: "Perdidos",
    victories: "Victorias",
    changeBroadcast: "CAMBIAR TRANSMISIÓN",
    maximize: "MAXIMIZAR",
    minimize: "MINIMIZAR",
    latestEpisode: "Episodio más reciente",
    gameDetails: "Detalles del partido",
    summary: "Resumen",
    batting: "Bateadores",
    pitching: "Lanzadores",
    awayTeam: "Visitante",
    homeTeam: "Local",
    battingStats: "Estadísticas de bateadores",
    pitchingStats: "Estadísticas de lanzadores",
    gameDecisions: "Decisiones del partido",
    winningPitcher: "Pitcher ganador",
    losingPitcher: "Pitcher perdedor",
    save: "Juego salvado",
    inningResults: "Resultados por entrada",
    noRecentResults: "No hay resultados recientes disponibles.",
    noStats: "Las estadísticas no están disponibles.",
    player: "Jugador",
    pitcher: "Lanzador",
    team: "Equipo",
    rank: "Posición",
    loadingGame: "Cargando detalles del partido...",
    loadingStandings: "Cargando posiciones",
    back: "VOLVER",
    followBaseball: "Sigue la pelota",
    tryAgain: "Intentar de nuevo",
    ourTeam: "Nuestro equipo",
    viewGameDetails: "VER DETALLES DEL PARTIDO",
    dataRetrieved: "Datos consultados",
    noFinalGameAvailable: "Todavía no hay un partido finalizado disponible.",
    updateFailed:
      "No se pudo actualizar. Mostrando los últimos datos recibidos.",
    season: "La temporada",
    leagueStandingDescription: `Así marcha ${WILDCARD} en su liga.`,
    noStandingsAvailable: "No hay posiciones disponibles actualmente",
    showingLatestData: "Mostrando los últimos datos recibidos.",
    gamesLost: "JP",
    gamesWon: "JG",
    winningPercentage: "PCT",
    lastGame: "Último partido",
    live: "EN VIVO",
    final: "FINAL",
    scheduled: "PROGRAMADO",
    delayed: "DEMORADO",
    postponed: "POSPUESTO",
    suspended: "SUSPENDIDO",
    cancelled: "CANCELADO",
    unknown: "ESTADO DESCONOCIDO",
    loadingCalendar: `Cargando calendario de ${WILDCARD}`,
    failLoadingCalendar: "No fue posible cargar el calendario",
    calendar: "Calendario",
    followTheTeam: `Sigue cada paso de ${WILDCARD}.`,
    upcoming: "PRÓXIMOS",
    completed: "FINALIZADOS",
    noGamesAvailable: "No hay partidos disponibles.",
    moreGamesComingSoon: `Próximamente tendremos más acción de ${WILDCARD}.`,
    noCompletedGames: `Todavía no hay partidos finalizados de ${WILDCARD}.`,
    noSuspendedGames: `No hay partidos suspendidos de ${WILDCARD}.`,
    finalStatistics: "Estadísticas finales",
    inningResultsUnavailable: "Resultados por entrada no disponibles",
    loadingStatistics: "Cargando estadísticas...",
    statisticsUnavailable: "Las estadísticas no están disponibles.",
    statisticsNotAvailable: "Estadísticas no disponibles",
  },

  en: {
    home: "Home",
    scores: "Scores",
    standings: "Standings",
    games: "Games",
    latestUpdate: "Last updated",
    refresh: "Refresh",
    refreshing: "Refreshing",
    loading: "Loading...",
    unavailable: "Information unavailable",
    recentPerformance: "Recent performance",
    lastFiveGames: "Last 5 games",
    wins: "Wins",
    losses: "Losses",
    victories: "Winning percentage",
    changeBroadcast: "CHANGE BROADCAST",
    maximize: "MAXIMIZE",
    minimize: "MINIMIZE",
    latestEpisode: "Latest episode",
    gameDetails: "Game details",
    summary: "Summary",
    batting: "Batting",
    pitching: "Pitching",
    awayTeam: "Away",
    homeTeam: "Home",
    battingStats: "Batting statistics",
    pitchingStats: "Pitching statistics",
    gameDecisions: "Game decisions",
    winningPitcher: "Winning pitcher",
    losingPitcher: "Losing pitcher",
    save: "Save pitcher",
    inningResults: "Runs by inning",
    noRecentResults: "No recent results available.",
    noStats: "Statistics are unavailable.",
    player: "Player",
    pitcher: "Pitcher",
    team: "Team",
    rank: "Rank",
    loadingGame: "Loading game details...",
    loadingStandings: "Loading standings",
    back: "BACK",
    followBaseball: "Follow the Game",
    tryAgain: "Try Again",
    ourTeam: "Our team",
    viewGameDetails: "VIEW GAME DETAILS",
    dataRetrieved: "Data retrieved",
    noFinalGameAvailable: "There is no completed game available yet.",
    updateFailed: "Update failed. Showing the latest data received.",
    season: "The season",
    leagueStandingDescription: `Here's how ${WILDCARD} are doing in its league.`,
    noStandingsAvailable: "Standings are currently unavailable",
    showingLatestData: "Showing the latest data received.",
    gamesLost: "L",
    gamesWon: "W",
    winningPercentage: "PCT",
    lastGame: "Last Game",
    live: "LIVE",
    final: "FINAL",
    scheduled: "SCHEDULED",
    delayed: "DELAYED",
    postponed: "POSTPONED",
    suspended: "SUSPENDED",
    cancelled: "CANCELLED",
    unknown: "UNKNOWN STATUS",
    loadingCalendar: `Loading ${WILDCARD} schedule`,
    failLoadingCalendar: "Unable to load the schedule",
    calendar: "Schedule",
    followTheTeam: `Follow every step of the ${WILDCARD}.`,
    upcoming: "Upcoming",
    completed: "Completed",
    noGamesAvailable: "No games available.",
    moreGamesComingSoon: `More ${WILDCARD} action coming soon.`,
    noCompletedGames: `There are no completed ${WILDCARD} games yet.`,
    noSuspendedGames: `There are no suspended ${WILDCARD} games.`,
    finalStatistics: "Final Statistics",
    inningResultsUnavailable: "Inning-by-inning results unavailable",
    loadingStatistics: "Loading statistics...",
    statisticsUnavailable: "Statistics are unavailable.",
    statisticsNotAvailable: "Statistics unavailable",
  },
} as const;

type TranslationKey = keyof typeof translations.es;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  tReplace: (key: TranslationKey, replacement: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language");

    if (saved === "es" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    localStorage.setItem("preferred-language", nextLanguage);
  }

  function toggleLanguage() {
    setLanguage(language === "es" ? "en" : "es");
  }

  function t(key: TranslationKey) {
    return translations[language][key];
  }

  function tReplace(key: TranslationKey, replacement: string) {
    return t(key).replaceAll(WILDCARD, replacement);
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, tReplace }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
