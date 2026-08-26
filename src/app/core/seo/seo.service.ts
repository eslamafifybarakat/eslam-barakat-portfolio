import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import { LanguageService } from '../i18n/language.service';
import { TranslationService } from '../i18n/translation.service';
import { LANGUAGES, mirrorPath } from '../i18n/i18n.model';
import type { SeoMetaInput } from './seo.model';

const DYNAMIC_LINK_MARKER = 'data-seo-dynamic';

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
    const image = input.image ?? `${siteUrl}/og${canonicalPath === '/' ? '/home' : canonicalPath}.png`;
    const ogType = input.type ?? 'website';
    const locale = lang === 'ar' ? 'ar_EG' : 'en_US';

    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({
      name: 'robots',
      content: input.noindex ? 'noindex, nofollow' : 'index, follow',
    });

    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: locale });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: input.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setLinks(canonicalPath, siteUrl, canonicalUrl);
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
