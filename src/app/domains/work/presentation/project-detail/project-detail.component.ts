import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { GalleryComponent } from '@shared/ui/gallery/gallery.component';
import { ProjectPosterComponent } from '@shared/ui/project-poster/project-poster.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { WorkService } from '../../application/work.service';
import { GalleryProbeService } from '../../application/gallery-probe.service';
import { LanguageService } from '@core/i18n/language.service';
import { TranslationService } from '@core/i18n/translation.service';
import { LANG_URL_PREFIX } from '@core/i18n/i18n.model';
import { SeoService } from '@core/seo/seo.service';
import { JsonLdService } from '@core/seo/json-ld.service';
import { ConfigService } from '@core/config/config.service';
import { hostFromUrl } from '@shared/utils/host-from-url';
import type { Project } from '../../domain/project.model';

/**
 * `/work/:slug` — a child route of `/work`, so the parent grid
 * (`WorkListPageComponent`) stays mounted and this only swaps the router
 * outlet's content: closing the modal is a route change back to the
 * parent, never a full reload. Deep-linking straight here still renders
 * correctly (the parent grid renders regardless of which child matched).
 * Reacts to `paramMap` (not just a one-shot read) because a "related work"
 * click navigates from one slug to another while this component instance
 * is reused by the router.
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    ModalComponent,
    GalleryComponent,
    ProjectPosterComponent,
    ButtonComponent,
    IconComponent,
    ProjectCardComponent,
    TranslatePipe,
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly workService = inject(WorkService);
  private readonly galleryProbe = inject(GalleryProbeService);
  private readonly languageService = inject(LanguageService);
  private readonly translation = inject(TranslationService);
  private readonly seo = inject(SeoService);
  private readonly jsonLd = inject(JsonLdService);
  private readonly config = inject(ConfigService);

  protected readonly galleryImages = signal<string[]>([]);
  protected readonly galleryIndex = signal(0);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly project = computed<Project | undefined>(() => {
    const slug = this.paramMap().get('slug');
    return slug ? this.workService.getBySlug(slug) : undefined;
  });

  protected readonly hostLabel = computed(() => {
    const project = this.project();
    return project ? hostFromUrl(project.links[0]).toUpperCase() : '';
  });
  protected readonly related = computed(() => {
    const project = this.project();
    return project ? this.workService.getRelated(project) : [];
  });

  constructor() {
    effect(() => {
      const project = this.project();
      this.galleryIndex.set(0);
      this.galleryImages.set([]);
      if (!project) return;

      this.setSeo(project);

      const candidates = project.shots?.length ? project.shots : project.shot ? [project.shot] : [];
      const fullUrls = candidates.map((c) => `/assets/shots/${c}`);
      this.galleryProbe.probe(fullUrls).then((verified) => this.galleryImages.set(verified));
    });

    this.destroyRef.onDestroy(() => {
      this.jsonLd.remove('project');
      this.jsonLd.remove('breadcrumbs');
    });
  }

  close(): void {
    const prefix = LANG_URL_PREFIX[this.languageService.lang()] || '';
    this.router.navigateByUrl(`${prefix}/work`);
  }

  openRelated(slug: string): void {
    const prefix = LANG_URL_PREFIX[this.languageService.lang()] || '';
    this.router.navigateByUrl(`${prefix}/work/${slug}`);
  }

  private setSeo(project: Project): void {
    const lang = this.languageService.lang();
    const siteUrl = this.config.config().siteUrl;
    const path = `${LANG_URL_PREFIX[lang]}/work/${project.slug}`;
    const siteName = this.translation.translate('portfolio_seo_site_name');
    const description = this.translation.translate(project.descriptionKey);

    const keywords = project.stack.join(', ');

    if (project.seo) {
      this.seo.setFromPayload(project.seo, {
        path,
        fallbackTitleKey: project.descriptionKey,
        fallbackDescriptionKey: project.descriptionKey,
        fallbackKeywords: keywords,
        type: 'article',
      });
    } else {
      this.seo.set({
        title: `${project.name} — ${siteName}`,
        description,
        path,
        keywords,
        type: 'article',
      });
    }

    this.jsonLd.set('project', {
      '@context': 'https://schema.org',
      '@type': project.kind === 'ng' ? 'SoftwareApplication' : 'CreativeWork',
      name: project.name,
      description,
      url: project.links[0],
      applicationCategory: project.kind === 'ng' ? 'WebApplication' : undefined,
      keywords: project.stack.join(', '),
      temporalCoverage: this.translation.translate(project.periodKey, undefined, 'en'),
    });

    this.jsonLd.set('breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: siteName, item: siteUrl },
        { '@type': 'ListItem', position: 2, name: this.translation.translate('portfolio_nav_work'), item: `${siteUrl}${LANG_URL_PREFIX[lang]}/work` },
        { '@type': 'ListItem', position: 3, name: project.name, item: `${siteUrl}${path}` },
      ],
    });
  }
}
