import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationService } from '../../../core/i18n/translation.service';
import type { Lang } from '../../../core/i18n/i18n.model';

/** Language toggle — shows the code of the OTHER language ("ع" / "EN") and
 * switches to its mirrored URL, preserving query/fragment, on click. */
@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageToggleComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly translation = inject(TranslationService);

  protected readonly otherLang = computed<Lang>(() => (this.languageService.lang() === 'en' ? 'ar' : 'en'));
  protected readonly code = computed(() => this.translation.translate('portfolio_lang_switch_code'));
  protected readonly ariaLabel = computed(() =>
    this.translation.translate('portfolio_lang_switch_aria', {
      lang: this.translation.translate('portfolio_lang_switch_native_label'),
    }),
  );

  switch(): void {
    this.languageService.switchTo(this.otherLang());
  }
}
