import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ThemeService } from '../../../core/theme/theme.service';
import { TranslationService } from '../../../core/i18n/translation.service';

/** Keyboard-accessible theme toggle with a visible focus ring and an
 * accessible name that always describes the *next* state. */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './theme-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly translation = inject(TranslationService);

  protected readonly icon = computed(() => (this.themeService.theme() === 'dark' ? 'sun' : 'moon'));
  protected readonly ariaLabel = computed(() =>
    this.translation.translate(
      this.themeService.theme() === 'dark'
        ? 'portfolio_theme_switch_to_light'
        : 'portfolio_theme_switch_to_dark',
    ),
  );
}
