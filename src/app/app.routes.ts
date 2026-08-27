import { Routes } from '@angular/router';

/**
 * English is served unprefixed, Arabic mirrored under `/ar` — see
 * `core/i18n/i18n.model.ts` for why (honest hreflang/canonicals/sitemap).
 * `/work/:slug` is a CHILD of `/work` so the parent grid component stays
 * mounted across the navigation (the project modal is a router-outlet swap,
 * never a full reload) — see `ProjectDetailComponent`'s doc comment.
 *
 * No route below sets a static `title:` — every routed component calls
 * `SeoService` in its constructor, which is the single source of truth for
 * `<title>` (translation-catalog text, correct per language). Angular's
 * default `TitleStrategy` re-applies a route's static `title` on every
 * `NavigationEnd`, which runs *after* component construction — so a static
 * title here doesn't just duplicate the component's title, it silently
 * wins over it. Confirmed against prerendered output: `/work` shipped
 * "Eslam Afify Barakat — Work" instead of the catalog's "Work — Eslam
 * Afify Barakat" until that route's static title was removed.
 */
const workRoutes: Routes = [
  {
    path: 'work',
    loadComponent: () =>
      import('./domains/work/presentation/work-list-page/work-list-page.component').then(
        (m) => m.WorkListPageComponent,
      ),
    children: [
      {
        path: ':slug',
        loadComponent: () =>
          import('./domains/work/presentation/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent,
          ),
      },
    ],
  },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  ...workRoutes,
  {
    path: 'ar',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'ar/work',
    loadComponent: () =>
      import('./domains/work/presentation/work-list-page/work-list-page.component').then(
        (m) => m.WorkListPageComponent,
      ),
    children: [
      {
        path: ':slug',
        loadComponent: () =>
          import('./domains/work/presentation/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
