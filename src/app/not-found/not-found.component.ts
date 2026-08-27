import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { TranslatePipe } from '../shared/pipes/translate.pipe';
import { SeoService } from '../core/seo/seo.service';
import { TranslationService } from '../core/i18n/translation.service';
import { LanguageService } from '../core/i18n/language.service';
import { LANG_URL_PREFIX } from '../core/i18n/i18n.model';

/** The styled 404 — `**` in the route table, noindexed but still fully
 * SSR-rendered (never a raw browser error or blank page). */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonComponent, TranslatePipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private readonly seo = inject(SeoService);
  private readonly translation = inject(TranslationService);
  private readonly languageService = inject(LanguageService);

  protected readonly homePath = computed(() => LANG_URL_PREFIX[this.languageService.lang()] || '/');
  protected readonly workPath = computed(() => `${this.homePath() === '/' ? '' : this.homePath()}/work`);

  constructor() {
    this.seo.set({
      title: this.translation.translate('portfolio_seo_404_title'),
      description: this.translation.translate('portfolio_404_message'),
      path: this.homePath(),
      noindex: true,
    });
  }
}
