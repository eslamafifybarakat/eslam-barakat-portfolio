import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroComponent } from '../domains/profile/presentation/hero/hero.component';
import { AboutComponent } from '../domains/profile/presentation/about/about.component';
import { SkillsSectionComponent } from '../domains/skills/presentation/skills-section/skills-section.component';
import { ExperienceSectionComponent } from '../domains/experience/presentation/experience-section/experience-section.component';
import { WorkSectionComponent } from '../domains/work/presentation/work-section/work-section.component';
import { EducationSectionComponent } from '../domains/education/presentation/education-section/education-section.component';
import { ContactSectionComponent } from '../domains/contact/presentation/contact-section/contact-section.component';
import { SkeletonComponent } from '../shared/ui/skeleton/skeleton.component';
import { SeoService } from '../core/seo/seo.service';
import { JsonLdService } from '../core/seo/json-ld.service';
import { LanguageService } from '../core/i18n/language.service';
import { TranslationService } from '../core/i18n/translation.service';
import { ConfigService } from '../core/config/config.service';
import { SKILL_GROUPS } from '../domains/skills/infrastructure/data/skills.data';
import { LANG_URL_PREFIX } from '../core/i18n/i18n.model';

/**
 * `/` (and `/ar`) — the one-page composition: `profile → about/pillars →
 * skills → experience → work → education → contact`, in reference order.
 * Not a domain itself; it only assembles each domain's presentation entry
 * component. Below-the-fold sections use incremental hydration (`@defer
 * (hydrate on viewport)`) — full markup still ships in the prerendered
 * HTML for SEO/no-JS, only the component's hydration cost is deferred.
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    SkillsSectionComponent,
    ExperienceSectionComponent,
    WorkSectionComponent,
    EducationSectionComponent,
    ContactSectionComponent,
    SkeletonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly seo = inject(SeoService);
  private readonly jsonLd = inject(JsonLdService);
  private readonly languageService = inject(LanguageService);
  private readonly translation = inject(TranslationService);
  private readonly config = inject(ConfigService);

  constructor() {
    const lang = this.languageService.lang();
    const cfg = this.config.config();
    const path = LANG_URL_PREFIX[lang] || '/';

    this.seo.set({
      title: this.translation.translate('portfolio_seo_home_title'),
      description: this.translation.translate('portfolio_seo_home_description'),
      path,
      type: 'profile',
    });

    this.jsonLd.set('person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Eslam Afify Barakat',
      jobTitle: 'Senior Angular Frontend Developer',
      email: `mailto:${cfg.contact.email}`,
      telephone: cfg.contact.phone,
      address: { '@type': 'PostalAddress', addressLocality: 'Cairo', addressCountry: 'EG' },
      sameAs: [cfg.contact.linkedin, cfg.contact.github],
      knowsAbout: SKILL_GROUPS.flatMap((g) => g.technologies),
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Menoufia University' },
      knowsLanguage: ['ar', 'en'],
      url: cfg.siteUrl,
    });

    this.jsonLd.set('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.translation.translate('portfolio_seo_site_name'),
      url: cfg.siteUrl,
      inLanguage: lang,
    });
  }
}
