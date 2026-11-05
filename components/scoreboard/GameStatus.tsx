import { GameStatusType } from "@/types/baseball";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameStatusProps {
  status: GameStatusType;
  description?: string | null;
}

export default function GameStatus({ status, description }: GameStatusProps) {
  const isLive = status === "live";
  const { t } = useLanguage();

  function STATUS_LABELS(status: GameStatusType): string {
    const labels = {
      live: t("live"),
      final: t("final"),
      scheduled: t("scheduled"),
      delayed: t("delayed"),
      postponed: t("postponed"),
      suspended: t("suspended"),
      cancelled: t("cancelled"),
      unknown: t("unknown"),
    };
    return labels[status];
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          isLive
            ? "animate-pulse bg-red-500"
            : status === "final"
              ? "bg-primary"
              : "bg-subtle"
        }`}
      />

      <span className="text-[10px] font-extrabold tracking-widest text--secondary">
        {STATUS_LABELS(status)}
      </span>

      {description && status === "delayed" && (
        <span className="text-[10px] text-muted">{description}</span>
      )}
    </div>
  );
}
