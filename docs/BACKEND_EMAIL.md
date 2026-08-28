# Backend request — draft message

Copy/paste ready. Send with `docs/BACKEND_HANDOFF.md` and `docs/API_SPEC.md`
attached (or linked, if the backend developer has repo access).

---

**Subject: Backend needed for the portfolio site — spec attached, two decisions needed to start**

Hi,

I need a backend built for my Angular portfolio site. It currently runs
entirely on local static JSON files, and the backend's job is to serve the
same data over a REST API so content can eventually be managed without
redeploying the frontend.

I've attached two docs — please read them in this order:

1. **BACKEND_HANDOFF.md** — the brief: what exists today, the architecture
   you need to match, user stories, and the performance bar (works well on a
   good connection *and* a poor one).
2. **API_SPEC.md** — the exact implementation contract: every endpoint, with
   field-by-field models, real request/response JSON examples, error
   formats, and pagination rules.

**The short version of what to build:**
- One endpoint per content area: profile, skills, experience, education,
  contact, and work (projects) — plus per-page SEO data and a
  translation-catalog endpoint.
- Every response uses the same envelope: `{ status: boolean, message: string
  | null, data: T }` — success and error alike.
- Two languages today (English/Arabic), designed so more can be added later
  purely as backend content — no frontend redeploy.
- Every list endpoint is paginated the same way: `?page=&perPage=`, default
  `perPage=30` (today's project count, so page 1 already returns everything
  with no query params).
- Caching (ETag, Cache-Control), compression, and fast/explicit error
  responses are required — not optional — see the Performance section in the
  handoff doc.

**Before you start building, I need your input on two decisions** (both are
explained in detail in the handoff doc, Sections 3 and 5):

1. **Translations** — should the API return translation *keys* (frontend
   resolves the text, my current setup, less rework) or fully translated
   *text* per request (`?lang=`)? I'm leaning toward keys — confirm you're
   fine with that, or tell me why text-per-request is better from your side.
2. **When is the API called** — at *build time* (my CI fetches from it and
   generates the static site, same as today, zero risk to page speed/SEO
   scores) or at *runtime* (visitors' browsers call it directly, more
   dynamic but needs real caching/CDN work to not hurt performance)? I'm
   recommending build-time — let me know if that works or if you see a
   reason to do otherwise.

Important: **don't touch or replace the existing local JSON files yet.** The
site keeps running on those until your API is built and I've validated it
side-by-side against the current output. There's an `environment.dev.ts`
config already in the repo set aside specifically for pointing a dev build
at your API once it's ready.

Let me know your estimate once you've read through, and flag anything in the
spec that looks off or needs adjusting.

Thanks,
Eslam
