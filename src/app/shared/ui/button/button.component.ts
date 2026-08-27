import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import type { IconName } from '../icon/icon.model';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

/**
 * `<app-button variant="primary" icon="arrow">See the work</app-button>` —
 * renders as `<a>` when `href` is set, `<button>` otherwise. Label content
 * is projected so callers keep full control of translated text.
 *
 * Uses `*ngIf`/`<ng-template>` rather than `@if`/`@else` here deliberately:
 * with the new control-flow blocks, an `<ng-content>` nested inside an
 * `@if`/`@else` branch alongside sibling `@if`s rendered empty in this
 * project's Angular version (verified against the SSR output — the
 * projected label text was silently dropped, which is a serious a11y bug
 * for an icon+label button). The older structural-directive form doesn't
 * have that problem, so it's the deliberate choice here — see README
 * "Decisions".
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IconComponent, NgIf, NgTemplateOutlet],
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
