const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

/** Escapes the four HTML-significant characters — for building attribute
 * values (e.g. an `aria-label`) from data at runtime. Angular's template
 * binding already escapes interpolated text; this is only for the rare
 * case of composing a string outside a template. */
export function escHtml(value: string): string {
  return value.replace(/[&<>"]/g, (ch) => ESCAPE_MAP[ch]);
}
