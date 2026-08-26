import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { ICON_PATHS, IconName } from './icon.model';

/**
 * `<app-icon name="external" />` — the single 24×24 inline-SVG icon set.
 * Set `directional` for icons whose meaning flips under RTL (the "next"
 * arrow); it applies the `i--dir` modifier that `styles/_mixins.scss`'s
 * consumers mirror with `scaleX(-1)`.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon' },
})
export class IconComponent {
  private readonly _name = signal<IconName>('arrow');

  @Input({ required: true })
  set name(value: IconName) {
    this._name.set(value);
  }
  get name(): IconName {
    return this._name();
  }

  @Input() directional = false;

  readonly markup = computed(() => ICON_PATHS[this._name()]);
}
