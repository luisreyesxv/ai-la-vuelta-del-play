interface StandingsUpdateProps {
  updatedAt: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function StandingsUpdate({
  updatedAt,
  isRefreshing,
  onRefresh,
}: StandingsUpdateProps) {
  const formattedDate = updatedAt
    ? new Intl.DateTimeFormat("es-DO", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Santo_Domingo",
      }).format(new Date(updatedAt))
    : null;

  return (
    <div className="flex items-center justify-between gap-3 pt-3">
      <div className="min-w-0">
        <p className="text-[10px] text-[#999999]">Última actualización</p>

        <p className="truncate text-xs font-bold text-[#d8d8d8]">
          {formattedDate ?? "No disponible"}
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="shrink-0 rounded-lg border border-primary-muted  px-3 py-2 text-xs font-extrabold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
      >
        {isRefreshing ? "Actualizando..." : "↻ Actualizar"}
      </button>
    </div>
  );
}
