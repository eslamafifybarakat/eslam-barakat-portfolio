import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SectionHeadComponent } from '../../../../shared/ui/section-head/section-head.component';
import { TimelineItemComponent } from '../../../../shared/ui/timeline/timeline.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ExperienceService } from '../../application/experience.service';
import { LanguageService } from '../../../../core/i18n/language.service';
import { hostFromUrl } from '../../../../shared/utils/host-from-url';
import type { TimelineItemView } from '../../../../shared/ui/timeline/timeline.model';

/** The Timeline section — the 3 career roles. */
@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [SectionHeadComponent, TimelineItemComponent, TranslatePipe],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSectionComponent {
  private readonly experienceService = inject(ExperienceService);
  private readonly languageService = inject(LanguageService);

  protected readonly items = computed<TimelineItemView[]>(() => {
    const lang = this.languageService.lang();
    return this.experienceService.jobs().map((job) => ({
      company: job.company,
      when: job.when[lang],
      role: job.role[lang],
      meta: job.meta[lang],
      site: job.site,
      siteHost: job.site ? hostFromUrl(job.site) : undefined,
      bullets: job.bullets[lang],
    }));
  });
}
