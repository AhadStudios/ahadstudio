export const WORLD_CLOCK_CITIES = [
  { id: "new-york", flag: "🇺🇸", name: "New York", timeZone: "America/New_York" },
  { id: "berlin", flag: "🇩🇪", name: "Berlin", timeZone: "Europe/Berlin" },
  { id: "sydney", flag: "🇦🇺", name: "Sydney", timeZone: "Australia/Sydney" },
  { id: "tokyo", flag: "🇯🇵", name: "Tokyo", timeZone: "Asia/Tokyo" },
  { id: "london", flag: "🇬🇧", name: "London", timeZone: "Europe/London" },
];

export function formatCityTime(timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(new Date());
}
