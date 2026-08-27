import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/**
 * The project card shell (`.card` in the reference) — a focusable,
 * `Enter`/`Space`-activatable article with named projection slots for its
 * media, name, period, description and footer. Content-agnostic; the work
 * domain's project card fills every slot.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() interactive = false;
  @Input() ariaLabel?: string;
  @Output() readonly activate = new EventEmitter<void>();

  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activate.emit();
    }
  }
}
