# Eslam Afify Barakat — Portfolio

Senior Angular frontend developer portfolio: profile, skills, experience,
education, contact, and a 30-project work archive with filtering and search.
Built as a fully static, prerendered, bilingual (English/Arabic) Angular 22
application.

**Live:** https://eslam-barakat-portfolio.vercel.app

## Tech stack

- **Angular 22** — standalone components only, zoneless change detection
  (`provideZonelessChangeDetection()`), Signals for state, RxJS only at
  async boundaries (`toSignal`, router streams).
- **TypeScript** strict mode.
- **SCSS**, with a token-based design system (`src/styles/`).
- **`@angular/ssr`**, used at build time only — every route is fully
  static content, so it's exercised purely to get SSR-correct
  meta/hreflang/lang/dir resolution baked into the prerendered HTML. There
  is no live per-request server render.
- **Vitest** (Angular 22's default unit-test runner, via
  `@angular/build:unit-test`), not Karma.
- **ESLint** (`angular-eslint`), zero warnings policy.
- **Lighthouse** + **chrome-launcher**, run as real local audits against
  the production build — see [Performance & Lighthouse](#performance--lighthouse).

## Getting started

```bash
npm install
npm start          # dev server at http://localhost:4200
npm run build       # production build → dist/eslam-barakat-portfolio/
npm test             # unit tests (Vitest)
npm run lint         # ESLint
```

`npm run build` prerenders every route (64 HTML files: every English/Arabic
page × the 30 project detail pages, plus the shared 404), then chains
`generate:sitemap` to derive `sitemap.xml`/`robots.txt` from that output.
The whole build is wrapped by `scripts/with-build-lock.mjs`, since every
configuration below writes to the same `dist/` output — a `.build.lock`
PID file makes two builds racing each other (e.g. a CI build and a local
one) fail fast instead of corrupting the output.

### Environments

Five `src/environments/environment*.ts` files, swapped in per Angular
build configuration via `angular.json` `fileReplacements`: `environment.ts`
(local dev default), `environment.dev.ts` (paired with a future dev-only
backend), `environment.staging.ts`, `environment.uat.ts`, and
`environment.prod.ts`. Each defines `siteUrl` (the one constant every
canonical/hreflang/OG/sitemap URL derives from), `defaultLanguage`,
`cvFileName`, and `contact`.

| Build | Command | Environment file |
|---|---|---|
| Development | `npm run build:dev` | `environment.dev.ts` |
| Staging | `npm run build:staging` | `environment.staging.ts` |
| UAT | `npm run build:uat` | `environment.uat.ts` |
| Production | `npm run build` / `build:live` | `environment.prod.ts` |

`npm run vercel-build` (Vercel's configured `buildCommand`) picks the right
one of these automatically from Vercel's own `VERCEL_ENV`/
`VERCEL_GIT_COMMIT_REF` env vars — see `scripts/vercel-build.mjs`.

## Architecture

Domain-Driven Design folders, chosen so that content/data (`domain` +
`infrastructure`) is fully separated from presentation, and so each domain
can be understood in isolation:

```
src/app/
├── core/            # cross-cutting singletons: i18n, theme, seo, scroll, ssr
├── shared/          # ui/, directives/, pipes/, utils/ — no domain knowledge
├── domains/
│   ├── profile/      experience/    education/
│   ├── skills/        contact/       work/
│   │   └── each: domain/ (models) → infrastructure/data/ (frozen content)
│   │             → infrastructure/*.repository.ts → application/*.service.ts
│   │             (signals) → presentation/ (components)
├── layout/          # header, footer (site chrome, not a domain)
├── home/             # one-page composition of every domain's section —
│                      # deliberately NOT a domain: it owns no data/logic,
│                      # only assembles other domains' presentation pieces
└── not-found/
```

Every domain follows the same four-layer shape: `domain/` defines the
TypeScript models, `infrastructure/data/` holds the frozen, hand-authored
content (sourced from `docs/`), `infrastructure/*.repository.ts` exposes it,
and `application/*.service.ts` layers signals-based query/filter state on
top for `presentation/` components to consume. The **work** domain is the
largest: 30 projects, filter-by-kind + free-text search, a shared grid
component reused on both the home page and the standalone `/work` route.

### Routes

| Path | Renders | Notes |
|---|---|---|
| `/` | Home (all domains, one page) | English |
| `/work` | Work list, filter/search | parent route |
| `/work/:slug` | Project detail | **child** of `/work` — see below |
| `/ar`, `/ar/work`, `/ar/work/:slug` | same pages | Arabic mirror |
| `/**` | 404 | noindexed, still fully styled/localized |

`/work/:slug` is a child route of `/work`, not a sibling — the grid stays
mounted underneath and the detail view renders as a modal via a
router-outlet swap, so navigating into and out of a project never fully
reloads the list (filters/scroll position survive).

Every route in this table is `RenderMode.Prerender` in
`app.routes.server.ts` — there's no `RenderMode.Server` path in this app.

## Design system

Tokens live in `src/styles/`: `_tokens.scss` (spacing/radii/breakpoints, all
in `rem` so they scale with the user's browser font-size preference —
WCAG 1.4.4), `_themes.scss` (dark/light CSS custom properties, dark is the
`:root` default), `_typography.scss` (self-hosted `@font-face` + RTL
overrides), `_mixins.scss`, `_functions.scss`.

Theming is signal-based (`ThemeService`), resolved SSR-safely (no
stored-preference flash — an inline `<script>` in `index.html`'s `<head>`
sets `data-theme` before first paint) and persisted post-hydration only.

All 26 shared UI primitives (`src/app/shared/ui/`) are standalone, OnPush,
and theme-reactive purely through CSS custom properties — no
theme-conditional TypeScript.

## Internationalization

- **URL strategy**: English is unprefixed, Arabic is mirrored under `/ar`
  (`/work/agro-teba` ↔ `/ar/work/agro-teba`). `mirrorPath()` in
  `core/i18n/i18n.model.ts` is the single pure function every
  hreflang/canonical/sitemap/language-toggle computation goes through, so
  the two language trees can never drift apart.
- **Catalog**: flat, namespaced keys (`portfolio_{scope}_{key}`) in
  `src/locales/{en,ar}.json`. English is statically imported (it's the
  default render); Arabic is lazy-loaded via `import()`, wrapped in
  Angular's `PendingTasks.run()` so SSR/prerendering correctly waits for it
  before serializing the page — without that, `/ar` routes would prerender
  with English text.
- **`locale-parity.spec.ts`** asserts the two catalogs have exactly the
  same key set, so a missing Arabic (or English) translation fails CI
  instead of silently falling back.
- Bilingual domain content uses `LocalizedText`/`LocalizedList` types
  (`{ en: string; ar: string }`), not separate English/Arabic data files.

## SEO

- `SeoService` sets title/description/canonical/OG/Twitter/hreflang
  (including `x-default`) per route, derived from `mirrorPath()` and the
  environment's `siteUrl`.
- `JsonLdService` emits `Person`, `ItemList`, and `BreadcrumbList`
  structured data.
- `scripts/generate-sitemap.mjs` walks the **actual** `dist/browser`
  prerendered file tree to build `sitemap.xml`/`robots.txt` — the URL list
  can never drift from what's really deployed, because it isn't
  maintained as a separate hand-written list.
- `scripts/generate-og-images.mjs` composes and rasterizes (via `sharp`) a
  1200×630 OG card per route: `home.png`, `work.png`, and one per project,
  read from the built HTML's `<title>` so the image text always matches
  what's actually live.
- The 404 page is intentionally `noindex, nofollow` (`not-found.component.ts`).
  On Vercel, an unmatched path serves that page with an HTTP 200, not a
  404 status — the same "soft 404" behavior every static/prerendered
  deploy target (Vercel, Netlify, Firebase Hosting, GitHub Pages) has for
  a catch-all SPA route, since the response is a real static file, not a
  server-generated error. `noindex, nofollow` is the mechanism search
  engines actually rely on to exclude a page like this; a true 404 status
  would need a hand-written Vercel routing override, which risks breaking
  the Angular framework preset's own prerendered-route handling for
  marginal benefit — not attempted here.

## Performance & Lighthouse

`scripts/lighthouse.mjs` runs **real** Lighthouse audits (not asserted
scores) against the production build, served locally with gzip/brotli
compression and immutable caching on hashed assets — matching how Vercel
actually serves the output, since an uncompressed local server materially
understates real-world FCP/LCP. Theme is forced via Chrome's
`--force-prefers-color-scheme` flag rather than a second URL, matching how
the app resolves theme with no stored preference.

```bash
npm run build
npm run lighthouse            # representative 7-route sample
npm run lighthouse -- --all   # every URL in sitemap.xml, both themes
```

Results are written to [`LIGHTHOUSE.md`](./LIGHTHOUSE.md). As of the last
run: **Accessibility 100, Best Practices 100, SEO 100** on every real,
indexable route/theme combination measured. Performance is in the
high-70s–high-80s locally; see that file's Notes section for why the 404's
SEO score and the Performance numbers specifically aren't 100 (both
expected, both explained there — not silently accepted gaps).

## Accessibility

- Contrast-adjusted design tokens (see Decisions below), verified via a
  scripted WCAG relative-luminance/contrast-ratio calculation, not
  eyeballed.
- Skip-to-content link, visible focus states, `FocusTrapDirective` for
  modals/mobile sheet (traps Tab/Shift+Tab, restores focus on close, closes
  on Escape) — exercised manually via keyboard-only navigation through the
  header nav, theme/language toggles, work filters, and project modal.
- `ReducedMotionDirective`/`reduced-motion.ts` respect
  `prefers-reduced-motion`: scroll-reveal and count-up animations no-op
  entirely rather than reducing intensity.
- Icons render via an SVG `<symbol>`/`<use>` sprite (`IconSpriteComponent`)
  with `aria-hidden`; interactive controls carry explicit `aria-label`s
  where their visible content isn't already a sufficient name.

## Testing

`npm test` runs Vitest (53 tests across 39 files) via TestBed — component
logic, services, pure utility functions, and `locale-parity.spec.ts`'s
catalog-key-set equality check. Unit tests run against jsdom/TestBed, not
the real SSR pipeline, so SSR-only failures (see Decisions) were caught by
inspecting actual prerendered HTML output, not by this suite.

## Scripts

Full list in `package.json`; the ones worth knowing:

| Script | Purpose |
|---|---|
| `npm start` / `npm run dev` | dev server (`scripts/dev.mjs`, resolves `--configuration`/port) |
| `npm run build` | production build, sitemap included (build-locked) |
| `npm run build:staging` / `build:uat` / `build:dev` | same, other environments |
| `npm run clean` | remove `dist/` and the Angular build cache |
| `npm run serve:ssr:live` / `serve:ssr:nonlive` | serve the compiled SSR server locally |
| `npm run ssr:live` / `ssr:dev` / `ssr:staging` / `ssr:uat` | stop any local server on that port, build, serve — one command |
| `npm test` | Vitest unit tests |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run generate:icons` | favicon/PWA icons from `mark-color.svg` (sharp) |
| `npm run generate:og` | per-route OG images (requires a prior build) |
| `npm run lighthouse` | real Lighthouse audit against the production build |

## Deployment

Deployed on Vercel from the `main` branch. `vercel.json` sets:

- Immutable, one-year caching on every hashed `.js`/`.css` bundle and
  self-hosted font, since their filenames change whenever their content
  does.
- Security headers on every response: HSTS, `X-Content-Type-Options:
  nosniff`, a restrictive `Permissions-Policy`, and a real
  `Content-Security-Policy` — `script-src` allows only same-origin scripts
  plus the exact SHA-256 hash of the one inline script (the no-flash theme
  resolver in `index.html`'s `<head>`), not `'unsafe-inline'`. `style-src`
  does need `'unsafe-inline'`, since Angular's SSR pipeline inlines
  per-route critical CSS directly into each prerendered page. Editing that
  inline script requires recomputing its hash (see the comment beside it
  in `src/index.html`) or the CSP silently blocks it — no build-time
  check catches this, so it's a manual step.

`.github/workflows/ci.yml` runs lint, type-check, unit tests, and a
production build on every push/PR to `main`.

## Decisions

Judgment calls made where the two source prompts conflicted, or where a
gap had to be filled without a reference value — logged here per the
brief's instruction to record reasoning rather than silently pick one.

- **Six domains, not the generation prompt's larger list.** The bootstrap
  prompt's DDD folder convention and the generation prompt's proposed
  domain breakdown didn't fully agree on domain boundaries. Chose the
  minimal set that maps onto genuinely distinct content/data (`profile`,
  `skills`, `experience`, `education`, `contact`, `work`) rather than
  splitting further along presentation-only lines (e.g. "hero" or "about"
  are sections of `profile`, not separate domains) — keeps each domain's
  `infrastructure/data` file mapped to one coherent slice of `docs/`.
- **`.component.ts` suffix, overriding the Angular 22 scaffold default.**
  The CLI's own default (`ng new`) now generates suffix-less class names
  (`App`, not `AppComponent`). The generation prompt explicitly specifies
  `--file-name-style-guide=2016` / the classic suffixed convention, which
  wins on architecture/convention per the stated precedence rule.
- **Dark theme is the `:root` default.** The reference file
  (`docs/portfolio-index.html`) ships `data-theme="dark"` with no
  alternate default; kept that as-is rather than defaulting to a
  light/system preference, since the reference is the content/design
  source of truth.
- **`--dim` (dark & light) and `--cta`/`--cta-ink` (light) contrast
  values differ from `docs/portfolio-index.html`'s exact tokens.** The
  reference values measured 2.83–3.75:1 against the surfaces they're used
  on in a scripted WCAG contrast check — under the 4.5:1 AA threshold for
  the small mono labels (`--dim`) and the light theme's primary button
  text (`--cta`/`--cta-ink`). Adjusted within the same hue family until
  each cleared 4.5:1 (`--dim` dark → `#7A8FA8`, 5.1–5.8:1; `--dim` light →
  `#647079`, 4.5:1+; `--cta` light → `#AE5B27` with white text, 4.85:1).
  `--brass`, used only for non-text fills (badges/dots), keeps the exact
  reference value since it was never a contrast failure.
- **Content-projection workaround in `ButtonComponent`/`ChipComponent`.**
  This Angular version silently drops a default-slot `<ng-content>` when
  the *same* one appears more than once in a template — even split across
  `@if`/`@else` branches. First discovered via Lighthouse's `link-name`
  audit flagging icon+label buttons as nameless; confirmed by diffing raw
  SSR output before/after. Fixed by declaring exactly one `<ng-content>`
  inside a shared `<ng-template #inner>`, referenced via
  `*ngTemplateOutlet` from each branch (which requires `*ngIf`/`else`
  instead of `@if`/`@else`, hence the file-scoped
  `@angular-eslint/template/prefer-control-flow` disable in those two
  templates specifically).
- **SVG icons/poster art render via `<symbol>`/`<use>` sprites, not
  `[innerHTML]`.** `[innerHTML]` on `<svg>`/`<g>` elements throws during
  Angular's server-side prerendering (platform-server's DOM doesn't
  implement it for SVG). `IconSpriteComponent`/`PosterSpriteComponent`
  hold the definitions once; every icon/poster instance references them
  via a plain `[attr.href]` binding, which prerenders correctly.
- **`LanguageService` resolves the current path from `DOCUMENT.location`,
  not the `REQUEST` DI token.** `REQUEST` (from `@angular/core`) is only
  populated for `RenderMode.Server` — never for `RenderMode.Prerender`,
  confirmed by reading `@angular/ssr`'s source. Since every route in this
  app prerenders, relying on `REQUEST` silently rendered every `/ar` page
  with `lang="en" dir="ltr"` and English text baked into the static HTML.
  `platform-server` seeds `document.location` from the render URL before
  any component constructs, so it's reliable in both prerendering and (if
  ever added later) live SSR.
- **CV file is referenced by filename only (`environment.*.ts`
  `cvFileName`), not committed.** No CV PDF was present in `docs/` or
  provided elsewhere. `scripts/check-cv-asset.mjs` warns (does not fail
  the build) if it's missing from `public/` at build time — download
  links degrade to a 404 rather than breaking the build, and the owner can
  drop the real PDF into `public/` at any time with no code change.
- **NgOptimizedImage used only for the portrait**, the one known-stable
  LCP-critical asset; project screenshots use a plain `<img>` +
  `LazyLoadImgDirective`/`ImgFallbackDirective` instead, since those
  directives manage `src` via `Renderer2.setProperty` for graceful
  fallback handling, which isn't compatible with `NgOptimizedImage`
  managing the same attribute.
- **All fixed `px` values converted to `rem`** across the design tokens
  and every component stylesheet, so spacing/radii/type/breakpoints scale
  with the user's browser font-size setting (WCAG 1.4.4 Resize Text) — the
  reference used fixed `px` throughout.

## Assumptions

- The reference `docs/portfolio-index.html` has no CV asset embedded or
  linked to a real file — see the CV decision above.
- `siteUrl` in `environment.prod.ts` assumes the Vercel project name
  `eslam-barakat-portfolio`, giving the default
  `eslam-barakat-portfolio.vercel.app` domain; swapping in a custom domain
  later is a one-line change (that constant is the only place it's
  hardcoded).
- Contact details (email/phone/WhatsApp/LinkedIn/GitHub/location) are
  taken verbatim from `docs/portfolio-index.html` with no independent
  verification of currency/accuracy.
