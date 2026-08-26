import { DOCUMENT, Injectable, PLATFORM_ID, REQUEST, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { readCookieFrom, writeCookieTo } from '../ssr/request-context';
import { DEFAULT_THEME, THEME_COLOR, THEME_COOKIE_KEY, THEME_STORAGE_KEY, Theme, isTheme } from './theme.model';

/**
 * Signal-based theme state. Dark is the default (see README "Decisions").
 * The no-flash inline script at the top of `index.html` already resolves
 * and applies the correct `data-theme` before Angular boots — on the
 * browser this service simply reads that back so it never causes a second,
 * conflicting write. On the server (a live SSR request, not a prerendered
 * route) it resolves from the request cookie, falling back to dark since
 * `prefers-color-scheme` isn't observable server-side.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true });

  private readonly _theme = signal<Theme>(this.resolveInitialTheme());

  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this._theme();
      this.document.documentElement.dataset['theme'] = theme;
      this.setMetaThemeColor(THEME_COLOR[theme]);
    });
  }

  set(theme: Theme): void {
    this._theme.set(theme);
    this.persist(theme);
  }

  toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark');
  }

  private persist(theme: Theme): void {
    writeCookieTo(THEME_COOKIE_KEY, theme, {
      platformId: this.platformId,
      document: this.document,
    });
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // storage unavailable — cookie already covers persistence across SSR requests
      }
    }
  }

  private resolveInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const fromDom = this.document.documentElement.dataset['theme'];
      if (isTheme(fromDom)) return fromDom;
    }

    const fromCookie = readCookieFrom(THEME_COOKIE_KEY, {
      platformId: this.platformId,
      document: this.document,
      request: this.request,
    });
    return isTheme(fromCookie) ? fromCookie : DEFAULT_THEME;
  }

  private setMetaThemeColor(color: string): void {
    const meta = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = color;
  }
}
