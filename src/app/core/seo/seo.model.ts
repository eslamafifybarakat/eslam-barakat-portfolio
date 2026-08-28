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

/** Mirrors the API's SEO envelope. `meta_title`, `meta_description`,
 * `meta_keywords` and `img_alt`/`img_title`/`img_description` hold
 * translation keys (resolved via `TranslationService`), same as every other
 * text field across the domain data layer — not literal text. `source`,
 * `img`, `img_width`, `img_height` and `canonical` are literal. Any field
 * may be `null`; `SeoService.setFromPayload` falls back to the caller's
 * defaults when a field is `null`. */
export interface SeoPayload {
  readonly meta_title: string | null;
  readonly meta_description: string | null;
  readonly meta_keywords: string | null;
  readonly source: string | null;
  readonly img: string | null;
  readonly img_alt: string | null;
  readonly img_title: string | null;
  readonly img_description: string | null;
  readonly img_width: number | null;
  readonly img_height: number | null;
  readonly canonical: string | null;
}
