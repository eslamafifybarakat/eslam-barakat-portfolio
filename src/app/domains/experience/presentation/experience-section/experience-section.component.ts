import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SectionHeadComponent } from '@shared/ui/section-head/section-head.component';
import { TimelineItemComponent } from '@shared/ui/timeline/timeline.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ExperienceService } from '../../application/experience.service';
import { TranslationService } from '@core/i18n/translation.service';
import { hostFromUrl } from '@shared/utils/host-from-url';
import type { TimelineItemView } from '@shared/ui/timeline/timeline.model';

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
  private readonly translation = inject(TranslationService);

  protected readonly items = computed<TimelineItemView[]>(() =>
    this.experienceService.jobs().map((job) => ({
      company: job.company,
      when: this.translation.translate(job.whenKey),
      role: this.translation.translate(job.roleKey),
      meta: this.translation.translate(job.metaKey),
      site: job.site,
      siteHost: job.site ? hostFromUrl(job.site) : undefined,
      bullets: job.bulletKeys.map((key) => this.translation.translate(key)),
    })),
  );
}
