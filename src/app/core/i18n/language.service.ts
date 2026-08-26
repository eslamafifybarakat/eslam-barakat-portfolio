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
    });

    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => this.reconcileStoredPreference());
    }
  }

  /** Navigates to the mirrored URL for the current route in `lang`,
   * preserving query params and fragment, and persists the choice. */
  switchTo(lang: Lang): void {
    this.persist(lang);
    if (lang === this._lang()) return;

    const currentTree = this.router.parseUrl(this.router.url);
    const currentPath = this.router.url.split(/[?#]/)[0] || '/';
    const mirrored = mirrorPath(currentPath, lang);

    this.router.navigate([mirrored], {
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

  private currentPath(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.document.location.pathname;
    }
    if (!this.request) return '/';
    try {
      return new URL(this.request.url).pathname;
    } catch {
      return '/';
    }
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
