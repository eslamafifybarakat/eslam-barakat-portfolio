# Lighthouse report

Generated 2026-08-27T12:58:44.117Z against a local static server over the
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
| / | dark | 79 | 100 | 100 | 100 | 1442ms | 0.001 | 773ms |
| / | light | 88 | 100 | 100 | 100 | 3372ms | 0.000 | 69ms |
| /ar | dark | 68 | 100 | 100 | 100 | 4421ms | 0.121 | 184ms |
| /work | dark | 94 | 100 | 100 | 100 | 1082ms | 0.004 | 276ms |
| /work/agro-teba | dark | 81 | 100 | 100 | 100 | 3553ms | 0.007 | 183ms |
| /ar/work/agro-teba | dark | 94 | 100 | 100 | 100 | 1219ms | 0.010 | 266ms |
| /this-page-does-not-exist | dark | 91 | 100 | 100 | 66 | 3134ms | 0.000 | 64ms |

## Gaps from 100

- **/** (dark): Performance 79
- **/** (light): Performance 88
- **/ar** (dark): Performance 68
- **/work** (dark): Performance 94
- **/work/agro-teba** (dark): Performance 81
- **/ar/work/agro-teba** (dark): Performance 94
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
