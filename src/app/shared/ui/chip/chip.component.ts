import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';

export type ChipVariant = 'default' | 'tag';

/**
 * `<app-chip>Angular</app-chip>` — the interactive skill/technology pill
 * (`.chip` in the reference). `variant="tag"` renders the smaller, static
 * mono-uppercase label used for a project card's kind badge (`.tag`).
 *
 * Uses `*ngIf`/`ngTemplateOutlet` with a single shared `<ng-content>`
 * rather than `@if`/`@else`, each with its own — see
 * `button.component.ts` for why that pattern silently drops projected
 * content in this project's Angular version.
 */
@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input() variant: ChipVariant = 'default';
}
