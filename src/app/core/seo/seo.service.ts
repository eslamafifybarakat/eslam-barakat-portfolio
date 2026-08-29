import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import { LanguageService } from '../i18n/language.service';
import { TranslationService } from '../i18n/translation.service';
import { LANGUAGES, mirrorPath, type Lang } from '../i18n/i18n.model';
import type { OgType, SeoMetaInput, SeoPayload } from './seo.model';

const DYNAMIC_LINK_MARKER = 'data-seo-dynamic';

// Every OG image `scripts/generate-og-images.mjs` renders is exactly this
// size, as a PNG — real, verified dimensions, not a guess.
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ar: 'ar_EG' };

/**
 * Sets title, meta description, canonical, Open Graph, Twitter Card and
 * hreflang alternates for the current route — executed during SSR so
 * crawlers see it in the first response, not just after hydration.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly config = inject(ConfigService);
  private readonly language = inject(LanguageService);
  private readonly translation = inject(TranslationService);

  set(input: SeoMetaInput): void {
    const siteName = this.translation.translate('portfolio_seo_site_name');
    const fullTitle = input.title;
    const lang = this.language.lang();
    const siteUrl = this.config.config().siteUrl;
    const canonicalPath = input.path;
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const image = input.image ?? `${siteUrl}/og/${ogImageSlug(canonicalPath)}.png`;
    const ogType = input.type ?? 'website';
    const locale = OG_LOCALE[lang];
    const alternateLocale = OG_LOCALE[lang === 'ar' ? 'en' : 'ar'];

    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({
      name: 'robots',
      content: input.noindex ? 'noindex, nofollow' : 'index, follow',
    });
    // Every route's own real keyword data (a project's stack, the site's
    // skill list) — entirely removed rather than left stale when a route
    // (e.g. the 404 page) genuinely has none, since client-side navigation
    // between routes reuses this same <meta> element.
    this.setOrRemoveTag('name="keywords"', { name: 'keywords' }, input.keywords ?? null);

    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:image:width', content: String(input.imageWidth ?? OG_IMAGE_WIDTH) });
    this.meta.updateTag({ property: 'og:image:height', content: String(input.imageHeight ?? OG_IMAGE_HEIGHT) });
    this.meta.updateTag({ property: 'og:image:alt', content: input.imageAlt ?? fullTitle });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:locale:alternate', content: alternateLocale });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: input.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: input.imageAlt ?? fullTitle });

    this.setLinks(canonicalPath, siteUrl, canonicalUrl);
  }

  /** Same as `set()`, but sourced from a domain data item's `SeoPayload` —
   * `meta_title`/`meta_description`/`meta_keywords`/`img_alt` are
   * translation keys, resolved here; a `null` field falls back to
   * `input.fallbackTitleKey`/`fallbackDescriptionKey`/`fallbackKeywords`
   * (or is simply omitted, for the optional fields). `source`/`img_title`/
   * `img_description` carry through the payload for schema completeness
   * but have no page-level meta-tag equivalent today. */
  setFromPayload(
    payload: SeoPayload | null | undefined,
    input: {
      readonly path: string;
      readonly fallbackTitleKey: string;
      readonly fallbackDescriptionKey: string;
      /** Real, page-specific keyword data (a project's tech stack, the
       * site's skill list) used when the payload has none — never
       * fabricated content. */
      readonly fallbackKeywords?: string;
      readonly type?: OgType;
      readonly noindex?: boolean;
    },
  ): void {
    const title = this.translation.translate(payload?.meta_title ?? input.fallbackTitleKey);
    const description = this.translation.translate(payload?.meta_description ?? input.fallbackDescriptionKey);
    const keywords = payload?.meta_keywords ? this.translation.translate(payload.meta_keywords) : input.fallbackKeywords;
    const imageAlt = payload?.img_alt ? this.translation.translate(payload.img_alt) : undefined;

    this.set({
      title,
      description,
      path: input.path,
      image: payload?.img ?? undefined,
      imageWidth: payload?.img_width ?? undefined,
      imageHeight: payload?.img_height ?? undefined,
      imageAlt,
      keywords,
      type: input.type,
      noindex: input.noindex,
    });

    if (payload?.canonical) {
      const canonicalLink = this.document.head.querySelector<HTMLLinkElement>(
        `link[rel="canonical"][${DYNAMIC_LINK_MARKER}]`,
      );
      canonicalLink?.setAttribute('href', payload.canonical);
    }
  }

  private setOrRemoveTag(
    selector: string,
    tag: { name: string } | { property: string },
    content: string | null,
  ): void {
    if (content) {
      this.meta.updateTag({ ...tag, content });
    } else {
      this.meta.removeTag(selector);
    }
  }

  private setLinks(canonicalPath: string, siteUrl: string, canonicalUrl: string): void {
    this.clearDynamicLinks();
    const head = this.document.head;

    head.appendChild(this.link('canonical', canonicalUrl));

    for (const { code } of LANGUAGES) {
      const href = `${siteUrl}${mirrorPath(canonicalPath, code)}`;
      head.appendChild(this.link('alternate', href, code));
    }
    // x-default -> English, the language-neutral entry point
    const defaultHref = `${siteUrl}${mirrorPath(canonicalPath, 'en')}`;
    head.appendChild(this.link('alternate', defaultHref, 'x-default'));
  }

  private link(rel: string, href: string, hreflang?: string): HTMLLinkElement {
    const el = this.document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute('href', href);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    el.setAttribute(DYNAMIC_LINK_MARKER, '');
    return el;
  }

  private clearDynamicLinks(): void {
    this.document.head.querySelectorAll(`link[${DYNAMIC_LINK_MARKER}]`).forEach((el) => el.remove());
  }
}

/** `/` → `home`, `/work` → `work`, `/work/agro-teba` → `work-agro-teba`,
 * `/ar/work/agro-teba` → `work-agro-teba` (OG cards aren't per-language) —
 * matches the flat filenames `scripts/generate-og-images.mjs` writes into
 * `public/og/`. */
function ogImageSlug(path: string): string {
  const withoutLangPrefix = path === '/ar' ? '/' : path.startsWith('/ar/') ? path.slice(3) : path;
  const trimmed = withoutLangPrefix.replace(/^\/|\/$/g, '');
  return trimmed === '' ? 'home' : trimmed.replace(/\//g, '-');
}
