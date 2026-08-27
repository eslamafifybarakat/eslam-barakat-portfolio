import { ChangeDetectionStrategy, Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { BrandLockupComponent } from '../../shared/ui/brand-lockup/brand-lockup.component';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [BrandLockupComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly translation = inject(TranslationService);

  // Every route is prerendered at build time, so this starts as whatever
  // year the build ran in — corrected to the visitor's actual current year
  // immediately on hydration, so the copyright line can't go stale between
  // deploys.
  protected readonly year = signal(new Date().getFullYear());
  protected readonly builtBy = computed(() => this.translation.translate('portfolio_footer_built_by'));

  constructor() {
    afterNextRender(() => this.year.set(new Date().getFullYear()));
  }
}
