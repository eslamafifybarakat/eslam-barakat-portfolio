import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import type { AppConfig, AppConfigOverride } from './app-config.model';

const DEFAULTS: AppConfig = {
  production: environment.production,
  siteUrl: environment.siteUrl,
  defaultLanguage: environment.defaultLanguage,
  cvFileName: environment.cvFileName,
  contact: { ...environment.contact },
};

/**
 * Runtime configuration, exposed as a signal. Defaults come from the build's
 * `environment`; a same-origin `public/config.json` can override any field
 * without a rebuild (e.g. `siteUrl` when a custom domain is attached after
 * deploy). The whole site is prerendered, so there is no server process to
 * fetch that file from during SSR — the override is applied client-side,
 * after hydration, as progressive enhancement over the build-time defaults
 * SSR already rendered correctly.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _config = signal<AppConfig>(DEFAULTS);

  readonly config = this._config.asReadonly();

  async loadRuntimeOverrides(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const res = await fetch('/config.json', { cache: 'no-store' });
      if (!res.ok) return;
      const override = (await res.json()) as AppConfigOverride;
      this._config.update((current) => ({
        ...current,
        ...override,
        contact: { ...current.contact, ...override.contact },
      }));
    } catch {
      // No override file, or it's unreachable — the build-time defaults
      // already rendered correctly, so this is silently a no-op.
    }
  }
}
