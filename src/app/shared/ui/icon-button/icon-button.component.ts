import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import type { IconName } from '../icon/icon.model';

/**
 * `<app-icon-button icon="menu" ariaLabel="Menu" />` — the circular chrome
 * control used for the theme/language toggles, the burger, back-to-top and
 * the modal/sheet close buttons. When `icon` is omitted, projected content
 * is used instead (the language toggle shows a text code, not an icon).
 */
@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() icon?: IconName;
  @Input({ required: true }) ariaLabel!: string;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() expanded?: boolean;
}
