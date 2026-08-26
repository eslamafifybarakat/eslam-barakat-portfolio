/** `https://app.talbinah.net/` → `app.talbinah.net` — used to label project
 * links without repeating the full URL. Falls back to the raw input for a
 * malformed URL rather than throwing. */
export function hostFromUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}
