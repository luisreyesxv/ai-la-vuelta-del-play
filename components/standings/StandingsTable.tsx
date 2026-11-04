import { TeamStanding } from "@/types/baseball";

import StandingsHeader from "./StandingsHeader";
import StandingsRow from "./StandingsRow";

interface StandingsTableProps {
  standings: TeamStanding[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#242424]">
      <StandingsHeader />

      {standings.map((standing) => (
        <StandingsRow key={standing.team.id} standing={standing} />
      ))}
    </div>
  );
}
