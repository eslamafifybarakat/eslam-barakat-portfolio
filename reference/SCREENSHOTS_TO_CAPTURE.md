# Screenshots to capture — the attachment list

I can't visit your sites and photograph them; there's no browser in my environment that can do that. So this is the list you asked for: exactly which screenshots to take, what to name them, and where to put them.

**Until you add them, nothing looks broken.** Every project already renders a drawn vector poster in your brand colours, chosen by what the project actually is — a pulse trace for telehealth, crops for AGRO TEBA, bar charts for dashboards, a QR grid for payments, book spines for the library, mountains for tourism, an arch for WRTH. The site is finished without a single photo. Screenshots just make it stronger.

## Where the files go

```
index.html
assets/shots/…            ← everything below
Eslam_Afify_Barakat_Senior_Angular_Frontend_Developer_CV.pdf
```

## Capture settings — use these for every shot

| Setting | Value |
|---|---|
| Browser width | **1440px** |
| Capture | Page content only — **no browser chrome, no scrollbar, no cursor** |
| Crop | **16:10** |
| Export | **1200 × 750**, WebP, quality 80 (≈60–120 KB each) |
| What to frame | The hero / first screen, or the single most characteristic view |

Chrome does this natively: **DevTools → Ctrl/Cmd+Shift+P → "Capture screenshot"**. Set the viewport to 1440 first via device toolbar → Responsive.

Two things that make a portfolio look amateur, both avoidable: mixed aspect ratios, and screenshots with a browser window in them. Crop to content.

## Priority 1 — the four that matter most

These are your flagships; they carry the page.

| Project | Live URL | Save as |
|---|---|---|
| Reference Portal — Talbinah | `https://app.talbinah.net/` | `reference-portal.webp` |
| AGRO TEBA | `https://dev.agrotebaint.com/` | `agro-teba.webp` |
| Talbinah Website | `https://talbinah.net/` | `talbinah-website.webp` |
| Procurelinker | `https://p-linker-ssr-16.vercel.app/` | `procurelinker.webp` |

**These four also support a second image** for the gallery — a different view (an inner page, a dashboard, a session screen). Name it with `-2`:

`reference-portal-2.webp` · `agro-teba-2.webp` · `talbinah-website-2.webp`

The gallery only shows a thumbnail strip once a second image actually loads, so adding one is optional per project.

## Priority 2 — six more with slots already wired

| Project | Live URL | Save as |
|---|---|---|
| Knowledge Bank (Tweeq) | `https://tweeq.ikb.sa/#/` | `knowledge-bank.webp` |
| WRTH — Royal Institute | `https://wrth.edu.sa/` | `wrth.webp` |
| Hawdaj | `https://hawdaj.net/` | `hawdaj.webp` |
| Swarm Technologies | `https://swarm-technologies-delta.vercel.app/` | `swarm.webp` |
| Social Studio | `https://social-studio-ivory.vercel.app/` | `social-studio.webp` |
| Eid Adha Card | `https://eid-adh-card.vercel.app/` | `eid-card.webp` |

## Priority 3 — the ones behind changed infrastructure

Five projects are marked *server changed* and one *database changed* in your CV, so the live URL may not render what it used to:

`tweeq.ikb.sa` · `availy.online` · `provider.availy.online` · `availy.shop/bookings/…` · `cms-demo.awaneg.com` · `jusur-dashboard.vercel.app`

**If a link no longer loads, don't screenshot it — leave the vector poster.** That's exactly what the posters are for. A drawn tile reads as a deliberate design choice; a screenshot of an error page or a dead login screen does real damage. If you have old screenshots in your own archive, use those instead.

## Adding a shot to a project that has no slot

Find it in the `WORK` array in `index.html` and add one field:

```js
{n:"Gdawel ERP", k:"ng", f:0, shot:"assets/shots/gdawel.webp", …}
```

Or for a gallery of several:

```js
shots:["assets/shots/gdawel.webp","assets/shots/gdawel-2.webp","assets/shots/gdawel-3.webp"]
```

Suggested filenames for the remaining projects, if you get to them: `medjol-patient` · `medjol-provider` · `qr-payment` · `civil-services` · `jusur` · `ams-policies` · `mention` · `estkdam` · `gdawel` · `seaah` · `hashstudio` · `qias` · `wakeb-tech` · `wakeb-ai` · `nile-ortho` · `nen` · `sarie` · `qaraah` · `taba` · `download-images`.

## Safety net already in place

- A missing or misspelled file **silently falls back** to the vector poster — never a broken-image icon.
- The modal gallery **probes each image first** and only builds the thumbnail strip from files that genuinely load, so a half-filled folder never produces empty thumbnails or a caption that says "Screenshot" over a drawing.
- The caption tells the truth either way: *Screenshot* or *Vector preview — screenshot pending*.
