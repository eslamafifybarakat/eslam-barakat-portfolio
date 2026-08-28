import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ConfigService } from '@core/config/config.service';
import { TranslationService } from '@core/i18n/translation.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    // Offline/poor-network resilience: caches the app shell (JS/CSS) and
    // assets (images/fonts) so a repeat visit — or any in-app navigation
    // after the first load — works with no network at all. Navigation
    // requests (the per-route prerendered HTML) use the 'freshness'
    // strategy in ngsw-config.json, not the SW's default app-shell
    // behavior: this site serves genuinely different, SEO-correct HTML
    // per route, so the network is always tried first for a fresh page
    // load, falling back to the cached copy only when it's unreachable —
    // getting the app-shell default backwards here would silently serve
    // one route's cached page in place of another's real content.
    // registerWhenStable:30000 defers registration so it never competes
    // with hydration for the main thread, with a 30s ceiling in case the
    // app never reaches stability.
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    // Fire-and-forget: SSR already rendered correct build-time defaults, so
    // this override has nothing to fix before first paint — gating bootstrap
    // on a network round-trip here only delays hydration for no benefit
    // (and risks a hydration mismatch if it resolved *before* the initial
    // client render ever changed a value SSR had already committed to DOM).
    // The config signal is reactive, so a later-arriving override still
    // updates every consumer whenever the fetch actually resolves.
    provideAppInitializer(() => void inject(ConfigService).loadRuntimeOverrides()),
    provideAppInitializer(() => inject(TranslationService).preload()),
  ],
};
