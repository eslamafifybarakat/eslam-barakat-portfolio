# API specification — Eslam Afify Barakat Portfolio backend

Implementation reference for every endpoint the backend must expose. Read
[`BACKEND_HANDOFF.md`](./BACKEND_HANDOFF.md) first for the *why*; this file is
the *exact contract* — models, params, headers, and full request/response
examples, byte-for-byte matched against the JSON files that ship in this repo
today at `src/app/domains/*/infrastructure/data/*.json`.

## Conventions (apply to every endpoint below)

**Base URL / versioning:** `https://{host}/api/v1/...` — version the path so
a breaking change later doesn't require a frontend redeploy on day one.

**Envelope — every single response, success or error, is this shape and
nothing else:**

```ts
interface ApiResponse<T> {
  status: boolean;        // true = success, false = error
  message: string | null; // null on success; on error, "{CODE}: {human message}"
  data: T;                 // the payload on success; null on error
}
```

This mirrors [`api-response.model.ts`](../src/app/core/data/api-response.model.ts)
exactly. The frontend's `readApiResponse()` throws whenever `status` is
`false`, regardless of HTTP status code — so **the JSON body must always be
well-formed and always follow this shape**, even on a `500`.

**HTTP status codes** — used alongside the envelope (for CDN/proxy/monitoring
correctness), not instead of it:

| HTTP status | When |
|---|---|
| `200 OK` | `status: true` |
| `304 Not Modified` | Conditional GET (`If-None-Match`) hit |
| `400 Bad Request` | Malformed/invalid query params |
| `404 Not Found` | Resource (e.g. project slug) doesn't exist |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unhandled failure |

**Error codes** (used as the `{CODE}` prefix in `message`):

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | A query param failed validation |
| `NOT_FOUND` | Requested resource doesn't exist |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Unhandled server error |

**Error response shape (all endpoints, uniformly):**

```json
{
  "status": false,
  "message": "NOT_FOUND: no project matches slug 'does-not-exist'",
  "data": null
}
```

**Language resolution** (see `BACKEND_HANDOFF.md` §3 for the architecture
decision this depends on) — applies to every domain/SEO endpoint:

- Query param `?lang=xx` takes precedence if present.
- Else fall back to the `Accept-Language` header.
- Else fall back to `en`.
- An unrecognized/unsupported language code is **never** a `400` — silently
  fall back to `en`, mirroring `TranslationService.translate()`'s own
  `catalog[lang] ?? catalog[DEFAULT_LANG]` chain.

**Headers every response should set:**

```
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=300, stale-while-revalidate=86400
ETag: "<hash of the response body>"
Content-Encoding: br | gzip   (negotiated via Accept-Encoding)
```

**Pagination — mandatory, uniform, on every listing endpoint** (Work,
Skills, Experience, Education, Contact, Languages — anything whose `data`
holds an array). Singletons (Profile, Work detail, SEO, i18n catalog,
Health) are never paginated.

| Query param | Type | Default | Notes |
|---|---|---|---|
| `page` | `number` | `1` | 1-indexed |
| `perPage` | `number` | **`30`** | min `1`, max `100` |

- A `page` beyond the last page returns `200` with an **empty array**, not an
  error — out-of-range pages are a normal, non-exceptional case.
- `perPage` outside `1–100`, or `page < 1`, is a `400 VALIDATION_ERROR`.
- Every paginated response adds one extra object, `pagination`, alongside the
  existing named array key (`projects`, `groups`, `jobs`, `entries`, `rows`),
  keeping the existing key untouched so nothing else about the shape changes:

  ```json
  "pagination": {
    "page": 1,
    "perPage": 30,
    "total": 30,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
  ```

- **Why `perPage: 30` by default, specifically:** it's not an arbitrary
  round number — it's chosen so the work list (30 projects today) always
  fits on page 1 with the *default* call and no query params at all. That
  keeps today's "fetch everything, filter client-side" behavior
  (`WorkService.visibleFor()`) working unchanged the moment the frontend
  points at this API with zero query params.
- **This still means "fetch everything" isn't automatically true forever.**
  The moment any list exceeds `perPage`, a caller that only reads page 1 will
  silently miss items. Whatever build step or service consumes these
  endpoints must check `pagination.totalPages` and keep requesting
  `page: 2, 3, …` until it has all of them — never assume one call is
  the complete list. This is a build-time script concern (cheap, a handful
  of extra requests during a build), not something end users' browsers ever
  do under the recommended build-time integration mode (see
  `BACKEND_HANDOFF.md` §5).

---

## 1. Profile — `GET /api/v1/profile`

**Model** ([`profile.model.ts`](../src/app/domains/profile/domain/profile.model.ts)) — a singleton, not a list.

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `aboutParagraphKeys` | `string[]` | yes | keys | one translation key per about-section paragraph |
| `pillars` | `Pillar[]` | yes | — | see below |
| `pillars[].icon` | `IconName` (enum) | yes | no | see [Appendix A](#appendix-a-enums) |
| `pillars[].titleKey` | `string` | yes | key | |
| `pillars[].descriptionKey` | `string` | yes | key | |
| `stats.years` | `number` | yes | no | |
| `stats.yearsSuffix` | `string` | yes | no | literal, e.g. `"+"` |
| `stats.projects` | `number` | yes | no | |
| `stats.languages` | `number` | yes | no | |

**Request**

```
GET /api/v1/profile?lang=en
```

No params required; `lang` optional (default `en`).

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "aboutParagraphKeys": [
      "portfolio_about_paragraph_1",
      "portfolio_about_paragraph_2",
      "portfolio_about_paragraph_3"
    ],
    "pillars": [
      { "icon": "layers", "titleKey": "portfolio_pillar_signals_title", "descriptionKey": "portfolio_pillar_signals_description" },
      { "icon": "wave", "titleKey": "portfolio_pillar_realtime_title", "descriptionKey": "portfolio_pillar_realtime_description" },
      { "icon": "mirror", "titleKey": "portfolio_pillar_bilingual_title", "descriptionKey": "portfolio_pillar_bilingual_description" },
      { "icon": "seo", "titleKey": "portfolio_pillar_seo_title", "descriptionKey": "portfolio_pillar_seo_description" }
    ],
    "stats": { "years": 5, "yearsSuffix": "+", "projects": 30, "languages": 2 }
  }
}
```

**Error responses**

- `500` — backend/datastore failure:
  ```json
  { "status": false, "message": "INTERNAL_ERROR: profile content unavailable", "data": null }
  ```
- `400` (only if `lang` is malformed, e.g. not a 2-letter code — do **not**
  400 for an unsupported-but-well-formed code, per the language-resolution
  rule above):
  ```json
  { "status": false, "message": "VALIDATION_ERROR: 'lang' must be a language code", "data": null }
  ```

---

## 2. Skills — `GET /api/v1/skills`

**Model** ([`skill-group.model.ts`](../src/app/domains/skills/domain/skill-group.model.ts))

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `groups` | `SkillGroup[]` | yes | — | |
| `groups[].icon` | `IconName` (enum) | yes | no | |
| `groups[].labelKey` | `string` | yes | key | group heading, e.g. "Languages" |
| `groups[].technologies` | `string[]` | yes | no | proper nouns — never translated |

**Request**

```
GET /api/v1/skills?lang=en&page=1&perPage=30
```

`page`/`perPage` optional, defaults `1`/`30` — see Conventions §Pagination.

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "groups": [
      {
        "icon": "code",
        "labelKey": "portfolio_skills_languages_label",
        "technologies": ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "SCSS/SASS", "jQuery (legacy)"]
      },
      {
        "icon": "layers",
        "labelKey": "portfolio_skills_angular_label",
        "technologies": ["Angular 16 / 19 / 20 / 21", "Standalone Components", "Signals", "RxJS", "SSR / Angular Universal", "typed route constants", "Reactive Forms", "Guards & Interceptors", "Angular CDK", "Angular Material", "PrimeNG", "ngx-translate", "NgRx"]
      }
    ],
    "pagination": { "page": 1, "perPage": 30, "total": 7, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```
*(full response has 7 groups today — see `skills.json` for all of them; shortened here for brevity. 7 ≤ default `perPage: 30`, so page 1 already contains all of them.)*

**Error responses** — same `INTERNAL_ERROR` / `VALIDATION_ERROR` shapes as Section 1.

---

## 3. Experience — `GET /api/v1/experience`

**Model** ([`job.model.ts`](../src/app/domains/experience/domain/job.model.ts))

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `jobs` | `Job[]` | yes | — | ordered most-recent-first |
| `jobs[].company` | `string` | yes | no | one bilingual-lockup literal string, e.g. `"Talbinah — تلبينة"` — not split into per-language fields |
| `jobs[].whenKey` | `string` | yes | key | date range |
| `jobs[].roleKey` | `string` | yes | key | job title |
| `jobs[].metaKey` | `string` | yes | key | short meta line |
| `jobs[].site` | `string` | no | no | company URL, absent for some jobs today |
| `jobs[].bulletKeys` | `string[]` | yes | keys | one per responsibility bullet, first-party HTML with `<strong>` allowed in the resolved catalog string |

**Request**

```
GET /api/v1/experience?lang=en&page=1&perPage=30
```

`page`/`perPage` optional, defaults `1`/`30` — see Conventions §Pagination.

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "jobs": [
      {
        "company": "Talbinah — تلبينة",
        "whenKey": "portfolio_experience_talbinah_when",
        "roleKey": "portfolio_experience_talbinah_role",
        "metaKey": "portfolio_experience_talbinah_meta",
        "site": "https://talbinah.net/",
        "bulletKeys": [
          "portfolio_experience_talbinah_bullet_1",
          "portfolio_experience_talbinah_bullet_2",
          "portfolio_experience_talbinah_bullet_3",
          "portfolio_experience_talbinah_bullet_4",
          "portfolio_experience_talbinah_bullet_5",
          "portfolio_experience_talbinah_bullet_6"
        ]
      }
    ],
    "pagination": { "page": 1, "perPage": 30, "total": 3, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```
*(3 jobs today — Talbinah, AppzLabz, Hashstudio Inc. — all fit on page 1 at the default `perPage`.)*

**Error responses** — same shapes as Section 1.

---

## 4. Education — `GET /api/v1/education`

**Model** ([`education-entry.model.ts`](../src/app/domains/education/domain/education-entry.model.ts))

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `entries` | `EducationEntry[]` | yes | — | |
| `entries[].icon` | `IconName` (enum) | yes | no | |
| `entries[].titleKey` | `string` | yes | key | degree/diploma name |
| `entries[].placeKey` | `string` | yes | key | institution |
| `entries[].whenKey` | `string` | yes | key | date/duration |

**Request**

```
GET /api/v1/education?lang=en&page=1&perPage=30
```

`page`/`perPage` optional, defaults `1`/`30` — see Conventions §Pagination.

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "entries": [
      { "icon": "cap", "titleKey": "portfolio_education_degree_title", "placeKey": "portfolio_education_degree_place", "whenKey": "portfolio_education_degree_when" },
      { "icon": "doc", "titleKey": "portfolio_education_diploma_title", "placeKey": "portfolio_education_diploma_place", "whenKey": "portfolio_education_diploma_when" },
      { "icon": "globe", "titleKey": "portfolio_education_languages_title", "placeKey": "portfolio_education_languages_place", "whenKey": "portfolio_education_languages_when" }
    ],
    "pagination": { "page": 1, "perPage": 30, "total": 3, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```

**Error responses** — same shapes as Section 1.

---

## 5. Contact — `GET /api/v1/contact`

**Model** ([`contact-row.model.ts`](../src/app/domains/contact/domain/contact-row.model.ts))

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `rows` | `ContactRow[]` | yes | — | |
| `rows[].labelKey` | `string` | yes | key | UI label (e.g. "Phone") — not the value itself |
| `rows[].value` | `string` | yes | no | literal value/fallback (phone, email, URL, or a place name) |
| `rows[].valueKey` | `string` | no | key | present **only** when the displayed value is itself translatable (e.g. a city name) — `value` still carries the literal source string |
| `rows[].href` | `string` | yes | no | `tel:`, `mailto:`, `https://wa.me/...`, or a URL |
| `rows[].rel` | `string` | no | no | extra `rel` token beyond `noopener noreferrer` — e.g. `"me"` for IndieWeb identity verification (LinkedIn/GitHub) |
| `rows[].icon` | `IconName` (enum) | yes | no | |
| `rows[].ltr` | `boolean` | no | no | forces left-to-right rendering even in an RTL document — set on every row whose value is a phone/email/URL |
| `rows[].copy` | `boolean` | no | no | row triggers copy-to-clipboard instead of navigating |

**Request**

```
GET /api/v1/contact?lang=en&page=1&perPage=30
```

`page`/`perPage` optional, defaults `1`/`30` — see Conventions §Pagination.

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "rows": [
      {
        "labelKey": "portfolio_contact_location_label",
        "value": "Cairo, Egypt",
        "valueKey": "portfolio_contact_location_value",
        "href": "https://www.google.com/maps/place/Cairo,+Egypt",
        "icon": "pin"
      },
      {
        "labelKey": "portfolio_contact_email_label",
        "value": "eslamafifybarakat@gmail.com",
        "href": "mailto:eslamafifybarakat@gmail.com",
        "icon": "mail",
        "copy": true,
        "ltr": true
      },
      {
        "labelKey": "portfolio_contact_linkedin_label",
        "value": "linkedin.com/in/eslam-afify-barakat-3a1396142",
        "href": "https://www.linkedin.com/in/eslam-afify-barakat-3a1396142",
        "icon": "linkedin",
        "ltr": true,
        "rel": "me"
      }
    ],
    "pagination": { "page": 1, "perPage": 30, "total": 6, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```
*(6 rows today: location, phone, whatsapp, email, linkedin, github — see `contact.json`)*

**Error responses** — same shapes as Section 1. **This endpoint never accepts
writes** — there is no contact-form submission in this app today (every row
is a `tel:`/`mailto:`/external link); if a contact-form POST is added later,
scope and secure it (spam protection, rate limiting) as a separate piece of
work, not part of this read-only contract.

---

## 6. Work — list — `GET /api/v1/work`

**Model** ([`project.model.ts`](../src/app/domains/work/domain/project.model.ts))

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `projects` | `Project[]` | yes | — | |
| `projects[].slug` | `string` | yes | no | **stable, unique.** Derived today via `slugify(name)` — see [`slugify.ts`](../src/app/shared/utils/slugify.ts) (lowercase, diacritics stripped, non-alphanumeric runs → `-`). The backend should own and store this directly rather than recomputing it, so the value can never drift from what's already live at `/work/{slug}` |
| `projects[].name` | `string` | yes | no | must be unique across all projects |
| `projects[].kind` | `'ng' \| 'js'` (enum) | yes | no | Angular vs. plain JS project |
| `projects[].flagship` | `boolean` | yes | no | shown in the "featured" filter |
| `projects[].periodKey` | `string` | yes | key | e.g. "2023 – Present" |
| `projects[].descriptionKey` | `string` | yes | key | |
| `projects[].stack` | `string[]` | yes | no | technology names, kept as a real array (rendered `·`-joined) |
| `projects[].links` | `string[]` | yes (≥1) | no | live URLs |
| `projects[].noteKey` | `string` | no | key | e.g. "server since changed" disclaimers |
| `projects[].shot` | `string` | no | no | screenshot filename relative to `/assets/shots/` |
| `projects[].shots` | `string[]` | no | no | additional gallery screenshots |
| `projects[].posterScene` | `PosterScene` (enum) | yes | no | see [Appendix A](#appendix-a-enums) |
| `projects[].seo` | `SeoPayload \| null` | no | keys (fields) | per-project SEO override; falls back to a computed title/description when absent/`null` |

**Request**

```
GET /api/v1/work?lang=en&page=1&perPage=30
```

`page`/`perPage` optional, defaults `1`/`30` — see Conventions §Pagination.
At exactly 30 projects today, the default call's page 1 already contains
every project — the same "fetch everything" shape `WorkService` relies on
today keeps working with zero query params.

Optional filter params (**not required by the frontend today** — filtering
currently happens client-side over the full list in `WorkService`; support
these as forward-looking convenience for other consumers). Filters apply
**before** pagination — i.e. `total`/`totalPages` in the response reflect the
filtered count, not the full catalog:

| Param | Type | Notes |
|---|---|---|
| `kind` | `'ng' \| 'js'` | |
| `flagship` | `boolean` | |
| `q` | `string` | free-text match against name/stack/description/links |

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "projects": [
      {
        "slug": "reference-portal-talbinah",
        "name": "Reference Portal — Talbinah",
        "kind": "ng",
        "flagship": true,
        "periodKey": "portfolio_work_reference_portal_talbinah_period",
        "descriptionKey": "portfolio_work_reference_portal_talbinah_description",
        "stack": ["Angular 19", "TypeScript", "Standalone Components", "Signals", "SSR / Angular Universal", "RxJS"],
        "links": ["https://app.talbinah.net/"],
        "posterScene": "health"
      }
    ],
    "pagination": { "page": 1, "perPage": 30, "total": 30, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```
*(30 projects today; 18 `ng` / 12 `js`, 4 flagship — see `work.json` for the full set. Once a 31st project is added, `totalPages` becomes `2` at the default `perPage` — see Conventions §Pagination for why callers must not assume page 1 is everything.)*

**Error responses**

- `400` — invalid filter value:
  ```json
  { "status": false, "message": "VALIDATION_ERROR: 'kind' must be 'ng' or 'js'", "data": null }
  ```
- `400` — invalid pagination value:
  ```json
  { "status": false, "message": "VALIDATION_ERROR: 'perPage' must be between 1 and 100", "data": null }
  ```
- `500` — same `INTERNAL_ERROR` shape as Section 1.

**Server-side validation (enforced on write, matches `work.data.spec.ts`):**
- `slug` and `name` unique across all projects.
- `links` has at least one entry.
- `descriptionKey` non-empty.
- `kind` is exactly `'ng'` or `'js'`.

---

## 7. Work — detail — `GET /api/v1/work/{slug}`

Same `Project` model as Section 6, singular.

**Request**

```
GET /api/v1/work/agro-teba?lang=en
```

| Param | Type | Required | Notes |
|---|---|---|---|
| `slug` (path) | `string` | yes | must match an existing project's `slug` exactly |
| `lang` (query) | `string` | no | default `en` |

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "slug": "agro-teba",
    "name": "AGRO TEBA",
    "kind": "ng",
    "flagship": true,
    "periodKey": "portfolio_work_agro_teba_period",
    "descriptionKey": "portfolio_work_agro_teba_description",
    "stack": ["Angular 21", "TypeScript", "Standalone Components", "Signals", "SSR / Angular Universal", "RxJS", "SCSS", "Tailwind CSS"],
    "links": ["https://dev.agrotebaint.com/"],
    "posterScene": "agri"
  }
}
```

**Error response — `404`**

```json
{
  "status": false,
  "message": "NOT_FOUND: no project matches slug 'does-not-exist'",
  "data": null
}
```

The frontend also derives a "related projects" list (same `kind`,
flagship-first, excluding itself, capped at 3 — see `WorkService.getRelated()`).
This is pure client-side derivation from the full list today and does **not**
need its own endpoint; only add `GET /api/v1/work/{slug}/related` if that
logic moves server-side later.

---

## 8. Per-page SEO — `GET /api/v1/seo/{page}`

**Model** ([`seo.model.ts`](../src/app/core/seo/seo.model.ts)) — `SeoPayload`,
used identically across `home`, `work-list`, each project detail page (via
`Project.seo`), and `not-found`.

| Field | Type | Required | Translated? | Notes |
|---|---|---|---|---|
| `meta_title` | `string \| null` | yes (nullable) | key | falls back to a route-level default key when `null` |
| `meta_description` | `string \| null` | yes (nullable) | key | same fallback behavior |
| `meta_keywords` | `string \| null` | yes (nullable) | key | omitted from output entirely when `null` |
| `source` | `string \| null` | yes (nullable) | no | carried through for schema completeness; no page-level meta-tag today |
| `img` | `string \| null` | yes (nullable) | no | defaults to a generated `/og/{slug}.png` when `null` |
| `img_alt` | `string \| null` | yes (nullable) | key | |
| `img_title` | `string \| null` | yes (nullable) | no | |
| `img_description` | `string \| null` | yes (nullable) | no | |
| `img_width` | `number \| null` | yes (nullable) | no | |
| `img_height` | `number \| null` | yes (nullable) | no | |
| `canonical` | `string \| null` | yes (nullable) | no | overrides the computed canonical URL when present |

**Request**

```
GET /api/v1/seo/home?lang=en
GET /api/v1/seo/work-list?lang=en
GET /api/v1/seo/not-found?lang=en
GET /api/v1/seo/work/{slug}?lang=en   -- per-project override; may legitimately 404 if the project has no override (frontend then computes a fallback)
```

**Success response — `200`** (`home` shown; every page returns the same shape)

```json
{
  "status": true,
  "message": null,
  "data": {
    "seo": {
      "meta_title": "portfolio_seo_home_title",
      "meta_description": "portfolio_seo_home_description",
      "meta_keywords": null,
      "source": null,
      "img": null,
      "img_alt": null,
      "img_title": null,
      "img_description": null,
      "img_width": null,
      "img_height": null,
      "canonical": null
    }
  }
}
```

`not-found` additionally returns non-SEO copy keys alongside `seo`:

```json
{
  "status": true,
  "message": null,
  "data": {
    "titleKey": "portfolio_404_title",
    "messageKey": "portfolio_404_message",
    "ctaHomeKey": "portfolio_404_cta_home",
    "ctaWorkKey": "portfolio_404_cta_work",
    "seo": {
      "meta_title": "portfolio_seo_404_title",
      "meta_description": "portfolio_404_message",
      "meta_keywords": null, "source": null, "img": null, "img_alt": null,
      "img_title": null, "img_description": null, "img_width": null,
      "img_height": null, "canonical": null
    }
  }
}
```

**Error responses** — `404` if `{page}` isn't a recognized page identifier;
`500` `INTERNAL_ERROR` otherwise, both in the standard shape.

---

## 9. Translation catalog — `GET /api/v1/i18n/{lang}`

Only needed if **Option A** (Section 3 of `BACKEND_HANDOFF.md`) is confirmed.
Replaces the static `src/locales/en.json` / `src/locales/ar.json` imports.

**Shape:** a flat object, `Record<string, string>`, one entry per
`portfolio_{scope}_{key}` — identical structure for every language, same key
set in both (a missing key in one language is a content bug, not a schema
difference — the current repo enforces this with `locale-parity.spec.ts`,
which the backend's equivalent should replicate: reject/flag a language
whose key set doesn't match the reference language).

**Request**

```
GET /api/v1/i18n/en
GET /api/v1/i18n/ar
```

| Param | Type | Required | Notes |
|---|---|---|---|
| `lang` (path) | `string` | yes | must be a currently-registered language (see Section 10); unsupported → `404`, not a silent `en` fallback, since this endpoint's whole purpose is serving a specific catalog |

**Success response — `200`** (truncated — real payload has the full key set)

```json
{
  "status": true,
  "message": null,
  "data": {
    "portfolio_lang_switch_code": "ع",
    "portfolio_lang_switch_native_label": "العربية",
    "portfolio_lang_switch_aria": "Switch to {{lang}}",
    "portfolio_nav_home": "Top",
    "portfolio_nav_work": "Work",
    "portfolio_hero_role": "Senior Angular Frontend Developer"
  }
}
```

Note the `{{lang}}` token in `portfolio_lang_switch_aria` — the frontend
interpolates `{{paramName}}` tokens itself (see `interpolate()` in
`translation.service.ts`); the catalog value must keep that literal
`{{token}}` syntax as-is, not pre-resolve it.

**Error response — `404`**

```json
{ "status": false, "message": "NOT_FOUND: no catalog for language 'fr'", "data": null }
```

**Caching:** longer TTL than domain content is appropriate here (catalogs
change less often than, say, adding a new project) —
`Cache-Control: public, max-age=3600, stale-while-revalidate=604800` or similar.

---

## 10. Supported languages — `GET /api/v1/languages`

**Model** ([`i18n.model.ts`](../src/app/core/i18n/i18n.model.ts)) — `LanguageMeta[]`.

| Field | Type | Notes |
|---|---|---|
| `code` | `string` | ISO-style language code, e.g. `"en"`, `"ar"` |
| `dir` | `'ltr' \| 'rtl'` | text direction |
| `label` | `string` | English name of the language (for the switcher's "other language" label) |
| `nativeLabel` | `string` | name in its own language |

**Request**

```
GET /api/v1/languages?page=1&perPage=30
```

`page`/`perPage` optional, defaults `1`/`30` — see Conventions §Pagination.
This list isn't itself localized (no `lang` param).

**Success response — `200`**

```json
{
  "status": true,
  "message": null,
  "data": {
    "languages": [
      { "code": "en", "dir": "ltr", "label": "English", "nativeLabel": "English" },
      { "code": "ar", "dir": "rtl", "label": "Arabic", "nativeLabel": "العربية" }
    ],
    "pagination": { "page": 1, "perPage": 30, "total": 2, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```

This is the endpoint that makes "will increase later" real: adding a third
language means appending one more record here (plus its `/i18n/{code}`
catalog) — no frontend code touches this list today except to read it.

---

## 11. Health check — `GET /api/v1/health`

Not modeled on any frontend type — purely operational, for uptime monitoring
and pre-build sanity checks (Section 7 of `BACKEND_HANDOFF.md`).

**Request**

```
GET /api/v1/health
```

**Success response — `200`**, sub-second, no auth:

```json
{ "status": true, "message": null, "data": { "ok": true } }
```

**Error response — `503`** if a critical dependency (datastore) is down:

```json
{ "status": false, "message": "INTERNAL_ERROR: datastore unreachable", "data": null }
```

---

## Appendix A — enums

**`IconName`** ([`icon.model.ts`](../src/app/shared/ui/icon/icon.model.ts)) — 28 values:
`pin`, `phone`, `whatsapp`, `mail`, `linkedin`, `github`, `download`, `grid`,
`search`, `close`, `sun`, `moon`, `up`, `menu`, `external`, `arrow`, `code`,
`layers`, `route`, `wave`, `mirror`, `gauge`, `shield`, `seo`, `cap`, `doc`,
`globe`, `copy`.

**`PosterScene`** ([`project-poster.model.ts`](../src/app/shared/ui/project-poster/project-poster.model.ts)) — 11 values:
`health`, `agri`, `dashboard`, `erp`, `payment`, `library`, `travel`,
`culture`, `ai`, `site`, `tool`.

**`ProjectKind`** — 2 values: `ng`, `js`.

**`WorkFilterKey`** (read-side filter, not stored) — 4 values: `all`, `ng`,
`js`, `feat`.

**`Lang`** — today `en`, `ar`; the whole point of Section 3/9/10 above is
making this list backend-extensible rather than a hardcoded union.

## Appendix B — full project list (for slug verification)

All 30 `name` → `slug` pairs (via `slugify()`: NFKD-normalize, strip
diacritics, lowercase, non-alphanumeric runs → `-`, trim leading/trailing
`-`) are enumerated in `work.json`/`work.data.ts` today. Spot-check examples:

| `name` | `slug` |
|---|---|
| `Reference Portal — Talbinah` | `reference-portal-talbinah` |
| `AGRO TEBA` | `agro-teba` |
| `Knowledge Bank (Tweeq)` | `knowledge-bank-tweeq` |
| `WRTH — Royal Institute of Traditional Arts` | `wrth-royal-institute-of-traditional-arts` |
| `HashStudio — Digital Destination` | `hashstudio-digital-destination` |

Whichever side owns `slug` generation (recommended: the backend stores it
directly, per Section 6) must produce identical output to `slugify()` for
every existing project — a mismatch would change 30 live public URLs.
