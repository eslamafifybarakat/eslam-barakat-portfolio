# Backend handoff — Eslam Afify Barakat Portfolio

This is the ask for whoever builds the backend for this project. It explains
what exists today, what the backend needs to replace, how internationalization
must work, the user stories to build against, and the performance bar the API
has to clear. The full field-by-field, request/response contract for every
endpoint lives in [`API_SPEC.md`](./API_SPEC.md) — read this file first for
context, then use that one as the implementation reference.

**Read this before anything else:** the site keeps running on its current
local JSON files until the backend is built, reviewed, and switched on. Do
not remove or bypass `src/app/domains/*/infrastructure/data/*.json` yet — see
[Rollout plan](#rollout-plan).

## 1. What already exists (don't rebuild this, match it)

This app is **not** starting from zero for its data layer — it was already
designed so that swapping local JSON for a real API is a small, mechanical
change, not a rewrite:

- Every domain reads its content through one interface:
  `ApiResponse<T> = { status: boolean; message: string | null; data: T }`
  ([`api-response.model.ts`](../src/app/core/data/api-response.model.ts)),
  unwrapped by one function,
  [`readApiResponse()`](../src/app/core/data/read-api-response.ts), which
  throws when `status` is `false`.
- Each domain's `infrastructure/data/*.data.ts` file does exactly this:
  ```ts
  import response from './work.json';
  const { projects } = readApiResponse(response as ApiResponse<WorkData>, 'work');
  ```
  **The backend's job is to make an HTTP GET return the exact same JSON
  shape that's on disk today**, so that line changes to a `fetch()`/`HttpClient`
  call and nothing downstream (models, services, components) has to change.
- Text content is **not** duplicated per language inside the domain JSON.
  Fields ending in `Key` (e.g. `descriptionKey`, `roleKey`, `titleKey`) are
  translation-catalog keys, resolved at render time against
  `src/locales/en.json` / `src/locales/ar.json` via `TranslationService`.
  Only proper nouns, URLs, phone numbers, stack/tech names, and numbers are
  literal values in the domain JSON. This is the single most important thing
  to preserve — see [Section 3](#3-internationalization-the-part-that-must-not-regress).

## 2. The six domains (data) + four static pages (SEO)

| Domain | JSON file | Model | Endpoint (proposed) |
|---|---|---|---|
| Profile | `profile.json` | [`profile.model.ts`](../src/app/domains/profile/domain/profile.model.ts) | `GET /api/v1/profile` |
| Skills | `skills.json` | [`skill-group.model.ts`](../src/app/domains/skills/domain/skill-group.model.ts) | `GET /api/v1/skills` |
| Experience | `experience.json` | [`job.model.ts`](../src/app/domains/experience/domain/job.model.ts) | `GET /api/v1/experience` |
| Education | `education.json` | [`education-entry.model.ts`](../src/app/domains/education/domain/education-entry.model.ts) | `GET /api/v1/education` |
| Contact | `contact.json` | [`contact-row.model.ts`](../src/app/domains/contact/domain/contact-row.model.ts) | `GET /api/v1/contact` |
| Work | `work.json` | [`project.model.ts`](../src/app/domains/work/domain/project.model.ts) | `GET /api/v1/work`, `GET /api/v1/work/{slug}` |

Plus per-page SEO payloads (`SeoPayload`, same envelope) for `home`,
`work-list`, each work project detail page, and `not-found` — see
`home.seo.json`, `work-list.seo.json`, `not-found.json`. And the
translation catalogs themselves (`src/locales/en.json`, `src/locales/ar.json`)
should become an endpoint too — see [Section 3](#3-internationalization-the-part-that-must-not-regress).

**Every listing endpoint above (Work, Skills, Experience, Education,
Contact) is paginated, uniformly: `?page=&perPage=`, default `page=1`,
default `perPage=30`.** `30` is deliberate, not arbitrary — it's the exact
current project count, so the default call's first page already contains
every project today, and today's "load everything, filter client-side"
frontend behavior keeps working unchanged. Full param/response shape is in
`API_SPEC.md`'s Conventions section. Profile, Work detail, SEO, the i18n
catalog, and the health check are singletons and are never paginated.

Full field tables, JSON examples, request/response contracts, and error
shapes for every one of these: **[`API_SPEC.md`](./API_SPEC.md)**.

## 3. Internationalization — the part that must not regress

Today: **2 languages (`en`, `ar`)**, English default/unprefixed URLs, Arabic
under `/ar`. The ask is explicit: **design so a 3rd, 4th, 5th language can be
added later without a frontend code change** — only new content on the
backend side.

How content is split today (keep this split):

1. **Translated fields** — any `*Key` field in a domain model
   (`descriptionKey`, `roleKey`, `titleKey`, `whenKey`, `metaKey`, `labelKey`,
   `bulletKeys`, `aboutParagraphKeys`, `meta_title`/`meta_description`/
   `meta_keywords`/`img_alt`/`img_title`/`img_description` on `SeoPayload`).
   These are **keys into a flat catalog**, not text. The catalog is
   `{ "portfolio_{scope}_{key}": "localized string" }`, one flat JSON object
   per language (`src/locales/en.json` is ~a few hundred keys today).
2. **Literal fields** — company names, tech-stack names, URLs, phone/email
   values, numbers, icon/scene identifiers. These are the same in every
   language and must **never** be translated or duplicated per-language.

Two ways the backend can serve this — **pick one and confirm it with the
frontend owner before building**, because it changes what the domain
endpoints return:

- **Option A — keys only (recommended, zero frontend rework beyond the HTTP
  swap).** Domain endpoints return the exact same `*Key` fields as today.
  Add one new endpoint, `GET /api/v1/i18n/{lang}`, that returns the flat
  catalog for that language (replacing the two static `en.json`/`ar.json`
  imports with one HTTP call — `TranslationService`'s public API doesn't
  change at all). Adding a language = adding a new catalog record on the
  backend + registering it in `GET /api/v1/languages`; the frontend's `Lang`
  union type is the only place that still needs a one-line code change
  (tracked as frontend follow-up work, not a backend concern).
- **Option B — backend resolves text per request.** Domain endpoints accept
  `?lang=` and return already-translated strings instead of keys. Simpler
  payloads, but every domain endpoint's shape changes (`descriptionKey` →
  `description`), `TranslationService` stops being the resolution layer for
  domain content (SEO/UI-chrome strings would still go through it), and
  responses are no longer cacheable across languages at a shared/CDN layer
  without `Vary: Accept-Language` (or per-language cache keys).

**Recommendation: Option A.** It's the smaller, lower-risk change, it matches
the architecture that's already built, and "add more languages later" is
exactly the case it was designed for. Flag this as an open question to
confirm — don't just assume.

Either way, the backend must support:

- `?lang=xx` query param, falling back to `Accept-Language`, falling back to
  `en` if neither is present or the language isn't supported — never a hard
  error for an unrecognized language. This mirrors `TranslationService.translate()`'s
  own fallback chain (`catalog[lang] ?? catalog[DEFAULT_LANG] ?? key`) and
  must stay a silent fallback, not a thrown error, since a missing/removed
  key today renders as the raw key string rather than crashing.
- `GET /api/v1/languages` → the list of currently available languages (code,
  direction, native label) — see `LanguageMeta` in
  [`i18n.model.ts`](../src/app/core/i18n/i18n.model.ts). This lets the
  language switcher become backend-driven instead of a hardcoded array.

## 4. Rollout plan

1. Backend builds and ships the API per `API_SPEC.md`, versioned (`/api/v1`),
   deployed somewhere stable with a real URL.
2. Backend is validated **independently** first — Postman/curl against every
   endpoint, response shape diffed byte-for-byte against the current
   `*.json` files (same keys, same nesting, same envelope).
3. **Local JSON files stay the live data source until that validation is
   done and signed off.** `environment.dev.ts` already exists specifically
   for this: it's called out in its own comment as "paired with a future
   dev-only backend," separate from `environment.ts`, so a dev build can
   point at the new API without touching what production serves. Wire the
   real switch there first.
4. Only after a full side-by-side comparison (dev build against the API vs.
   the current static build, both languages, every route) does the swap move
   to staging, then UAT, then production — matching the existing
   `environment.staging.ts` / `environment.uat.ts` / `environment.prod.ts`
   ladder already in this repo.
5. **Decide the integration mode before step 1**, because it changes the
   performance story materially — see [Section 5](#5-one-decision-that-changes-everything-build-time-vs-runtime).

## 5. One decision that changes everything: build-time vs. runtime

This site is **fully static and prerendered today — there is no live
per-request server render**. Every route (English + Arabic + all 30 project
pages) is generated once at build time and served as a static file. This is
why Lighthouse currently reads Accessibility 100 / Best Practices 100 / SEO
100. Whether the backend is called **at build time** (by the build/CI
machine) or **at runtime** (by the visitor's browser) has very different
consequences:

| | Build-time fetch (recommended) | Runtime fetch |
|---|---|---|
| Who talks to the API | The build/CI server, on a controlled network | Every visitor's browser |
| End-user "poor network" exposure | **None** — the API is never called by a visitor | Direct — a slow/flaky visitor connection now includes an API round trip |
| Lighthouse / Core Web Vitals risk | None — output is still static HTML/JSON | Real risk unless aggressively cached/CDN'd |
| Content freshness | Only updates on the next build/deploy | Can update without a rebuild |
| Complexity | Low — same shape as today, just an HTTP fetch instead of a local import, at build time | Higher — needs client-side loading/error/retry states that don't exist today |

**Recommendation: build-time fetch**, i.e. the exact same generation step
that reads `work.json` today reads from the API instead, still producing the
same static, prerendered output. This keeps the "poor network" question
almost entirely off the table for real visitors, at zero cost to the
Lighthouse scores this project already earned. If there's a real product
need for live updates without a rebuild (e.g. a future CMS with instant
publish), that's a legitimate reason to choose runtime fetch instead — but
it should be a deliberate call, not a default, because of the trade-offs
above. **Confirm which mode before implementation starts** — Section 7's
performance targets assume build-time; runtime fetch would need a stricter,
separate CDN/edge-caching design reviewed against real Core Web Vitals
budgets.

Either way, the HTTP contract in `API_SPEC.md` is the same — build-time
fetch is just "the build server is the only client."

## 6. User stories

**Content delivery**
- As the build pipeline, I fetch profile/skills/experience/education/contact/work
  content from the API at build time, so the static site regenerates from one
  source of truth instead of hand-edited JSON.
- As a frontend developer, every endpoint returns the same `{status, message,
  data}` envelope the local files already use, so swapping the data source is
  a one-line change per `*.data.ts` file — nothing else.
- As a site visitor, work filtering (`all`/`ng`/`js`/`feat`), free-text
  search, project detail pages, and "related projects" keep working exactly
  as they do today, because the response shape didn't change under them.

**Internationalization**
- As a frontend developer, `GET /api/v1/i18n/{lang}` returns the same flat
  `portfolio_{scope}_{key} → string` shape as `src/locales/{lang}.json`, so
  `TranslationService`'s public API (`translate()`, `select()`, `has()`)
  needs zero changes.
- As the site owner, I add a third language by adding backend content, not
  by shipping new frontend code.
- As a frontend developer, `GET /api/v1/languages` tells me which languages
  exist right now, so the language switcher isn't a hardcoded array.

**Resilience / build robustness**
- As the CI build, the API responds fast and consistently enough that builds
  don't flake on a slow network blip (see Section 7's latency targets).
- As a frontend developer, conditional requests (`ETag`/`If-None-Match`) mean
  re-fetching unchanged content on a re-run/incremental build is nearly free.
- As the site owner, if the backend is ever briefly unreachable during a
  build, the build fails loudly and immediately rather than silently
  publishing empty/partial content — see Section 7's error contract.

**Content integrity (server-side validation)**
- As the site owner, I can update a job entry, add a project, or fix a typo
  through the backend without a developer touching frontend code.
- As the site owner, the backend rejects bad content before it ever reaches
  production, enforcing the same invariants the current test suite
  (`work.data.spec.ts`) already checks against the static file: every
  project has a **unique `slug` and `name`**, **at least one link**, and a
  **non-empty `descriptionKey`**; `kind` is only `'ng'` or `'js'`.

## 7. Performance requirements — "as close to 100% as possible," both on a good and a poor connection

Assuming the recommended build-time integration (Section 5), these targets
apply to the build pipeline's calls to the API, not to end users directly —
but build the API to this bar regardless, since it's also what a future
runtime/CMS use would need.

**Speed & payload**
- Compression: gzip **and** brotli, negotiated via `Accept-Encoding`, brotli
  preferred when supported.
- Every domain response ≤ ~15 KB gzipped even as content grows (`work.json`
  today, 30 projects, is a few KB); the i18n catalog ≤ ~10 KB gzipped per
  language.
- Server processing time targets: p50 < 50 ms, p95 < 150 ms, p99 < 300 ms,
  measured server-side, excluding client network time.
- HTTP/2 or HTTP/3.

**Caching (this is what makes "poor network" a non-issue)**
- Every endpoint here is public, read-only content with no per-user
  variation — no cookies, no auth, no `Vary: Cookie`. That means it's fully
  cacheable by browsers, CDNs, and the build pipeline's own HTTP client.
- Send `ETag` (or `Last-Modified`) on every response and honor
  `If-None-Match` / `If-Modified-Since` with real `304 Not Modified`
  responses — a retry or an incremental rebuild on flaky network then costs
  almost nothing.
- Send `Cache-Control: public, max-age=300, stale-while-revalidate=86400`
  (or similar) on domain content, and a longer TTL on the i18n catalogs,
  since this content changes on the order of days/weeks, not seconds.
- Put it behind a CDN/edge network so the build server's requests don't hit
  origin compute on every call.

**Resilience under a poor/flaky connection**
- All endpoints are `GET` and idempotent — always safe to retry.
- Keep responses small (above) so a retry after a timeout is cheap.
- Return **fast, explicit failures** — a clear `5xx` with the standard error
  envelope (see `API_SPEC.md` §Conventions) beats a request that hangs; the
  build pipeline should be able to apply its own timeout + bounded retry
  (e.g. 3 attempts, exponential backoff) around a fast-failing API, not one
  that stalls.
- Provide a `GET /api/v1/health` (or `/healthz`) endpoint with no auth, sub-second
  response, for uptime monitoring and pre-build sanity checks.
- If/when runtime fetch is ever adopted (Section 5), the frontend must keep
  the ability to render from a last-known-good cached payload rather than a
  blank state on API failure — call this out as a frontend task at that
  point, not a backend one.

**Operational**
- Structured logging + basic request metrics (latency, status code
  distribution) from day one — this is a small, low-traffic API, but "was it
  slow/broken during last night's build" needs to be answerable without
  guesswork.
- Reasonable rate limiting to protect uptime, generous enough that a normal
  build (a handful of requests) never gets throttled.

## 8. Open questions to confirm before/while building

- [ ] i18n: Option A (keys, recommended) vs. Option B (backend-resolved
  text) — see Section 3.
- [ ] Integration mode: build-time fetch (recommended) vs. runtime fetch —
  see Section 5. If runtime is chosen, performance/caching requirements need
  a follow-up pass against real Core Web Vitals budgets.
- [ ] Is there a CMS/admin UI in scope, or is the backend API-only with
  content managed directly in its datastore?
- [ ] Hosting/base URL for each environment (dev/staging/UAT/prod), to fill
  into `environment.*.ts`.
- [ ] Auth for **write** operations (if a CMS is in scope) — reads stay
  public/unauthenticated per Section 7.

## 9. Data files: a note on identity, not yet applied

While mapping every model, one gap stood out: `contact.json`'s rows,
`education.json`'s entries, `experience.json`'s jobs, `skills.json`'s groups,
and `profile.json`'s pillars are plain arrays with **no stable id** — only
array position. `work.json` is the exception: each project's public identity
(`slug`) is derived at runtime from `name` via
[`slugify()`](../src/app/shared/utils/slugify.ts).

For a backend/datastore, array position is not a durable primary key —
reordering content shouldn't change which record is "which." The
straightforward fix is a stable `id` (or reusing a slug-style string) per
record in those five files, and DB primary keys of the backend team's
choosing. This isn't applied to the tracked JSON files as part of this
handoff — there's a broader changeset already pending your review in this
repo right now, and this is exactly the kind of edit that shouldn't land
underneath that. Treat it as a note for whoever implements the backend
schema: give every domain record covered above a stable identifier from the
start, independent of array order.
