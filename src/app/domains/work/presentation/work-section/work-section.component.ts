import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionHeadComponent } from '../../../../shared/ui/section-head/section-head.component';
import { FilterChipsComponent } from '../../../../shared/ui/filter-chips/filter-chips.component';
import { SearchInputComponent } from '../../../../shared/ui/search-input/search-input.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { WorkService } from '../../application/work.service';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { LanguageService } from '../../../../core/i18n/language.service';
import { LANG_URL_PREFIX } from '../../../../core/i18n/i18n.model';
import { isWorkFilterKey, WorkFilterKey } from '../../domain/work-filter.model';
import type { FilterOption } from '../../../../shared/ui/filter-chips/filter-chips.model';

const FILTER_LABEL_KEYS: Record<WorkFilterKey, string> = {
  all: 'portfolio_work_filter_all',
  ng: 'portfolio_work_filter_angular',
  js: 'portfolio_work_filter_js',
  feat: 'portfolio_work_filter_flagship',
};

/**
 * The Work section — filters, search, count line and the project grid.
 * Used both inline as part of the one-page Home composition and as the
 * body of the `/work` route. Filter/search state is reflected in `?k=&q=`
 * (via this component's own route, whichever one it's mounted under) so a
 * filtered view is linkable and restorable after SSR.
 */
@Component({
  selector: 'app-work-section',
  standalone: true,
  imports: [SectionHeadComponent, FilterChipsComponent, SearchInputComponent, ProjectCardComponent, TranslatePipe],
  templateUrl: './work-section.component.html',
  styleUrl: './work-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkSectionComponent {
  protected readonly workService = inject(WorkService);
  private readonly translation = inject(TranslationService);
  private readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly filterOptions = computed<FilterOption[]>(() =>
    (['all', 'ng', 'js', 'feat'] as const).map((key) => ({
      key,
      label: this.translation.translate(FILTER_LABEL_KEYS[key]),
    })),
  );

  protected readonly visible = computed(() => this.workService.visibleFor(this.languageService.lang()));

  protected readonly countText = computed(() =>
    this.translation.translate('portfolio_work_count', {
      shown: this.visible().length,
      total: this.workService.all().length,
    }),
  );

  protected readonly homePath = computed(() => LANG_URL_PREFIX[this.languageService.lang()] || '/');

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const initialFilter = params.get('k');
    const initialQuery = params.get('q');
    if (isWorkFilterKey(initialFilter)) this.workService.setFilter(initialFilter);
    if (initialQuery) this.workService.setQuery(initialQuery);

    let isFirstRun = true;
    effect(() => {
      const filter = this.workService.filter();
      const query = this.workService.query();
      if (isFirstRun) {
        isFirstRun = false;
        return;
      }
      const queryParams: Record<string, string | null> = {
        k: filter === 'all' ? null : filter,
        q: query || null,
      };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  openProject(slug: string): void {
    const prefix = this.homePath() === '/' ? '' : this.homePath();
    this.router.navigateByUrl(`${prefix}/work/${slug}`);
  }
}
