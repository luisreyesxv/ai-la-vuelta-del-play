import { TeamStanding } from "@/types/baseball";

import StandingsHeader from "./StandingsHeader";
import StandingsRow from "./StandingsRow";

interface StandingsTableProps {
  standings: TeamStanding[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <StandingsHeader />

      {standings.map((standing) => (
        <StandingsRow key={standing.team.id} standing={standing} />
      ))}
    </div>
  );
}
