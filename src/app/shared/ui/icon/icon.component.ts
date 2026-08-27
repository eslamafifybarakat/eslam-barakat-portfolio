import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { IconName } from './icon.model';

/**
 * `<app-icon name="external" />` — references a `<symbol>` defined once by
 * `IconSpriteComponent` via `<use>`. Set `directional` for icons whose
 * meaning flips under RTL (the "next" arrow); it applies the `i--dir`
 * modifier that mirrors with `scaleX(-1)`.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon' },
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() directional = false;
}
