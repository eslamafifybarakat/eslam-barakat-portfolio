import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
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
  imports: [IconComponent, NgTemplateOutlet],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() icon?: IconName;
  @Input({ required: true }) ariaLabel!: string;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() expanded?: boolean;
  /** When set, renders as a real `<a>` instead of a `<button>` — for
   * controls that are genuinely a link to another URL (e.g. the language
   * toggle), so they're crawlable, openable in a new tab and work with JS
   * disabled, while callers still handle `(click)` for SPA navigation. */
  @Input() href?: string;
  @Input() hreflang?: string;
}
