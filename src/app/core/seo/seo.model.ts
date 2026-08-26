export type OgType = 'website' | 'article' | 'profile';

export interface SeoMetaInput {
  /** The complete `<title>` text, e.g. "Work — Eslam Afify Barakat" — callers
   * own the full string so exact reference titles (name-first on Home) are
   * never reshuffled by a generic suffixing rule. */
  readonly title: string;
  readonly description: string;
  /** Path in the CURRENT language's URL space, e.g. `/work/agro-teba` or
   * `/ar/work/agro-teba`. Used to derive the canonical URL and, via
   * `mirrorPath`, the hreflang alternates. */
  readonly path: string;
  /** Root-relative or absolute OG/Twitter image. Defaults to the route's
   * generated `/og/*.png` when omitted. */
  readonly image?: string;
  readonly type?: OgType;
  readonly noindex?: boolean;
}

export interface BreadcrumbEntry {
  readonly label: string;
  readonly path: string;
}
