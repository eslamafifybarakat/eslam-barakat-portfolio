/** Parses a `Cookie` header (or `document.cookie`) into a plain map. */
export function parseCookies(header: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;

  for (const pair of header.split(';')) {
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    const key = pair.slice(0, eq).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(pair.slice(eq + 1).trim());
  }

  return out;
}

export function serializeCookie(
  name: string,
  value: string,
  opts: { maxAgeDays?: number; path?: string } = {},
): string {
  const { maxAgeDays = 365, path = '/' } = opts;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  return `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; samesite=lax`;
}
