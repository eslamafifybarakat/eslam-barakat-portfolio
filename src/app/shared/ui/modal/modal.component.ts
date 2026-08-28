import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  EventEmitter,
  HostListener,
  Input,
  Output,
  effect,
  inject,
} from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';

let instanceCounter = 0;

/**
 * A generic focus-trapped dialog shell (`.modal`/`.modal__box` in the
 * reference) — closes on `Esc` or a veil click, locks background scroll,
 * restores focus to the trigger on close (via `FocusTrapDirective`). The
 * work domain's project detail view fills the projected content.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconButtonComponent, FocusTrapDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly titleId = `modal-title-${instanceCounter++}`;

  @Input() open = false;
  @Output() readonly openChange = new EventEmitter<boolean>();
  @Input({ required: true }) closeLabel!: string;
  /** `3` (default) — correct for every current caller, which always nests
   * the modal under a page's `h1`/`h2`. Overridable so a future standalone
   * use (no heading ancestor) isn't stuck with an orphaned `h3`. */
  @Input() titleLevel: 2 | 3 = 3;

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.open ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }

  close(): void {
    this.openChange.emit(false);
  }
}
