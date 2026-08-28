import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SeoService } from '@core/seo/seo.service';
import { LanguageService } from '@core/i18n/language.service';
import { LANG_URL_PREFIX } from '@core/i18n/i18n.model';
import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import type { SeoPayload } from '@core/seo/seo.model';
import response from './not-found.json';

interface NotFoundData {
  readonly titleKey: string;
  readonly messageKey: string;
  readonly ctaHomeKey: string;
  readonly ctaWorkKey: string;
  readonly seo: SeoPayload;
}

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
  private readonly languageService = inject(LanguageService);

  protected readonly data = readApiResponse(response as ApiResponse<NotFoundData>, 'not-found');
  protected readonly homePath = computed(() => LANG_URL_PREFIX[this.languageService.lang()] || '/');
  protected readonly workPath = computed(() => `${this.homePath() === '/' ? '' : this.homePath()}/work`);

  constructor() {
    this.seo.setFromPayload(this.data.seo, {
      path: this.homePath(),
      fallbackTitleKey: this.data.titleKey,
      fallbackDescriptionKey: this.data.messageKey,
      noindex: true,
    });
  }
}
