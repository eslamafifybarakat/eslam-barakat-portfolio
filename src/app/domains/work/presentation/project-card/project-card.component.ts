import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CardComponent } from '@shared/ui/card/card.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { ChipComponent } from '@shared/ui/chip/chip.component';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { ProjectPosterComponent } from '@shared/ui/project-poster/project-poster.component';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { LazyLoadImgDirective } from '@shared/directives/lazy-load-img.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@core/i18n/translation.service';
import { hostFromUrl } from '@shared/utils/host-from-url';
import type { Project } from '../../domain/project.model';

/** One project card in the `/work` grid (`.card` in the reference). Shows
 * the screenshot when one loads, the drawn poster otherwise — no probing
 * here (that's the gallery's job); a broken screenshot just falls back to
 * the poster already sitting behind it via `ImgFallbackDirective`. */
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CardComponent,
    BadgeComponent,
    ChipComponent,
    IconComponent,
    ProjectPosterComponent,
    ImgFallbackDirective,
    LazyLoadImgDirective,
    TranslatePipe,
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  private readonly translation = inject(TranslationService);

  @Input({ required: true }) project!: Project;
  /** `3` (default) when nested one level under an `h2` section heading
   * (Home's inline grid); `2` when the parent grid's own section heading is
   * an `h1` (the standalone `/work` route); `4` when nested under the
   * modal's own `h3` title (the `related` grid) — keeps heading levels
   * sequential instead of skipping or flattening one. */
  @Input() headingLevel: 2 | 3 | 4 = 3;
  @Output() readonly openDetails = new EventEmitter<void>();

  protected readonly liveHref = computed(() => this.project.links[0]);
  protected readonly hostLabel = computed(() => hostFromUrl(this.project.links[0]).toUpperCase());
  protected readonly kindLabel = computed(() =>
    this.translation.translate(this.project.kind === 'ng' ? 'portfolio_work_kind_angular' : 'portfolio_work_kind_js'),
  );
  protected readonly ariaLabel = computed(
    () => `${this.project.name} — ${this.translation.translate('portfolio_work_details_cta')}`,
  );
}
