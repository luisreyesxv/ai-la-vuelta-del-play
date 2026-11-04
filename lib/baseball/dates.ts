/**
 * Dominican Republic date and season helpers.
 */

const TIME_ZONE = "America/Santo_Domingo";

export function getDateParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function getLocalDate(): string {
  const date = getDateParts();

  return `${date.year}-${date.month}-${date.day}`;
}

export function getCurrentLidomSeason(): number {
  const date = getDateParts();

  const year = Number(date.year);
  const month = Number(date.month);

  return month >= 10 ? year : year - 1;
}

export function getGameLocalDate(
  gameDate?: string,
  officialDate?: string,
): string {
  if (officialDate) return officialDate;

  if (!gameDate) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(gameDate));

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}
