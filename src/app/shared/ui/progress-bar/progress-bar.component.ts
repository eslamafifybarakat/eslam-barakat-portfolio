import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollProgressService } from '../../../core/scroll/scroll-progress.service';

/** The fixed 2px scroll-progress bar, `--accent` → `--cta`, direction-aware
 * via the global `--flow` custom property. */
@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  protected readonly scrollProgress = inject(ScrollProgressService);
}
