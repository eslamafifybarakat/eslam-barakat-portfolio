import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import type { IconName } from '../icon/icon.model';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

/**
 * `<app-button variant="primary" icon="arrow">See the work</app-button>` —
 * renders as `<a>` when `href` is set, `<button>` otherwise. Label content
 * is projected so callers keep full control of translated text.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() icon?: IconName;
  @Input() iconPosition: 'start' | 'end' = 'end';
  @Input() href?: string;
  @Input() external = false;
  @Input() download?: string | boolean;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() ariaLabel?: string;
}
