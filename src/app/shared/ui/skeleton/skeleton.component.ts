import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

export type SkeletonVariant = 'text' | 'card' | 'avatar' | 'image' | 'list';

/**
 * `<app-skeleton variant="card" />` — loading placeholders sized to the
 * design's real shapes and radii (never zero-height). `@defer` blocks below
 * the fold (experience/work/education/contact) show these as `@placeholder`.
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'presentation', 'aria-hidden': 'true' },
})
export class SkeletonComponent {
  private readonly _lines = signal(3);

  @Input() variant: SkeletonVariant = 'text';
  @Input() set lines(value: number) {
    this._lines.set(value);
  }

  protected readonly lineArray = computed(() => Array.from({ length: Math.max(1, this._lines()) }));
}
