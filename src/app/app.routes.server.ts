import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from '@domains/work/infrastructure/data/work.data';

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
  // `**` can't be prerendered to one static file — it matches infinite
  // unknown paths, not a fixed set like the routes above. Angular's build
  // silently drops a Prerender wildcard route with no getPrerenderParams
  // (it produces no output file and isn't in prerendered-routes.json),
  // which left Vercel falling back to serving the *home* page's index.html
  // for any unmatched URL — wrong content, wrong <title>, wrong canonical.
  // RenderMode.Client makes this a proper CSR fallback: the browser loads
  // index.csr.html, Angular's router matches `**` client-side, and
  // NotFoundComponent (with its own noindexed SeoService call) renders.
  { path: '**', renderMode: RenderMode.Client },
];
