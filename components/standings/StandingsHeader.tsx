import { useLanguage } from "@/contexts/LanguageContext";

export default function StandingsHeader() {
  const { t } = useLanguage();

  return (
    <div
      className="grid grid-cols-[36px_minmax(0,1fr)_36px_36px_48px] gap-2 border-b border-white/10 px-3 py-3 text-[10px] 
    font-varsity text-team-secondary font-extrabold uppercase tracking-wider"
    >
      <span>#</span>
      <span>{t("team")}</span>
      <span className="text-center"> {t("gamesWon")}</span>
      <span className="text-center">{t("gamesLost")}</span>
      <span className="text-right">{t("winningPercentage")}</span>
    </div>
  );
}
