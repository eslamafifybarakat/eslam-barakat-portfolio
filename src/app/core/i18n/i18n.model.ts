export type Lang = 'en' | 'ar';

export interface LanguageMeta {
  readonly code: Lang;
  readonly dir: 'ltr' | 'rtl';
  readonly label: string;
  readonly nativeLabel: string;
}

export const LANGUAGES: readonly LanguageMeta[] = [
  { code: 'en', dir: 'ltr', label: 'English', nativeLabel: 'English' },
  { code: 'ar', dir: 'rtl', label: 'Arabic', nativeLabel: 'العربية' },
];

export const DEFAULT_LANG: Lang = 'en';

export function dirFor(lang: Lang): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function isLang(value: string | null | undefined): value is Lang {
  return value === 'en' || value === 'ar';
}

export const LANG_STORAGE_KEY = 'eb-portfolio-lang';
export const LANG_COOKIE_KEY = 'eb_lang';

/** URL prefix for the non-default language — English is served unprefixed,
 * Arabic under `/ar`, so hreflang/canonicals/the sitemap stay honest. */
export const LANG_URL_PREFIX: Record<Lang, string> = {
  en: '',
  ar: '/ar',
};

/** Rewrites a path (no query/fragment) from whichever language it's
 * currently under to `targetLang`'s URL space. Pure and framework-free so
 * it's usable from the language toggle, LanguageService and the sitemap
 * generator alike. */
export function mirrorPath(path: string, targetLang: Lang): string {
  const withoutPrefix = path === '/ar' ? '/' : path.startsWith('/ar/') ? path.slice(3) : path;
  const prefix = LANG_URL_PREFIX[targetLang];
  if (!prefix) return withoutPrefix;
  return withoutPrefix === '/' ? prefix : `${prefix}${withoutPrefix}`;
}
