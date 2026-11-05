/**
 * Dominican Republic date and season helpers.
 */

const TIME_ZONE = "America/Santo_Domingo";

function formatDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function getLocalDate(): string {
  return formatDate(new Date());
}

export function getCurrentLidomSeason(): number {
  const date = new Date();

  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      month: "numeric",
    }).format(date),
  );

  const year = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
    }).format(date),
  );

  return month >= 10 ? year : year - 1;
}

export function getGameLocalDate(
  gameDate?: string,
  officialDate?: string,
): string {
  if (officialDate) return officialDate;

  if (!gameDate) return "";

  const parsedDate = new Date(gameDate);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return formatDate(parsedDate);
}
