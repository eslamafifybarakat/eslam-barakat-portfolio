import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './domains/work/infrastructure/data/work.data';

/** Every route is fully static, so everything prerenders at build time —
 * best possible TTFB, no serverless cold start. `@angular/ssr` stays in the
 * pipeline purely for SSR-correct meta/hreflang/cookie resolution during
 * that build-time render, not for live per-request rendering. */
async function getPrerenderParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'work', renderMode: RenderMode.Prerender },
  { path: 'work/:slug', renderMode: RenderMode.Prerender, getPrerenderParams },
  { path: 'ar', renderMode: RenderMode.Prerender },
  { path: 'ar/work', renderMode: RenderMode.Prerender },
  { path: 'ar/work/:slug', renderMode: RenderMode.Prerender, getPrerenderParams },
  { path: '**', renderMode: RenderMode.Prerender },
];
