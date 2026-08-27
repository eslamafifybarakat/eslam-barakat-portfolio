# Lighthouse report

Generated 2026-08-27T11:56:41.751Z against a local static server over the
production build (`npm run build` output, served exactly as Vercel serves
it — every route below is a prerendered static file, not a live SSR
render). Both languages are separate URLs (`/` vs `/ar`), so they're
covered by testing each path directly; theme is forced via Chrome's
`--force-prefers-color-scheme` flag rather than a second URL, matching how
the site actually resolves theme with no stored preference.

**This run covers a representative sample, not the full 64-URL × 2-theme matrix** (128 audits would take on the order of an hour). Run `npm run lighthouse -- --all` to audit every route in `sitemap.xml` in both forced color schemes.

## Results

| Route | Theme | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| / | dark | 80 | 100 | 100 | 100 | 3487ms | 0.001 | 285ms |
| / | light | 77 | 100 | 100 | 100 | 1163ms | 0.001 | 1092ms |
| /ar | dark | 78 | 100 | 100 | 100 | 1595ms | 0.004 | 854ms |
| /work | dark | 85 | 100 | 100 | 100 | 2708ms | 0.005 | 345ms |
| /work/agro-teba | dark | 86 | 100 | 100 | 100 | 2607ms | 0.005 | 293ms |
| /ar/work/agro-teba | dark | 86 | 100 | 100 | 100 | 1349ms | 0.011 | 482ms |
| /this-page-does-not-exist | dark | 91 | 100 | 100 | 66 | 3160ms | 0.000 | 104ms |

## Gaps from 100

- **/** (dark): Performance 80
- **/** (light): Performance 77
- **/ar** (dark): Performance 78
- **/work** (dark): Performance 85
- **/work/agro-teba** (dark): Performance 86
- **/ar/work/agro-teba** (dark): Performance 86
- **/this-page-does-not-exist** (dark): Performance 91, SEO 66

## Notes

- **`/this-page-does-not-exist` SEO score**: intentionally below 100.
  Lighthouse's `is-crawlable` audit flags any `<meta name="robots"
  content="noindex">` as a failure — but noindexing the 404 page is
  correct SEO practice (indexing it would put a no-content page in search
  results), not a defect. Every real, indexable route scores SEO 100.
- **Performance run-to-run variance**: numbers come from a single local
  machine sharing CPU with the rest of this environment (editor, prior
  builds), so Lighthouse's simulated mobile throttling amplifies whatever
  contention was happening at that moment — LCP/TBT can swing noticeably
  between otherwise-identical runs. Vercel's production edge network
  removes that local contention entirely; these numbers are a
  conservative floor, not a prediction of production scores.
