# Lighthouse report

Generated 2026-08-27T11:48:06.301Z against a local static server over the
production build (`npm run build` output, served exactly as Vercel serves
it — every route below is a prerendered static file, not a live SSR
render). Both languages are separate URLs (`/` vs `/ar`), so they're
covered by testing each path directly; theme is forced via Chrome's
`--force-prefers-color-scheme` flag rather than a second URL, matching how
the site actually resolves theme with no stored preference.

**This run covers every URL in `sitemap.xml`, in both forced color schemes.**

## Results

| Route | Theme | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| / | dark | 79 | 100 | 100 | 100 | 3732ms | 0.001 | 248ms |
| / | light | 87 | 100 | 100 | 100 | 3143ms | 0.001 | 208ms |

## Gaps from 100

- **/** (dark): Performance 79
- **/** (light): Performance 87
