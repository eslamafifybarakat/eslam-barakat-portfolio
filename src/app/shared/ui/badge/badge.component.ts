import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * `<app-badge [flagship]="true">Flagship</app-badge>` — the small
 * translucent, backdrop-blurred capsule overlaid on a project card's image
 * corner (`.cap`/`.cap--flag` in the reference). Positioned absolutely
 * against the nearest positioned ancestor, so its container needs
 * `position: relative`.
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  @Input() flagship = false;
}
