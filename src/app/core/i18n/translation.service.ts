import { Injectable, PendingTasks, Signal, computed, effect, inject, signal } from '@angular/core';
import enCatalog from '../../../locales/en.json';
import { LanguageService } from './language.service';
import { DEFAULT_LANG, Lang } from './i18n.model';

type Catalog = Record<string, string>;
type Params = Record<string, string | number>;

/**
 * Flat, namespaced (`portfolio_{scope}_{key}`) translation catalogs.
 * `en.json` is statically imported — SSR and first paint are always
 * correct, with zero flash. `ar.json` is lazy-loaded via a dynamic
 * `import()` the first time the language signal becomes `'ar'`, wrapped in
 * `PendingTasks.run()` so SSR/prerendering waits for it to resolve before
 * serializing the page — an `/ar` route never ships with English fallback
 * text baked into its static HTML.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly languageService = inject(LanguageService);
  private readonly pendingTasks = inject(PendingTasks);

  private readonly catalogs: Partial<Record<Lang, Catalog>> = {
    en: enCatalog as Catalog,
  };

  /** Bumped whenever a new catalog finishes loading, so `translate()` calls
   * made inside a reactive context (a computed/effect/template binding)
   * re-evaluate once the Arabic catalog resolves. */
  private readonly catalogVersion = signal(0);

  constructor() {
    effect(() => {
      const lang = this.languageService.lang();
      // The Lang union only has two members; the dynamic import target must
      // stay a literal for the bundler to statically chunk it, so this
      // lazy-load path is written for 'ar' specifically rather than
      // generically over `Lang`.
      if (lang === 'ar' && !this.catalogs.ar) {
        this.pendingTasks.run(() => this.loadArabicCatalog());
      }
    });
  }

  private async loadArabicCatalog(): Promise<void> {
    const mod = await import('../../../locales/ar.json');
    this.catalogs.ar = (mod.default ?? mod) as Catalog;
    this.catalogVersion.update((v) => v + 1);
  }

  translate(key: string, params?: Params): string {
    const lang = this.languageService.lang();
    this.catalogVersion();
    const catalog = this.catalogs[lang] ?? this.catalogs[DEFAULT_LANG]!;
    const raw = catalog[key] ?? this.catalogs[DEFAULT_LANG]?.[key] ?? key;
    return params ? interpolate(raw, params) : raw;
  }

  /** A reactive signal form of `translate()`, for use outside templates
   * (the `translate` pipe covers templates). */
  select(key: string, params?: Params): Signal<string> {
    return computed(() => this.translate(key, params));
  }

  has(key: string): boolean {
    const lang = this.languageService.lang();
    return Boolean(this.catalogs[lang]?.[key] ?? this.catalogs[DEFAULT_LANG]?.[key]);
  }
}

function interpolate(raw: string, params: Params): string {
  return raw.replace(/\{\{(\w+)\}\}/g, (_, token: string) =>
    token in params ? String(params[token]) : '',
  );
}
