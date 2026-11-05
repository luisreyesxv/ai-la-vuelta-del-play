export default function StandingsHeader() {
  return (
    <div className="grid grid-cols-[36px_minmax(0,1fr)_36px_36px_48px] gap-2 border-b border-white/10 px-3 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">
      <span>#</span>
      <span>Equipo</span>
      <span className="text-center">JG</span>
      <span className="text-center">JP</span>
      <span className="text-right">PCT</span>
    </div>
  );
}
