import { Routes } from '@angular/router';

/**
 * English is served unprefixed, Arabic mirrored under `/ar` — see
 * `core/i18n/i18n.model.ts` for why (honest hreflang/canonicals/sitemap).
 * `/work/:slug` is a CHILD of `/work` so the parent grid component stays
 * mounted across the navigation (the project modal is a router-outlet swap,
 * never a full reload) — see `ProjectDetailComponent`'s doc comment.
 */
const workRoutes: Routes = [
  {
    path: 'work',
    loadComponent: () =>
      import('./domains/work/presentation/work-list-page/work-list-page.component').then(
        (m) => m.WorkListPageComponent,
      ),
    title: 'Eslam Afify Barakat — Work',
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
    title: 'Eslam Afify Barakat — Senior Angular Frontend Developer',
  },
  ...workRoutes,
  {
    path: 'ar',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    title: 'Eslam Afify Barakat — مطوّر واجهات أمامية أول Angular',
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
    title: 'Eslam Afify Barakat — Page not found',
  },
];
