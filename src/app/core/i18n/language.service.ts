import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  REQUEST,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { readCookieFrom, writeCookieTo } from '../ssr/request-context';
import {
  DEFAULT_LANG,
  LANG_COOKIE_KEY,
  LANG_STORAGE_KEY,
  Lang,
  dirFor,
  isLang,
  mirrorPath,
} from './i18n.model';

/**
 * SSR-aware language state. The URL is the single source of truth for which
 * language a given render is in (English unprefixed, Arabic under `/ar`) —
 * that's what keeps hreflang/canonicals/the sitemap honest and crawlable —
 * so the *initial* language, both on the server and on the browser's first
 * paint, always comes from the URL, never from a stored preference. A
 * stored preference is only reconciled after hydration, and only then by
 * triggering a real navigation to the mirrored URL, so it can never cause a
 * hydration mismatch.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly router = inject(Router);

  private readonly _lang = signal<Lang>(this.resolveInitialLang());

  readonly lang = this._lang.asReadonly();
  readonly dir = computed(() => dirFor(this._lang()));

  constructor() {
    effect(() => {
      const lang = this._lang();
      const dir = dirFor(lang);
      this.document.documentElement.lang = lang;
      this.document.documentElement.dir = dir;
      this.preloadFontsFor(lang);
    });

    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => this.reconcileStoredPreference());
    }
  }

  /** Preloads only the font files the CURRENT language's page actually
   * needs — Archivo 600 + IBM Plex Sans 400 for English, IBM Plex Sans
   * Arabic 400/600 for Arabic — rather than every self-hosted weight. */
  private preloadFontsFor(lang: Lang): void {
    const marker = 'data-font-preload';
    this.document.head.querySelectorAll(`link[${marker}]`).forEach((el) => el.remove());

    const hrefs =
      lang === 'ar'
        ? ['/fonts/ibm-plex-sans-arabic-400-arabic.woff2', '/fonts/ibm-plex-sans-arabic-600-arabic.woff2']
        : ['/fonts/archivo-var-latin.woff2', '/fonts/ibm-plex-sans-var-latin.woff2'];

    for (const href of hrefs) {
      const link = this.document.createElement('link');
      link.rel = 'preload';
      // `.as` is an IDL property that Angular's server-side DOM doesn't
      // reflect back to an attribute — SSR output would ship
      // <link rel="preload"> with no `as`, which Chrome flags as invalid.
      // setAttribute renders correctly on both server and client.
      link.setAttribute('as', 'font');
      link.type = 'font/woff2';
      link.href = href;
      link.crossOrigin = 'anonymous';
      link.setAttribute(marker, '');
      this.document.head.appendChild(link);
    }
  }

  /** Navigates to the mirrored URL for the current route in `lang`,
   * preserving query params and fragment, and persists the choice. */
  switchTo(lang: Lang): void {
    this.persist(lang);
    if (lang === this._lang()) return;
    this.router.navigateByUrl(this.mirroredUrlTree(lang));
  }

  /** The full mirrored URL (path + query + fragment) for `lang`, serialized
   * as a real href — so the language toggle can be a genuine `<a>` (crawlable,
   * openable in a new tab, works with JS disabled) rather than a JS-only
   * button, while `switchTo` still drives the actual SPA navigation. */
  mirroredHref(lang: Lang): string {
    return this.router.serializeUrl(this.mirroredUrlTree(lang));
  }

  private mirroredUrlTree(lang: Lang) {
    const currentTree = this.router.parseUrl(this.router.url);
    const currentPath = this.router.url.split(/[?#]/)[0] || '/';
    const mirrored = mirrorPath(currentPath, lang);

    return this.router.createUrlTree([mirrored], {
      queryParams: currentTree.queryParams,
      fragment: currentTree.fragment ?? undefined,
    });
  }

  private persist(lang: Lang): void {
    writeCookieTo(LANG_COOKIE_KEY, lang, { platformId: this.platformId, document: this.document });
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      } catch {
        // storage unavailable (private mode / disabled) — cookie already covers persistence
      }
    }
  }

  private resolveInitialLang(): Lang {
    const path = this.currentPath();
    return path === '/ar' || path.startsWith('/ar/') ? 'ar' : DEFAULT_LANG;
  }

  /**
   * The `REQUEST` token is only populated for a live SSR request
   * (`RenderMode.Server`) — never during prerendering, which is what every
   * route here actually uses, so it's useless as the primary source here.
   * `DOCUMENT.location` is reliable in all three cases: the real browser
   * URL in the browser, and — because `@angular/platform-server` seeds the
   * document's location from the render URL as part of platform setup,
   * before any component (including this singleton) is constructed —
   * also correct during both prerendering and a live SSR request.
   */
  private currentPath(): string {
    try {
      const pathname = this.document.location?.pathname;
      if (pathname) return pathname;
    } catch {
      // fall through
    }
    if (this.request) {
      try {
        return new URL(this.request.url).pathname;
      } catch {
        // fall through
      }
    }
    return '/';
  }

  private reconcileStoredPreference(): void {
    const stored = this.readStoredPreference();
    if (stored && stored !== this._lang()) {
      this.switchTo(stored);
    }
  }

  private readStoredPreference(): Lang | null {
    try {
      const fromStorage = localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(fromStorage)) return fromStorage;
    } catch {
      // ignore — fall through to cookie
    }
    const fromCookie = readCookieFrom(LANG_COOKIE_KEY, {
      platformId: this.platformId,
      document: this.document,
      request: this.request,
    });
    return isLang(fromCookie) ? fromCookie : null;
  }
}
