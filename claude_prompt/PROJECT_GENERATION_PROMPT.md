# PROJECT BRIEF — Build `eslam-barakat-portfolio` on Angular (latest stable major, verify version) with SSR

You are scaffolding a brand-new, production-grade Angular application from zero: the personal
portfolio of **Eslam Afify Barakat — Senior Angular Frontend Developer**. Confirm the actual
latest stable Angular version with `npm view @angular/cli versions --json | tail` / `ng version`
before running `ng new` — do not assume a specific major. If any API below was renamed or removed
in the version you install, use its official replacement per https://update.angular.dev and note
the substitution in your progress report.

**Repo / app name:** `eslam-barakat-portfolio`
**Production domain (assume until told otherwise):** `https://eslam-barakat-portfolio.vercel.app`
— set it once in `src/environments/environment.prod.ts` as `siteUrl` and derive every canonical,
`hreflang`, OG URL and sitemap entry from that single constant, so swapping in a custom domain
later is a one-line change.

---

## 0. OPERATING MODE — FULL AUTONOMY, NO CLARIFYING QUESTIONS

Work end-to-end without stopping to ask anything, including for actions that are normally worth a
check-in (creating the GitHub repo, choosing its visibility, pushing, connecting/deploying to
Vercel, picking a library, resolving an ambiguous requirement, filling a gap in the reference
material). For every decision point:

- Pick the option that is industry-standard, most professional, and most consistent with the rest
  of this brief — not the fastest shortcut.
- If information is genuinely missing (a color not in the reference, a project's missing
  screenshot, a repo name), choose the most sensible, defensible default yourself and keep going.
- Never leave a TODO/placeholder implementation waiting on input — finish the decision and the code.
- Record every non-obvious decision and assumption you made (and why) in the README and in your
  step-by-step progress report, so it's reviewable after the fact instead of interrupting the build.
- The only thing that should stop you is a hard technical blocker (a command fails, a package
  doesn't exist) — diagnose and fix it yourself; don't surface it as a question unless you've
  exhausted reasonable fixes.

Non-negotiables for this build, in priority order:
1. Domain-Driven Design folder architecture (not just "feature folders")
2. BEM-named SCSS on top of a token-driven design system
3. Full SSR with SEO (meta, OG, JSON-LD, sitemap, robots) correct per route
4. Image performance via directives (not ad-hoc `<img>` tags)
5. Accessibility (WCAG AA) and readable, documented code
6. A custom, dependency-free translation/i18n system with runtime language + theme toggles
7. Full brand icon/favicon set wired into every page
8. Lighthouse 100 (Performance/SEO/Best-Practices/Accessibility) on every route, proven with a
   real measurement report, not a guess
9. Shippable to GitHub and deployable on Vercel with zero manual server config

### Reference material (attached — this is the design, do not invent an alternative)

| File | Role |
|---|---|
| `portfolio-index.html` | **The design, verbatim.** A finished single-file build of this exact site: full token set, every component, both themes, both directions, all 30 projects, all copy in EN + AR. Recreate it faithfully in Angular. |
| `logo-color.svg` / `logo-white.svg` | Full lockup (470×96) — light-surface and dark-surface variants |
| `mark-color.svg` / `mark-white.svg` | `EB` monogram (96×96) — favicon/PWA/mask-icon source |
| `SCREENSHOTS_TO_CAPTURE.md` | Screenshot manifest: filenames, `assets/shots/` paths, 1200×750 WebP spec, and the rule that a missing shot must silently fall back to the drawn vector poster |

Copy all five files into `reference/` in the repo and commit them, so the design source of truth
travels with the code. **Do not invent colors, spacing, type scales, copy or projects that are not
in `portfolio-index.html`.** Every token in Appendix A was extracted from it; treat Appendix A as
canonical and the HTML as the tiebreaker.

---

## 1. STACK

- Angular (latest stable, standalone components only, no NgModules), TypeScript strict mode, SCSS,
  `@angular/ssr` for server rendering, signals for all local/reactive state (no RxJS state-holding
  services — RxJS only at true async boundaries).
- Zoneless change detection if the installed version supports it stably; otherwise zone.js.
- No UI component libraries (no Material, no PrimeNG) — build the design system from scratch in
  `shared/ui` to match `portfolio-index.html` pixel-for-pixel.
- No i18n library (no ngx-translate, no `@angular/localize`) — custom translation service, see §5.
- No animation library. The reference's motion is CSS transitions + one `IntersectionObserver` +
  one `requestAnimationFrame` counter; keep it that way.
- No chart/icon package. The 30-icon set and the 11 vector posters are inline SVG in the reference
  — port them as Angular components (§6).

## 2. ARCHITECTURE — DOMAIN-DRIVEN DESIGN

Organize by bounded context, not by technical layer. Each domain owns its full vertical slice.

```
src/app/
  core/                          # cross-cutting singletons only
    config/                      config.service.ts, app-config.model.ts
    i18n/                        i18n.model.ts, language.service.ts, translation.service.ts,
                                 translate.pipe.ts
    theme/                       theme.service.ts, theme.model.ts
    seo/                         seo.service.ts, json-ld.service.ts, seo.model.ts
    scroll/                      scroll-progress.service.ts, section-spy.service.ts
    ssr/                         request-context.ts, cookie.util.ts
  shared/
    ui/                          button, card, badge, chip, icon-button, filter-chips, search-input,
                                 modal, gallery, tabs, accordion, skeleton, toast, spec-list,
                                 stat-counter, timeline, eyebrow, section-head, project-poster,
                                 brand-lockup, theme-toggle, language-toggle, back-to-top,
                                 progress-bar, mobile-sheet, icon
    directives/                  lazy-load-img, img-fallback, click-outside, reveal-on-scroll,
                                 intersection-observer, count-up, focus-trap, copy-to-clipboard
    pipes/                       safe-html, truncate, localized-date, translate (re-export)
    utils/                       host-from-url, slugify, esc-html, reduced-motion
  domains/
    profile/                     # hero, summary prose, the four capability pillars, spec list, stats
    skills/                      # the 7 stack groups
    experience/                  # the 3 roles, timeline
    work/                        # the 30 projects: filter, search, cards, detail, gallery
    education/                   # degree, ITI diploma, languages
    contact/                     # 6 contact rows, availability chips, copy-to-clipboard, CTAs
```

Each domain follows exactly:

```
domains/<domain>/
  domain/                        # pure TS entities/value objects — zero Angular, zero HTTP imports
    <name>.model.ts
  application/                   # use-cases / signal-based state services
    <name>.service.ts
  infrastructure/                # the ONLY layer that knows data shapes/sources
    <name>-api.service.ts        # or <name>.repository.ts for the static data adapters (§13)
  presentation/
    <name>-list/                 # component folder per §11
    <name>-detail/
  <name>.routes.ts
```

Rule: `presentation` → `application` → `infrastructure` → `domain`. Never the reverse. `domain/`
has zero Angular or HTTP imports — portable and testable in isolation. A component never calls an
`*-api.service` / repository directly; it goes through the domain's application service.

Every domain is lazy-loaded from `app.routes.ts` via `loadChildren`/`loadComponent`. Provide a
typed `app.routes.server.ts` mapping each route to a `RenderMode` (§8).

**Home is a composition, not a domain.** `/` is a shell page that lazily composes the presentation
entry component of each domain in reference order — `profile → about/pillars → skills → experience
→ work → education → contact` — preserving the one-page scroll experience of the reference. The
domains stay independently routable for `/work` and `/work/:slug`.

## 3. DESIGN SYSTEM & BEM SCSS

- `src/styles/`: `_tokens.scss`, `_themes.scss`, `_typography.scss`, `_mixins.scss`,
  `_functions.scss`, `_reset.scss`, `index.scss` (single entry point, forwards everything).
- Every color, radius, space, shadow and breakpoint comes from **Appendix A**, expressed as SCSS
  maps *and* CSS custom properties with the exact same names the reference uses (`--bg`, `--surface-2`,
  `--accent`, `--cta`, `--line-2`, `--r-lg`, `--s4`, `--wrap`, `--head`, `--ease`, `--dx`, …). Keeping
  the names identical makes the port auditable line-by-line against `portfolio-index.html`.
- BEM everywhere: `.block`, `.block__element`, `.block--modifier`. No deep nesting, no bare element
  selectors as style hooks. The reference already uses BEM-ish names (`.panel__top`, `.btn--ghost`,
  `.sheetp__foot`, `.card__when`) — normalise them to strict BEM and keep the vocabulary.
- Logical CSS properties only (`margin-inline`, `padding-inline`, `inset-inline`, `border-block-end`)
  so no component SCSS ever needs a `[dir]` branch. The reference already does this — do not regress it.
- Build every primitive once in `shared/ui`; never re-implement one inside a domain.
- `--dx: 4px` flips to `-4px` under RTL (directional hover nudge) — keep that mechanism.

## 4. DARK / LIGHT THEME TOGGLE

- **Dark is the default theme** — the reference ships `<html data-theme="dark">`. Declare the dark
  palette on `:root` and the light palette under `[data-theme="light"]`. *(Documented inversion of
  the generic brief's "light on `:root`" — the design's default wins; note it in the README.)*
- Signal-based `ThemeService` in `core/theme/`: reads the initial theme from the SSR request cookie,
  falls back to `prefers-color-scheme`, falls back to dark; applies `data-theme` to `<html>` via an
  `effect()`; persists an explicit user choice to both `localStorage` and a cookie so SSR honours it
  on the next request.
- **No-flash inline script** at the very top of `<head>` in `index.html`, before any stylesheet or
  bootstrap, reading cookie/localStorage and setting `data-theme` — wrapped in `try/catch`.
- The theme switch also swaps the brand artwork: `logo-white.svg`/`mark-white.svg` in dark,
  `logo-color.svg`/`mark-color.svg` in light. Drive this from the `BrandLockup` component off the
  theme signal, and keep both files preloaded/inlined so the swap never flashes.
- Also swap `<meta name="theme-color">` between `#071018` (dark) and `#FCFBF9` (light).
- Toggle control in the header and in the mobile sheet, keyboard-operable, visible focus ring, and
  an accessible name that reflects the *next* state ("Switch to light theme").

## 5. INTERNATIONALIZATION — CUSTOM TRANSLATION SYSTEM

Two languages: **English (default, LTR)** and **Arabic (RTL)** — both fully written in the
reference; port the copy verbatim, do not re-translate or paraphrase.

- `core/i18n/i18n.model.ts`: `type Lang = 'en' | 'ar'`, `LANGUAGES`, `DEFAULT_LANG = 'en'`,
  `dirFor(lang)`, storage/cookie key constants.
- `core/i18n/language.service.ts`: signal-based, SSR-aware — the server resolves the initial
  language from the URL prefix first, then the cookie; the browser mirrors the served `<html lang>`
  on first render (so hydration never mismatches) and reconciles with the stored preference *after*
  hydration via `afterNextRender`. Applies `lang`/`dir` to `<html>` in an `effect()`.
- `core/i18n/translation.service.ts`: catalogs at `src/locales/en.json` and `src/locales/ar.json`,
  flat namespaced keys `portfolio_{scope}_{key}` — e.g. `portfolio_hero_lede`,
  `portfolio_work_filter_flagship`, `portfolio_contact_email_label`. `en.json` is statically
  imported (SSR/first paint always correct, zero flash); `ar.json` is lazy-loaded via dynamic
  `import()` on first use. `translate(key, params?)` supports `{{param}}` interpolation; expose a
  `select(key, params?)` signal and a `has(key)` guard.
- Parameterised strings exist in the reference (`countTpl(n,t)` → "Showing {{shown}} of {{total}}
  projects" / "يُعرض {{shown}} من {{total}} مشروعًا"). Model them as interpolated keys, not as functions.
- `translate.pipe.ts` — signal-driven, for `{{ 'portfolio_hero_lede' | translate }}`.
- **Long-form and per-project bilingual content is data, not UI copy.** Project descriptions, job
  bullets, the three summary paragraphs, pillar text, education entries and infrastructure notes stay
  in the domain data files as `{ en, ar }` records (§13), resolved through a small
  `LocalizedTextPipe`/helper against the language signal. Only chrome/labels live in the catalogs.
  Keep the catalogs at parity — same key count in both files, verified by a unit test.
- **URL strategy:** English is served unprefixed (`/`, `/work`, `/work/:slug`); Arabic is served
  under `/ar` (`/ar`, `/ar/work`, `/ar/work/:slug`). This makes `hreflang` alternates, canonicals
  and the sitemap honest and independently indexable — the reference's runtime-only toggle can't be
  crawled. The language toggle navigates to the mirrored URL for the current route (preserving
  fragment and query), then persists the choice. Emit `hreflang="en"`, `hreflang="ar"` and
  `hreflang="x-default"` (→ English) on every route.
- Full RTL: `dir` on `<html>`, logical properties in all SCSS, `unicode-bidi: isolate` on the
  LTR-locked runs the reference marks (phone, email, URLs, stat numbers, gallery captions), Arabic
  typography switches to IBM Plex Sans Arabic with letter-spacing and uppercase transforms disabled
  for `.mono`-class runs — exactly as the reference does.
- Language toggle in the header and mobile sheet, next to the theme toggle.

## 6. IMAGES, POSTERS & PERFORMANCE DIRECTIVES

No plain, strategy-free `<img>` anywhere. Build and use:

- `LazyLoadImgDirective` (`img[appLazyLoadImg]`): `loading="lazy"` + `decoding="async"` via host
  bindings, optional deferred `src` swap client-side, fade-in on load, with a hard ~4s timeout
  fallback that reveals the image regardless. **Never** on the LCP/hero image.
- `ImgFallbackDirective` (`img[appImgFallback]`): on `(error)`, hide the image (`display: none`) so
  the branded fallback behind it shows through. SSR-safe. Reset the broken state when `src` changes.
- `NgOptimizedImage` (`ngSrc`) for every image with a known stable source — the portrait and the
  project screenshots — for automatic `srcset`, priority hints and dimension warnings.
- The **portrait is the LCP element**: extract the base64 JPEG from the reference into
  `public/img/portrait.jpg` (+ AVIF/WebP), serve it with `ngSrc`, `priority`, explicit
  `width`/`height`, and never lazy/faded.
- **Vector posters — `shared/ui/project-poster`.** Port `SCENE` (11 named scenes: `health`, `agri`,
  `dashboard`, `erp`, `payment`, `library`, `travel`, `culture`, `ai`, `site`, `tool`) and the
  `POSTER_OF` project→scene map from the reference into a standalone component that renders the
  440×275 SVG — dot pattern, two radial washes, `--accent`/`--cta` stroke classes, and the host
  domain in monospace at the bottom-left. This is what makes every card look finished with zero
  photos; it must be theme-reactive via CSS custom properties, and it is the fallback target for
  `ImgFallbackDirective`.
- **Screenshots** live at `public/assets/shots/<slug>.webp`, 1200×750 WebP, per
  `SCREENSHOTS_TO_CAPTURE.md`. Wire the ten already-named slots; a missing or misspelled file must
  silently fall back to the poster, never a broken-image icon. The gallery **probes each candidate
  image first** and builds the thumbnail strip only from files that genuinely load, so a half-filled
  folder never yields empty thumbnails. The caption tells the truth either way: *Screenshot* vs
  *Vector preview — screenshot pending* (both keys in both catalogs).
- Real `width`/`height` or `aspect-ratio` on every image (16:10 for shots) to prevent CLS; a real
  `alt` on every image, `alt=""` only for genuinely decorative art.
- **Fonts are self-hosted, not loaded from Google Fonts** — the reference's two `preconnect`s plus a
  render-blocking stylesheet cost real LCP and cannot reach Lighthouse 100 reliably. Ship subsetted
  woff2 in `public/fonts/`: Archivo (500/600/700/800), IBM Plex Sans (400/500/600), IBM Plex Sans
  Arabic (400/500/600/700), IBM Plex Mono (400/500). `font-display: swap`; `preload` only Archivo
  600 + IBM Plex Sans 400 for `en`, and IBM Plex Sans Arabic 400/600 for `ar`. Document this
  substitution in the README.

## 7. ACCESSIBILITY & READABILITY

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, correct heading order,
  ARIA only where semantics don't already cover it.
- Full keyboard operability: visible focus rings everywhere (never `outline: none` without a
  replacement), a skip-to-content link, focus trap + return-focus in the project modal and the
  mobile sheet. Cards are focusable and open on `Enter`/`Space`.
- Keyboard map to preserve from the reference: `Esc` closes modal and sheet; `/` focuses the project
  search; `←`/`→` step the gallery, **direction-aware** (the arrow that means "next" flips under RTL).
- Scroll-spy sets `aria-current` on the active nav link; the toast is `role="status"` +
  `aria-live="polite"`; the mobile sheet is `role="dialog" aria-modal="true"` with `aria-expanded`
  maintained on the burger.
- WCAG AA contrast in **both** themes — verify the token pairs from Appendix A programmatically
  (a small script or unit test over the palette), don't eyeball it. Pay particular attention to
  `--dim` on `--bg` and `--cta` on `--surface`.
- Respect `prefers-reduced-motion`: no reveal transitions, no stat count-up animation (render the
  final number immediately), no smooth-scroll, no direction nudge.
- Code readability: consistent naming, small single-responsibility components/services, one short
  comment only where a non-obvious constraint needs explaining, and a root `README.md` covering
  architecture, i18n, theming, scripts, and how each domain maps to a route.

## 8. SSR, ROUTING & SEO

Route table — implement exactly this:

| Route | Content | RenderMode |
|---|---|---|
| `/` | Home composition (all sections) | `Prerender` |
| `/work` | Full project index — filters + search | `Prerender` |
| `/work/:slug` | Project detail (30 slugs) | `Prerender` with `getPrerenderParams` from the project data |
| `/ar`, `/ar/work`, `/ar/work/:slug` | Arabic mirrors of the above | `Prerender` |
| `**` | Styled 404 | `Prerender` |

- The data is fully static, so **everything prerenders** — no serverless cold start, no runtime data
  fetch, best possible TTFB. Keep `@angular/ssr` in place (SSR-correct meta, `hreflang`, cookies,
  theme/language resolution) rather than switching to a pure static build.
- `app.routes.ts`: typed route constants (a `ROUTES` object, no inline path strings in templates or
  services), lazy `loadComponent`/`loadChildren` per domain, route-level `title` and `data`.
- Opening a project from the grid navigates to `/work/:slug` and presents it as a modal over the
  grid (reference behaviour) while remaining a real, shareable, crawlable, server-rendered URL;
  deep-linking straight to `/work/:slug` renders a standalone detail page. Closing returns to the
  grid without a full reload and restores focus to the originating card.
- Filter and search state is reflected in the query string (`?k=ng&q=agora`) so a filtered view is
  linkable and restorable after SSR; `k=all` with empty `q` writes no params.
- `core/seo/seo.service.ts` sets, per route and per language, executed during SSR so crawlers see it
  in the first response: `<title>`, meta description, canonical, Open Graph (title/description/
  image/type/url/locale), Twitter card (`summary_large_image`), and `hreflang` alternates.
- JSON-LD via `core/seo/json-ld.service.ts`:
  - `Person` on the shell — name, jobTitle "Senior Angular Frontend Developer", address Cairo EG,
    email, telephone, `sameAs` [LinkedIn, GitHub], `knowsAbout` from the skill groups, `alumniOf`
    Menoufia University, `knowsLanguage` ar/en.
  - `WebSite` on the shell, with `inLanguage` per route.
  - `ItemList` of projects on `/work`.
  - `CreativeWork` (or `SoftwareApplication` where the project is an app) on each `/work/:slug`,
    with `url`, `dateCreated`/`temporalCoverage` from the project's period, and `keywords` from its
    stack string.
  - `BreadcrumbList` on `/work` and `/work/:slug`.
- Build-time generated `sitemap.xml` covering all 62 public URLs (31 EN + 31 AR) with per-language
  `hreflang` alternates, and a `robots.txt` referencing it. Generate it from the same typed route +
  project data so it can never drift; assert the count in a unit test.

## 9. FAVICON, LOGO & BRAND ICONS

From `mark-color.svg` / `mark-white.svg` / `logo-*.svg`, generate and wire up the complete set —
referenced from `index.html` `<head>`, served from the site root:

- `favicon.svg` (listed first), `favicon.ico` raster fallback.
- PNG icon set: 192×192 and 512×512 (plus maskable 512 variant).
- `apple-touch-icon.png` 180×180.
- `mask-icon.svg` with `color="#0D4A78"`.
- `site.webmanifest`: name "Eslam Afify Barakat — Senior Angular Frontend Developer", short_name
  "Eslam Barakat", `theme_color: #071018`, `background_color: #071018`, `display: standalone`,
  `start_url: /`.
- `<meta name="theme-color">` (theme-reactive, §4), `apple-mobile-web-app-*`, `msapplication-*`.
- **Per-route OG images** (1200×630), generated at build time from the brand: one for `/`, one for
  `/work`, and one per project (monogram + project name + host + the project's poster scene, in the
  dark palette) — referenced by `SeoService`. No single generic sitewide image.
- Ship the `EB` monogram as an inline Angular component too (`shared/ui/brand-lockup`) so the header
  and footer render it without a network request.

## 10. LOADING STATES & SKELETONS

- Reusable `<app-skeleton>` in `shared/ui` with variants: text line, card, avatar, image, list —
  each sized to the design's real shapes and radii (never zero-height).
- Below-the-fold sections (`experience`, `work`, `education`, `contact`) use `@defer` with
  `@placeholder` skeletons; hero and summary render eagerly (LCP).
- Every async action shows a suitable indicator: gallery image load, `ar.json` fetch on first
  language switch, clipboard copy → toast, filter/search transitions.
- Empty states, error states, a styled 404 in the design system, and the reference's exact empty-search
  copy ("Nothing matches that. Try a framework name, a client, or clear the search." / the Arabic
  equivalent). Never a raw browser error or blank screen.

## 11. COMPONENT & FILE CONVENTIONS

Every component gets its own folder with separate files (no inline templates/styles beyond trivial
one-liners):

```
component-name/
  component-name.component.ts
  component-name.component.html
  component-name.component.scss
  component-name.component.spec.ts
```

Services `*.service.ts`, models `*.model.ts`, directives `*.directive.ts`, pipes `*.pipe.ts`,
repositories `*.repository.ts`, routes `*.routes.ts`.

> **Note on naming:** this keeps the classic `.component.*` suffixes as specified. The Angular 20+
> CLI default drops them. Do **not** mix the two — pick this one, apply it to every file, and state
> the choice in the README.

## 12. PERFORMANCE — PROVE LIGHTHOUSE 100, DON'T ASSERT IT

- Techniques: prerendered routes, lazy-loaded domains, `@defer` below the fold, self-hosted subsetted
  fonts with `font-display: swap` and minimal preloads, inline SVG instead of icon requests,
  `provideClientHydration(withEventReplay())`, zero third-party scripts, inlined critical CSS via SSR,
  passive scroll listeners, and a single rAF-driven scroll handler for the progress bar + scroll-spy
  (never a per-element listener).
- Add `npm run lighthouse` that: builds production, serves the SSR/prerendered output locally, runs
  Lighthouse against **every route in the sitemap** — both themes and both languages — waiting for
  network-idle/hydration to settle before each measurement, and writes a results table
  (route → Performance/Accessibility/Best-Practices/SEO/LCP/CLS/TBT) to `LIGHTHOUSE.md`.
- Target: 100 on all four categories on every route. If a route can't hit 100, `LIGHTHOUSE.md` must
  name the route, the metric, the cause and the gap — never silently ship a lower number as 100.
- Re-run after every significant change; treat a regression as build-breaking, not a follow-up.

## 13. DATA, ENVIRONMENT CONFIG & INTEGRATION

**There is no backend and none is needed.** All content is static and already fully specified in
`portfolio-index.html`. Model it as typed data behind the repository layer so a CMS could replace it
later without touching a component:

- Per domain, `infrastructure/<name>.repository.ts` returns typed, frozen data from
  `infrastructure/data/<name>.data.ts`. Bilingual fields are `LocalizedText = { en: string; ar: string }`.
- `domains/work/domain/project.model.ts` mirrors the reference's `WORK` shape with real names:
  `{ slug, name, kind: 'angular' | 'javascript', flagship: boolean, period: LocalizedText,
  description: LocalizedText, stack: string[], links: string[], note?: LocalizedText,
  shot?: string, shots?: string[], posterScene: PosterScene }`. Derive `slug` with a
  deterministic `slugify` and freeze the mapping in the data file (slugs are public URLs — they must
  never shift when the array is reordered).
- Port **all 30 projects, all 3 roles, all 7 skill groups, all 4 pillars, the 3 summary paragraphs,
  all 3 education entries and all 6 contact rows** — EN and AR — with no omissions and no
  paraphrasing. Appendix B is the checklist.
- `src/environments/`: `environment.ts`, `environment.prod.ts` — each exporting `production`,
  `siteUrl`, `defaultLanguage`, `cvFileName`, and `contact` constants.
- A runtime `ConfigService` merging environment defaults with an optional `public/config.json`,
  exposed as a signal, so `siteUrl` can change without a rebuild. No inline URL strings in
  components or domain services.
- The CV PDF (`Eslam_Afify_Barakat_Senior_Angular_Frontend_Developer_CV.pdf`) is served from the
  site root; the hero and footer "Download CV" buttons link to it with `download`. If the file
  isn't supplied at build time, keep the button wired and log a build warning — don't remove it.

## 14. DEPLOYMENT — GITHUB + VERCEL

- `git init`, sensible `.gitignore` (`node_modules`, `dist`, `.angular/`, `.env*`).
- Create the GitHub repo yourself, named `eslam-barakat-portfolio`. **Visibility: public** — this is
  a portfolio and the repo itself is part of the work being shown (documented deviation from the
  generic "default to private"). Push without waiting for confirmation.
- Deploy to Vercel: the Angular framework preset auto-detects `@angular/ssr` (Build Command
  `npm run build`, Output Directory `dist/eslam-barakat-portfolio` — confirm the exact path your
  installed version produces). Add `vercel.json` only for what zero-config can't do: long-lived
  `Cache-Control` on hashed assets, `sitemap.xml`/`robots.txt` rewrites if generated as server
  routes, and security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`,
  `Strict-Transport-Security`).
- Set `siteUrl` per environment (Production/Preview/Development) as a Vercel env var.
- Confirm: a PR gets a preview deployment automatically; merging to `main` triggers production.
- Add a GitHub Actions workflow running lint + unit tests + build on every PR.

## 15. DEFINITION OF DONE

- [ ] `ng build` (prod) and the SSR server both run with zero errors and zero warnings.
- [ ] Every route server-renders/prerenders, hydrates with no console hydration-mismatch warnings,
      and matches `portfolio-index.html` in both themes and both directions.
- [ ] All 30 projects present with correct kind/flagship flags, periods, stacks, links, notes and
      poster scenes; filters, search, count line, empty state and gallery all behave as the reference.
- [ ] Language and theme toggles persist across reloads *and* across SSR requests; `/ar` mirrors
      every route; catalog key parity test passes.
- [ ] `sitemap.xml` (62 URLs) and `robots.txt` reachable and correct; meta/OG/JSON-LD/`hreflang`
      present per route per language, visible in the raw server response (`curl` it, don't trust devtools).
- [ ] Full favicon/manifest/mask-icon/OG-image set resolves on every page; brand artwork swaps with theme.
- [ ] Missing screenshot files fall back silently to vector posters; no broken-image icon anywhere.
- [ ] `LIGHTHOUSE.md` attached showing 100s (or documented exceptions) for every route, both themes,
      both languages.
- [ ] Lint + unit tests pass; translation, theme, language, SEO, both image directives, `slugify`,
      the search/filter selector and the sitemap generator all have unit tests.
- [ ] Keyboard map, focus trapping and reduced-motion behaviour verified manually and noted in the README.
- [ ] Repo pushed to GitHub; Vercel production deployment live and linked in the README.

## 16. HOW TO START

1. Confirm the Angular version you're scaffolding with and report it back as a status update, not a
   question.
2. Read `portfolio-index.html` end to end. Extract tokens into `_tokens.scss`/`_themes.scss`
   (Appendix A is your checklist), extract the portrait to `public/img/`, extract the icon set and
   the 11 poster scenes to components, and extract all copy into `src/locales/*.json` + the domain
   data files (Appendix B).
3. Scaffold the SSR app with the DDD structure from §2 (empty domains for now).
4. Implement design system + theme + i18n + SEO + a11y scaffolding (§§3–9) before any domain content.
5. Implement domains in this order, reporting after each: `profile` → `skills` → `experience` →
   `work` (largest — grid, filters, search, detail route, gallery, posters) → `education` → `contact`.
6. Wire environment config, `ConfigService`, sitemap and OG-image generation (§§8, 13).
7. Run the Lighthouse methodology (§12) and fix until every route is at 100 or documented.
8. Push to GitHub and deploy to Vercel (§14); report the live production URL when done.

Do not pause for confirmation at any step, including repo creation, visibility, or the first push —
make the professional call yourself and document it. Only interrupt for a genuine hard technical
blocker you cannot resolve on your own.

---

# APPENDIX A — DESIGN TOKENS (extracted from `portfolio-index.html`, canonical)

## Brand constants (from the logo SVGs)

| Token | Value | Use |
|---|---|---|
| Brand navy | `#0D4A78` | `E` glyph, outer mark frame, light-theme accent, `mask-icon` color |
| Brand brass | `#C1652B` | `B` glyph, dashed inner frame, light-theme CTA |
| Brass (dark surfaces) | `#EFA469` | `B` glyph and inner frame in `*-white.svg` |
| Ink | `#0A2540` | Wordmark, light-theme text |
| Steel | `#5B6B7C` | Lockup subtitle |
| Subtitle on dark | `#A9BECD` | Lockup subtitle in `*-white.svg` |

Lockup viewBox `0 0 470 96`; monogram `0 0 96 96`; outer frame `rx=24`, `stroke-width=3.2`; inner
dashed frame `rx=18`, `stroke-width=1.7`, `stroke-dasharray="0.01 4.6"`, round caps.

## Structural tokens (`:root`)

```
--navy: #1F3864
--r-xs: 8px   --r-sm: 12px  --r: 16px   --r-lg: 20px  --r-xl: 28px
--s1: 6px  --s2: 12px  --s3: 20px  --s4: 32px  --s5: 48px  --s6: 72px
--sec: clamp(80px, 8.5vw, 122px)
--wrap: 1240px    --head: 66px
--ease: cubic-bezier(.2,.8,.24,1)
--dx: 4px         /* → -4px under [dir="rtl"] */
--f-display: 'Archivo', 'IBM Plex Sans Arabic', system-ui, sans-serif
--f-body:    'IBM Plex Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif
--f-mono:    'IBM Plex Mono', ui-monospace, monospace
```

## Dark palette — **default**

```
--bg:#071018  --bg-2:#0A1621  --surface:#0F1E2C  --surface-2:#142836  --surface-3:#1C3345
--text:#E9F1F7  --muted:#97ABBC  --dim:#64798C
--line:rgba(151,171,188,.16)  --line-2:rgba(151,171,188,.31)
--accent:#67B4E3  --accent-2:#A9D7F3  --accent-soft:rgba(103,180,227,.13)  --accent-ink:#06131D
--cta:#E0894A  --cta-ink:#2A1405  --cta-soft:rgba(224,137,74,.14)
--brass:#E0894A  --brass-soft:rgba(224,137,74,.14)
--metal:linear-gradient(115deg,#FFFFFF 0%,#D9E8F3 44%,#9EBACE 100%)
--lift:0 26px 62px -34px rgba(2,8,14,.92)
--dot:rgba(151,171,188,.10)  --halo:rgba(103,180,227,.15)  --halo-2:rgba(224,137,74,.10)
```

## Light palette — `[data-theme="light"]`

```
--bg:#FCFBF9  --bg-2:#FFFFFF  --surface:#FFFFFF  --surface-2:#F7F6F3  --surface-3:#F1EFEB
--text:#0A2540  --muted:#54636F  --dim:#8E98A3
--line:rgba(10,37,64,.085)  --line-2:rgba(10,37,64,.17)
--accent:#0D4A78  --accent-2:#0A2540  --accent-soft:rgba(13,74,120,.08)  --accent-ink:#FFFFFF
--cta:#C1652B  --cta-ink:#FFFFFF  --cta-soft:rgba(193,101,43,.10)
--brass:#C1652B  --brass-soft:rgba(193,101,43,.10)
--metal:linear-gradient(115deg,#0A2540 0%,#2B5C82 52%,#9CADBB 100%)
--lift:0 20px 44px -30px rgba(10,37,64,.16)
--dot:rgba(10,37,64,.04)  --halo:rgba(13,74,120,.08)  --halo-2:rgba(193,101,43,.07)
```

## Typographic rules

- `.display`: `--f-display`, weight 600, `letter-spacing: -.022em`, `line-height: 1.04`.
- `.mono` (eyebrows, labels, nav, captions): `--f-mono`, `.69rem`, `letter-spacing: .16em`, uppercase.
- Body: 16px / 1.65, antialiased.
- Under RTL: body and display switch to IBM Plex Sans Arabic; `.mono` and all label-ish runs lose
  `letter-spacing` and `text-transform`, and `.navlink` grows to `.86rem`, labels to `.78rem`.
- Ambient layer: two fixed radial halos (`--halo`, `--halo-2`) + a 24px `--dot` grid masked to fade
  by 55% height. Content sits at `z-index: 1`.

# APPENDIX B — CONTENT INVENTORY (port 100%, EN + AR)

**Sections / nav (7):** Top · Summary · Stack · Timeline · Work · Schooling · Contact.

**Hero:** availability line, `h1` "Eslam **Afify** Barakat" (middle name in `--metal` gradient),
role, lede, CTAs (See the work / Download CV), portrait panel, spec list (Role, Base, Since, Focus,
Languages), three counters: **5+** years, **30** projects, **2** languages.

**Summary:** 3 HTML paragraphs + 4 pillars (Signals-first architecture · Real-time voice and video ·
Bilingual by construction · SSR that search engines read).

**Stack (7 groups):** Languages & markup · Angular ecosystem · Architecture & patterns · Real-time &
integrations · UI, styling & localization · Quality & performance · Tooling & delivery.

**Timeline (3 roles):** Talbinah (May 2025 – Present, 6 bullets, `talbinah.net`) · AppzLabz
(Apr 2023 – Apr 2025, 5 bullets) · Hashstudio Inc. (Jun 2021 – Mar 2023, 3 bullets, `hashstudio.dev`).

**Work — 30 projects.** Filters: All / Angular / JavaScript / Flagship. Flagship = the first four.

| # | Project | Kind | Flagship | Shot slot |
|---|---|---|---|---|
| 1 | Reference Portal — Talbinah | Angular | ✔ | `reference-portal.webp` (+ `-2`) |
| 2 | AGRO TEBA | Angular | ✔ | `agro-teba.webp` (+ `-2`) |
| 3 | Talbinah Website | Angular | ✔ | `talbinah-website.webp` (+ `-2`) |
| 4 | Procurelinker | Angular | ✔ | `procurelinker.webp` |
| 5 | Knowledge Bank (Tweeq) | Angular | | `knowledge-bank.webp` |
| 6 | Medjol Patient (Availy) | Angular | | — |
| 7 | Medjol Provider Dashboard | Angular | | — |
| 8 | QR Payment | Angular | | — |
| 9 | Civil Services Management Dashboard | Angular | | — |
| 10 | Jusur Dashboard | Angular | | — |
| 11 | WRTH — Royal Institute of Traditional Arts | Angular | | `wrth.webp` |
| 12 | AMS Policies | Angular | | — |
| 13 | Hawdaj | Angular | | `hawdaj.webp` |
| 14 | Mention | Angular | | — |
| 15 | Estkdam | Angular | | — |
| 16 | Gdawel ERP | Angular | | — |
| 17 | Seaah Stakeholders | Angular | | — |
| 18 | HashStudio — Digital Destination | Angular | | — |
| 19 | Swarm Technologies | JavaScript | | `swarm.webp` |
| 20 | Social Studio | JavaScript | | `social-studio.webp` |
| 21 | QIAS Dashboard | JavaScript | | — |
| 22 | Eid Adha Card | JavaScript | | `eid-card.webp` |
| 23 | Wakeb Tech Site | JavaScript | | — |
| 24 | Wakeb AI Chat | JavaScript | | — |
| 25 | Nile Ortho | JavaScript | | — |
| 26 | NEN Site | JavaScript | | — |
| 27 | Sarie Site | JavaScript | | — |
| 28 | Qaraah Site | JavaScript | | — |
| 29 | Taba Educational Program | JavaScript | | — |
| 30 | Download Images | JavaScript | | — |

Six projects carry an infrastructure note ("Server changed." ×5, "Database changed." ×1) rendered
under the `noteLbl` label — keep those, and keep their live links; a changed-infrastructure project
must **not** get a screenshot slot (per `SCREENSHOTS_TO_CAPTURE.md`, Priority 3).

**Schooling (3):** B.Sc. Computer Science, Menoufia University (Aug 2015 – Jul 2019) · Professional
Diploma, MEARN Stack, ITI/MCIT (Apr – Jul 2021) · Languages (Arabic native, English professional).

**Contact (6 rows, all with icon; email is copy-to-clipboard + toast):** Cairo, Egypt ·
+20 101 622 1599 (tel) · WhatsApp · `eslamafifybarakat@gmail.com` ·
`linkedin.com/in/eslam-afify-barakat-3a1396142` · `github.com/eslamafifybarakat`. Plus three
availability chips and the Email / WhatsApp CTAs.

**Footer:** brand lockup (theme-swapped), dynamic year, and the "built" line.

# APPENDIX C — INTERACTION PARITY CHECKLIST

Every one of these exists in the reference and must survive the port:

1. Fixed 2px scroll-progress bar, gradient `--accent` → `--cta`, direction-aware fill.
2. Scroll-spy over the 7 sections at a 35%-viewport threshold, setting `aria-current` on desktop nav
   and mobile sheet links.
3. Stat counters animating to 5+ / 30 / 2 on first view; instant under reduced motion.
4. Reveal-on-scroll (`.rv → .in`) via `IntersectionObserver`, with a no-observer fallback that
   reveals everything immediately.
5. Filter chips + live search over project name, stack and description; count line
   "Showing N of 30 projects"; empty state copy.
6. Project card → modal/route with gallery, stack list, link list, infrastructure note, "Open live".
7. Gallery: poster first, screenshots appended only after they load; thumbnail strip built from
   verified images; caption reflects screenshot vs vector preview; arrow keys direction-aware.
8. Toast on email copy, auto-dismiss ~2.2s.
9. Mobile sheet menu: burger toggle, `aria-expanded`, body scroll lock, focus moved to close button,
   `Esc` closes, contains its own CTAs plus theme and language toggles.
10. Back-to-top button appearing past 600px of scroll.
11. "See the work" scrolls to `#work` **and** moves keyboard focus to the first filter chip.
12. `/` focuses the search input from anywhere; `Enter`/`Space` opens a focused card.
13. Brand artwork and `theme-color` swap on theme change; RTL flip transition on language change.
14. Real external links always win over card-click delegation (`target="_blank"` guard).

# APPENDIX D — DECISIONS ALREADY MADE (record these in the README)

| Decision | Rationale |
|---|---|
| Dark theme is the `:root` default | The reference ships `data-theme="dark"`; inverting it would change the design's first impression |
| Arabic served under `/ar`, not runtime-only | `hreflang`, canonicals and a truthful sitemap require distinct URLs; runtime-only toggling isn't crawlable |
| Fonts self-hosted, not Google Fonts | Render-blocking third-party CSS + two preconnects cannot reliably reach Lighthouse 100 |
| All routes prerendered | Content is fully static; prerendering gives the best TTFB with no serverless cold start, while `@angular/ssr` stays for meta/cookie/direction correctness |
| Repo public | The repository is itself part of the portfolio |
| Long-form bilingual content in domain data, not locale catalogs | Project descriptions and job bullets are content records, not UI strings; catalogs stay small and parity-checkable |
| `.component.ts` suffixes retained | Explicitly specified in §11; applied uniformly rather than mixed with the Angular 20+ default |
| Slugs frozen in the data file | `/work/:slug` URLs are public and must not shift when the project array is reordered |