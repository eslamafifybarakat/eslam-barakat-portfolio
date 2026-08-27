import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkSectionComponent } from '../work-section/work-section.component';
import { WorkService } from '../../application/work.service';
import { SeoService } from '../../../../core/seo/seo.service';
import { JsonLdService } from '../../../../core/seo/json-ld.service';
import { LanguageService } from '../../../../core/i18n/language.service';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { ConfigService } from '../../../../core/config/config.service';
import { LANG_URL_PREFIX } from '../../../../core/i18n/i18n.model';

/** `/work` — the standalone work index route: SEO + `ItemList`/
 * `BreadcrumbList` JSON-LD for the full grid, plus a `<router-outlet>` for
 * the optional `:slug` child that overlays the project modal. */
@Component({
  selector: 'app-work-list-page',
  standalone: true,
  imports: [WorkSectionComponent, RouterOutlet],
  template: `
    <app-work-section />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkListPageComponent {
  private readonly workService = inject(WorkService);
  private readonly seo = inject(SeoService);
  private readonly jsonLd = inject(JsonLdService);
  private readonly languageService = inject(LanguageService);
  private readonly translation = inject(TranslationService);
  private readonly config = inject(ConfigService);

  constructor() {
    const lang = this.languageService.lang();
    const siteUrl = this.config.config().siteUrl;
    const path = `${LANG_URL_PREFIX[lang]}/work`;
    const siteName = this.translation.translate('portfolio_seo_site_name');

    this.seo.set({
      title: this.translation.translate('portfolio_seo_work_title'),
      description: this.translation.translate('portfolio_seo_work_description'),
      path,
    });

    this.jsonLd.set('work-item-list', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: this.workService.all().map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.name,
        url: `${siteUrl}${LANG_URL_PREFIX[lang]}/work/${project.slug}`,
      })),
    });

    this.jsonLd.set('breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: siteName, item: siteUrl },
        { '@type': 'ListItem', position: 2, name: this.translation.translate('portfolio_nav_work'), item: `${siteUrl}${path}` },
      ],
    });
  }
}
