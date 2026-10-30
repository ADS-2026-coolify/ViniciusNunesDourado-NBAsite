export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/nba";

export async function fetchNba<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Erro ao carregar dados da NBA (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function formatDatePtBr(isoOrYmd: string, includeWeekday = true): string {
  if (!isoOrYmd) return "";
  const date =
    isoOrYmd.length === 10
      ? new Date(`${isoOrYmd}T12:00:00`)
      : new Date(isoOrYmd);

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: includeWeekday ? "short" : undefined,
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

export function formatTimePtBr(isoString: string): string {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatFullDatePtBr(ymd: string): string {
  if (!ymd) return "";
  const date = new Date(`${ymd.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function shiftDateYmd(ymd: string, deltaDays: number): string {
  const clean = ymd.slice(0, 10);
  const [y, m, d] = clean.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function ensureVisibleColor(hex: string): string {
  const clean = (hex || "#f97316").replace("#", "");
  if (clean.length !== 6) return "#f97316";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  // Boost very dark team colors (e.g. Spurs #000000 or Clippers #12173f) so glows look vivid on dark UI
  if (luminance < 42) {
    return "#f97316";
  }
  return `#${clean}`;
}
