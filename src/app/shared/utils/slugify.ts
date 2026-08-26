const COMBINING_MARKS = /[̀-ͯ]/g;

/** Deterministic ASCII slug — used once, at data-authoring time, to freeze
 * each project's public `/work/:slug` URL. Never call this at render time
 * against reordered data; the frozen result lives in the data file itself. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
