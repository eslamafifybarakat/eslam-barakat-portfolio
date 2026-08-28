import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

/**
 * The `EB` monogram (and, in `variant="full"`, the full wordmark lockup),
 * inlined as SVG so the header/footer never issue a network request or
 * flash while a logo asset swaps for theme — colors are CSS custom
 * properties (`--brand-frame`/`--brand-inner`/`--brand-wordmark`/
 * `--brand-subtitle`, see `styles/_themes.scss`) that flip instantly with
 * `data-theme`, ported geometrically from `reference/mark-*.svg` and
 * `reference/logo-*.svg`.
 */
@Component({
  selector: 'app-brand-lockup',
  standalone: true,
  templateUrl: './brand-lockup.component.html',
  styleUrl: './brand-lockup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLockupComponent {
  private readonly translation = inject(TranslationService);

  @Input() variant: 'mark' | 'full' = 'mark';

  /** The name is a proper noun, kept literal in both languages — only the
   * role subtitle is translated. */
  protected readonly subtitle = computed(() => this.translation.translate('portfolio_shell_brand_subtitle'));
  protected readonly fullAriaLabel = computed(() => `Eslam Afify Barakat — ${this.subtitle()}`);
  protected readonly monogramTitle = computed(() => this.translation.translate('portfolio_brand_monogram_title'));
}
