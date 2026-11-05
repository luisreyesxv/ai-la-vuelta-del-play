import { GameStatusType } from "@/types/baseball";

interface GameStatusProps {
  status: GameStatusType;
  description?: string | null;
}

const STATUS_LABELS: Record<GameStatusType, string> = {
  live: "EN VIVO",
  final: "FINAL",
  scheduled: "PROGRAMADO",
  delayed: "DEMORADO",
  postponed: "POSPUESTO",
  suspended: "SUSPENDIDO",
  cancelled: "CANCELADO",
  unknown: "ESTADO DESCONOCIDO",
};

export default function GameStatus({ status, description }: GameStatusProps) {
  const isLive = status === "live";

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
        {STATUS_LABELS[status]}
      </span>

      {description && status === "delayed" && (
        <span className="text-[10px] text--muted">{description}</span>
      )}
    </div>
  );
}
