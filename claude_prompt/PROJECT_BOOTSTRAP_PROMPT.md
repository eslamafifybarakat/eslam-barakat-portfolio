# PROJECT BRIEF — Build `eslam-barakat-portfolio` on Angular (Latest Stable Major, Verified) with SSR

You are scaffolding a **brand-new, production-grade personal portfolio application** from zero.

The project name is:

```text
eslam-barakat-portfolio
```

Use the latest stable Angular major version available at build time. Confirm the installed version before scaffolding and never assume a specific Angular major.

---

## 0. OPERATING MODE — FULL AUTONOMY

Work end-to-end without unnecessary clarification questions.

For every decision:

* Choose the most professional, industry-standard solution.
* Prefer solutions consistent with this brief.
* If portfolio-specific information is missing, make a sensible professional decision.
* Never leave TODOs or placeholder implementations waiting for input.
* Document important assumptions and decisions in `README.md` and the progress report.
* Only stop for a genuine hard technical blocker that cannot reasonably be resolved.

### Non-Negotiable Priorities

1. Domain-Driven Design architecture.
2. BEM-named SCSS with a token-driven design system.
3. Full SSR with route-level SEO.
4. High-performance image handling.
5. WCAG AA accessibility.
6. Custom dependency-free runtime i18n.
7. Runtime light/dark theme support.
8. Complete favicon/logo/brand icon system.
9. Lighthouse 100 target across all portfolio routes.
10. Production-ready GitHub and Vercel deployment.

---

# 1. PORTFOLIO PROJECT IDENTITY

This is a **professional personal portfolio website** for:

**Eslam Barakat**

The application should present the portfolio as a senior-level frontend engineering profile.

The design must communicate:

* Seniority.
* Technical expertise.
* Professional credibility.
* Strong Angular expertise.
* Modern frontend architecture.
* Production experience.
* Clean engineering practices.
* Strong UI/UX attention.
* International/global readiness.

Do not create a generic template-looking portfolio.

The final result should feel like a **high-end senior frontend engineer portfolio**, not a basic developer landing page.

---

# 2. STACK

Use:

* Angular — latest stable major.
* Standalone components only.
* No NgModules.
* TypeScript strict mode.
* SCSS.
* `@angular/ssr`.
* Signals for local/reactive state.
* RxJS only at true asynchronous boundaries such as `HttpClient`.
* Zoneless change detection if supported stably by the installed Angular version.
* Otherwise use `zone.js`.

Do not use:

* Angular Material.
* PrimeNG.
* Generic UI component libraries.
* `ngx-translate`.
* `@angular/localize`.

Build the design system from scratch under:

```text
src/app/shared/ui/
```

---

# 3. DOMAIN-DRIVEN DESIGN ARCHITECTURE

Organize the application by bounded contexts rather than technical layers.

Use:

```text
src/app/
├── core/
│   ├── routing/
│   ├── ssr/
│   ├── i18n/
│   ├── theme/
│   ├── analytics/
│   ├── http/
│   ├── api/
│   └── seo/
│
├── shared/
│   ├── ui/
│   ├── directives/
│   ├── pipes/
│   └── utils/
│
└── domains/
    ├── home/
    ├── about/
    ├── experience/
    ├── skills/
    ├── projects/
    ├── project-details/
    ├── services/
    ├── education/
    ├── certifications/
    ├── contact/
    └── resume/
```

Every domain must own its complete vertical slice:

```text
<domain>/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

### Domain Layer

Contains:

* Entities.
* Value objects.
* Models.
* Types.

Must contain:

* Pure TypeScript.
* Zero Angular imports.
* Zero HTTP dependencies.

### Application Layer

Contains:

* Use cases.
* Orchestration.
* Signal-based state services.

### Infrastructure Layer

Contains:

* API adapters.
* External data sources.
* HTTP models.
* API mapping.

Only this layer knows HTTP shapes/endpoints.

### Presentation Layer

Contains:

* Components.
* Templates.
* SCSS.
* Tests.
* Domain routes.

### Dependency Direction

Always:

```text
presentation
    ↓
application
    ↓
infrastructure
    ↓
domain
```

Never reverse the dependency direction.

A component must never call an API service directly.

Every domain must be lazy-loaded through the main route configuration. The source brief requires explicit server render modes for static, dynamic, and genuinely client-only routes.

---

# 4. PORTFOLIO ROUTES

Create a professional route structure.

At minimum:

```text
/
 /about
 /experience
 /skills
 /projects
 /projects/:slug
 /services
 /education
 /certifications
 /contact
 /resume
```

Also support appropriate aliases where professionally useful without creating duplicate pages.

### Home

The homepage should contain the strongest portfolio summary:

* Hero.
* Professional title.
* Short value proposition.
* Primary CTA.
* Secondary CTA.
* Selected projects.
* Core skills.
* Experience summary.
* Services.
* Professional statistics/highlights.
* Contact CTA.

### Projects

Provide a dedicated projects experience with:

* Project cards.
* Categories.
* Technology tags.
* Role.
* Responsibilities.
* Project summary.
* Links.
* Optional live/demo links.
* Optional repository links.
* Project detail pages.

Each project detail page must be SEO-friendly and SSR-rendered.

### Experience

Present professional experience clearly:

* Company.
* Role.
* Period.
* Responsibilities.
* Major achievements.
* Technologies.
* Relevant projects.

### Skills

Organize skills professionally, for example:

* Angular.
* TypeScript.
* JavaScript.
* HTML5.
* SCSS.
* RxJS.
* Signals.
* SSR.
* SEO.
* Accessibility.
* REST APIs.
* Firebase.
* Git.
* CI/CD.
* UI architecture.
* Performance optimization.

Do not represent skill level using misleading arbitrary percentages.

### Resume

Provide a professional resume section and downloadable CV when an actual CV asset is available.

Do not invent qualifications, companies, certifications, or achievements that are not provided by the reference material.

---

# 5. DESIGN SYSTEM & BEM SCSS

Create:

```text
src/styles/
├── _tokens.scss
├── _themes.scss
├── _typography.scss
├── _mixins.scss
├── _functions.scss
├── _reset.scss
└── index.scss
```

Use:

```scss
.block
.block__element
.block--modifier
```

Rules:

* No deep selector nesting.
* No bare HTML elements as style hooks.
* Use logical CSS properties.
* Use `margin-inline`, `padding-inline`, `inset-inline`, etc.
* Avoid `[dir]` styling branches.

Create reusable design-system components:

* Button.
* Card.
* Badge.
* Chip.
* Input.
* Textarea.
* Tabs.
* Accordion.
* Modal.
* Tooltip.
* Skeleton.
* Avatar.
* Rating.
* Section header.
* Container.
* Social link.
* Project card.
* Timeline item.

Never duplicate shared primitives inside individual domains.

---

# 6. PERSONAL BRAND DESIGN

Create a distinctive visual identity suitable for a senior frontend engineer.

If brand assets are provided, treat them as the source of truth.

If they are not provided:

* Choose a sophisticated professional visual system.
* Avoid generic template aesthetics.
* Use a restrained developer/technology-inspired visual language.
* Keep typography highly readable.
* Prioritize content hierarchy over decorative effects.
* Use subtle motion rather than excessive animation.
* Ensure the design remains professional in both light and dark modes.

Document any inferred branding decisions in `README.md`.

---

# 7. DARK / LIGHT THEME

Implement a signal-based `ThemeService`.

Requirements:

* SSR-aware.
* Initial theme from SSR request cookie.
* Fallback to `prefers-color-scheme`.
* Final fallback to light.
* Apply `data-theme` to `<html>` through `effect()`.
* Persist explicit preference to:

  * `localStorage`
  * Cookie.

Add a no-flash inline script at the top of `<head>` that sets the theme before first paint.

The theme toggle must:

* Be keyboard accessible.
* Have a visible focus state.
* Have an accessible name describing the next state.

---

# 8. INTERNATIONALIZATION

Build a dependency-free custom i18n system.

Create:

```text
core/i18n/i18n.model.ts
core/i18n/language.service.ts
core/i18n/translation.service.ts
core/i18n/translate.pipe.ts
```

Use catalogs:

```text
src/locales/
├── en.json
├── ar.json
└── ...
```

Use namespaced translation keys:

```text
eslam_portfolio_home_hero_title
eslam_portfolio_home_hero_description
eslam_portfolio_projects_title
```

The default language must be statically available for SSR.

Additional languages should be dynamically imported.

Support:

* Interpolation.
* Reactive translation signals.
* Translation existence checks.
* Runtime language switching.
* Persistence to cookie/localStorage.

### RTL

The portfolio must fully support RTL.

Apply:

```html
<html lang="ar" dir="rtl">
```

when Arabic is selected.

All component layouts must rely on logical CSS properties.

---

# 9. HEADER & NAVIGATION

Create a polished responsive header containing:

* Personal brand/logo.
* Navigation.
* Language toggle.
* Theme toggle.
* Primary contact CTA where appropriate.

Desktop:

* Clean horizontal navigation.

Mobile:

* Accessible menu.
* Keyboard navigation.
* Focus management.
* Proper ARIA state.
* Prevent background interaction while the menu is open where necessary.

Navigation must work correctly in both LTR and RTL.

---

# 10. HERO SECTION

The hero must immediately communicate:

**Who Eslam is + what he specializes in + why the visitor should continue.**

Include:

* Name.
* Senior frontend/Angular-focused title.
* Short professional positioning.
* Primary CTA.
* Secondary CTA.
* Social/profile links where provided.
* Professional visual/portrait when available.
* Subtle technology/engineering visual treatment.

Do not overload the hero with meaningless animations.

The hero image, if present, is an LCP asset and must not use lazy-loading behavior intended for below-the-fold images.

---

# 11. PROJECTS SYSTEM

Projects are a core portfolio domain.

Each project should support structured information such as:

```text
title
slug
description
role
company
period
technologies
responsibilities
features
highlights
liveUrl
repositoryUrl
image
gallery
category
featured
```

Do not invent URLs or project facts.

If project information is provided in reference material, preserve it accurately.

### Project Listing

Provide:

* Featured projects.
* Project categories.
* Technology filtering where useful.
* Responsive project cards.
* Clear CTA to project details.

### Project Details

Each project detail page should include:

* Project title.
* Summary.
* Role.
* Technologies.
* Responsibilities.
* Key contributions.
* Screenshots/gallery.
* Live project link.
* Repository link when available.
* Related projects.

Use JSON-LD appropriate to the page content.

---

# 12. EXPERIENCE & CAREER TIMELINE

Create a professional experience timeline.

Each experience item should support:

```text
company
role
startDate
endDate
location
description
responsibilities
achievements
technologies
```

Use chronological ordering.

Do not invent dates or employers.

Where data is missing, omit the field rather than fabricate it.

---

# 13. SKILLS & TECHNOLOGY

Create a scalable skills model.

Organize skills into meaningful groups rather than a random tag cloud.

Example:

```text
Frontend Engineering
Angular Ecosystem
Architecture
Styling & UI
Backend/API Integration
Cloud & Services
Testing
DevOps & Deployment
Performance & SEO
```

Skills should be reusable in:

* Project pages.
* Experience.
* Services.
* Homepage.

---

# 14. SERVICES

Present services professionally, such as:

* Angular application development.
* Frontend architecture.
* SSR/SEO implementation.
* UI modernization.
* Performance optimization.
* Legacy Angular migration.
* Design-system development.
* Accessibility improvements.

Only include services that are supported by the provided professional information.

Do not claim unsupported expertise.

---

# 15. CONTACT

Create a professional contact section/page.

Support:

* Contact form.
* Email.
* Social/profile links.
* Optional phone/location only if explicitly provided.

The form must include:

* Accessible labels.
* Validation.
* Loading state.
* Success state.
* Error state.
* Keyboard accessibility.

Do not expose secrets or private configuration in frontend code.

---

# 16. IMAGES & PERFORMANCE

Never use uncontrolled plain `<img>` elements.

Implement:

```text
LazyLoadImgDirective
ImgFallbackDirective
```

Use Angular's `NgOptimizedImage`/current official image optimization API for stable known assets.

Every image must have:

* Dimensions/aspect ratio.
* Appropriate loading strategy.
* Correct `alt`.
* Modern image format where possible.

Use lazy loading for below-the-fold imagery.

Do not lazy-load the LCP hero image.

The source brief explicitly requires optimized image handling, responsive dimensions, modern formats, and meaningful alt text.

---

# 17. ACCESSIBILITY

Target WCAG AA.

Implement:

* Semantic landmarks.
* Correct heading hierarchy.
* One logical `h1` per page.
* Skip-to-content.
* Keyboard accessibility.
* Visible focus states.
* Accessible navigation.
* Accessible forms.
* Accessible dialogs.
* Focus trapping and restoration.
* Sufficient contrast in both themes.
* Reduced-motion support.

Never remove focus indicators without replacing them.

---

# 18. SSR & SEO

Every public portfolio route must be SSR-compatible.

Create:

```text
app.routes.ts
app.routes.server.ts
core/seo/seo.service.ts
```

SEO must support:

* Title.
* Description.
* Canonical URL.
* Open Graph.
* Twitter Card.
* `hreflang`.
* JSON-LD.
* Breadcrumbs where appropriate.

### Portfolio JSON-LD

Use structured data appropriate to the portfolio:

* `Person`.
* `WebSite`.
* `WebPage`.
* `ProfilePage`.
* `BreadcrumbList`.
* `CreativeWork`/`SoftwareApplication` where appropriate for projects.

Do not use inappropriate structured data solely to increase SEO.

Generate:

```text
sitemap.xml
robots.txt
```

Include localized routes and language alternates where applicable.

---

# 19. FAVICON & BRAND ASSETS

Generate and wire:

```text
favicon.svg
favicon.ico
apple-touch-icon.png
mask-icon.svg
site.webmanifest
192x192 icon
512x512 icon
```

Also configure:

* Theme color.
* Apple web app metadata.
* Microsoft metadata where appropriate.

Create route-specific OG images rather than using one generic image for every page.

---

# 20. LOADING, EMPTY & ERROR STATES

Create reusable skeletons under:

```text
shared/ui/
```

Variants:

* Text.
* Card.
* Avatar.
* Image.
* List.

Every route must have appropriate loading behavior.

Every async action must provide:

* Loading state.
* Disabled state where appropriate.
* Success state.
* Error state.

Also create:

* Empty states.
* 404 page.
* Error page.
* Offline-friendly state.

Never display a blank page or raw browser error.

---

# 21. COMPONENT FILE CONVENTION

Every component must use:

```text
component-name/
├── component-name.component.ts
├── component-name.component.html
├── component-name.component.scss
└── component-name.component.spec.ts
```

Avoid inline templates/styles except trivial one-liners.

---

# 22. PERFORMANCE & LIGHTHOUSE

Create:

```text
npm run lighthouse
```

The script must:

1. Build production.
2. Start SSR locally.
3. Run Lighthouse/Lighthouse CI.
4. Test every public route.
5. Test both themes.
6. Test both languages when content differs.
7. Wait for hydration/network idle.
8. Record:

```text
Route
Performance
Accessibility
Best Practices
SEO
LCP
CLS
TBT
```

Target:

```text
Performance       100
Accessibility     100
Best Practices    100
SEO               100
```

If 100 is impossible:

* Document the exact route.
* Document the metric.
* Document the cause.
* Document the difference.

Never claim 100 without an actual measurement.

The source brief specifically requires a real Lighthouse report rather than an assumed score.

---

# 23. ENVIRONMENT CONFIGURATION

Create:

```text
src/environments/
├── environment.ts
├── environment.prod.ts
└── environment.staging.ts
```

Expose:

```text
production
apiBaseUrl
defaultLanguage
```

Create a runtime `ConfigService`.

Support overriding `apiBaseUrl` through:

```text
config.json
```

or server environment variables.

Use a centralized API layer.

Never hardcode URLs inside components.

If no backend exists, use dev-only mock interceptors with realistic portfolio data.

---

# 24. GITHUB

Initialize Git.

Use:

```text
.gitignore
```

containing:

```text
node_modules
dist
.angular
.env*
```

### Repository

Project/repository name:

```text
eslam-barakat-portfolio
```

Use a professional repository description such as:

```text
Eslam Barakat — Senior Angular & Frontend Engineer Portfolio
```

Do not create a second project name.

If GitHub credentials/access are available, create and push the repository.

If access is unavailable, complete the project locally and clearly report the deployment blocker.

---

# 25. VERCEL

Deploy:

```text
eslam-barakat-portfolio
```

using Angular SSR.

Use:

```text
npm run build
```

as the build command.

Confirm the exact Angular output directory generated by the installed version.

Configure environment variables per:

* Production.
* Preview.
* Development.

Never commit secrets.

Verify:

* SSR.
* Routing.
* Static assets.
* Sitemap.
* Robots.
* SEO.
* OG images.
* Language switching.
* Theme persistence.

---

# 26. README

Create a professional root `README.md` documenting:

* Project overview.
* Project name.
* Angular version.
* Tech stack.
* Architecture.
* DDD structure.
* Domains.
* Routes.
* Design system.
* Theme system.
* i18n.
* SSR.
* SEO.
* Performance.
* Accessibility.
* Environment configuration.
* API assumptions.
* Testing.
* Lighthouse methodology.
* GitHub repository.
* Vercel deployment.
* Important architectural decisions.
* Any assumptions made due to missing reference material.

---

# 27. DEFINITION OF DONE

The project is complete only when:

* [ ] Latest stable Angular version verified.
* [ ] Angular version documented.
* [ ] Standalone architecture implemented.
* [ ] DDD architecture implemented.
* [ ] All domains follow the dependency direction.
* [ ] BEM SCSS implemented.
* [ ] Design tokens implemented.
* [ ] Light theme implemented.
* [ ] Dark theme implemented.
* [ ] Theme persistence works.
* [ ] Custom i18n implemented.
* [ ] RTL works correctly.
* [ ] Language persistence works.
* [ ] Responsive navigation implemented.
* [ ] Homepage completed.
* [ ] About completed.
* [ ] Experience completed.
* [ ] Skills completed.
* [ ] Projects completed.
* [ ] Project detail pages completed.
* [ ] Services completed.
* [ ] Education completed where supported by source data.
* [ ] Certifications completed where supported by source data.
* [ ] Contact completed.
* [ ] Resume section completed.
* [ ] SSR works for every public route.
* [ ] SEO metadata is SSR-rendered.
* [ ] JSON-LD implemented where appropriate.
* [ ] Sitemap generated.
* [ ] Robots generated.
* [ ] Favicons configured.
* [ ] Manifest configured.
* [ ] OG images configured.
* [ ] Image optimization implemented.
* [ ] WCAG AA reviewed.
* [ ] Loading states implemented.
* [ ] Empty states implemented.
* [ ] Error states implemented.
* [ ] 404 implemented.
* [ ] Unit tests pass.
* [ ] Lint passes.
* [ ] Production build passes.
* [ ] SSR build passes.
* [ ] Lighthouse report generated.
* [ ] Lighthouse scores are 100 or documented exceptions exist.
* [ ] Git repository initialized.
* [ ] GitHub repository prepared/pushed where credentials permit.
* [ ] Vercel deployment prepared/deployed where credentials permit.
* [ ] Production URL documented in README.

---

# 28. HOW TO START

Execute in this exact order:

### Step 1 — Verify Angular

Run:

```bash
npm view @angular/cli versions --json | tail
ng version
```

Determine the latest stable major.

Do not assume a major version.

### Step 2 — Inspect Reference Material

Extract all available:

* Personal branding.
* Portfolio information.
* Projects.
* Experience.
* Skills.
* Education.
* Certifications.
* Contact information.
* Logos.
* Fonts.
* Images.
* Colors.
* Design tokens.

Do not invent professional facts.

### Step 3 — Scaffold

Create:

```text
eslam-barakat-portfolio
```

with Angular SSR and the DDD architecture.

### Step 4 — Build the Foundation

Before domain content, implement:

* Design system.
* Theme.
* i18n.
* RTL.
* SEO.
* SSR.
* Accessibility.
* Image directives.
* Favicon/brand system.
* Skeleton/loading system.

### Step 5 — Build Portfolio Domains

Implement domains one by one:

```text
Home
About
Experience
Skills
Projects
Project Details
Services
Education
Certifications
Contact
Resume
```

Report progress domain-by-domain.

### Step 6 — Validate

Run:

```text
Build
SSR
Lint
Unit tests
Accessibility checks
SEO validation
Lighthouse
```

Fix issues before proceeding.

### Step 7 — GitHub

Prepare:

```text
eslam-barakat-portfolio
```

for GitHub and push when authenticated access is available.

### Step 8 — Vercel

Deploy the SSR application to Vercel.

Verify the production deployment end-to-end.

### Step 9 — Final Report

Provide:

* Angular version.
* Completed domains.
* Routes.
* Architecture.
* Important decisions.
* Test results.
* Lighthouse results.
* GitHub repository.
* Vercel production URL.
* Any genuine blockers or documented exceptions.

Do not stop during the implementation for routine decisions. Make professional decisions autonomously and document them.
