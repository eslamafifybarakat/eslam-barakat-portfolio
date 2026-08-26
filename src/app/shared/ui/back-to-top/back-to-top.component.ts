import { ChangeDetectionStrategy, Component, DOCUMENT, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ScrollProgressService } from '../../../core/scroll/scroll-progress.service';
import { TranslationService } from '../../../core/i18n/translation.service';
import { prefersReducedMotion } from '../../utils/reduced-motion';

const APPEAR_AFTER_PX = 600;

/** Appears past 600px of scroll; scrolls smoothly back to the top (instant
 * under `prefers-reduced-motion`). */
@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollProgress = inject(ScrollProgressService);
  private readonly translation = inject(TranslationService);

  protected readonly visible = computed(() => this.scrollProgress.scrollTop() > APPEAR_AFTER_PX);
  protected readonly ariaLabel = computed(() => this.translation.translate('portfolio_back_to_top'));

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}
