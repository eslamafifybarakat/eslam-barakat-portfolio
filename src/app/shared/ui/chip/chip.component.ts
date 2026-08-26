import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ChipVariant = 'default' | 'tag';

/**
 * `<app-chip>Angular</app-chip>` — the interactive skill/technology pill
 * (`.chip` in the reference). `variant="tag"` renders the smaller, static
 * mono-uppercase label used for a project card's kind badge (`.tag`).
 */
@Component({
  selector: 'app-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input() variant: ChipVariant = 'default';
}
