import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, viewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * The project search field (`.search` in the reference). Exposes `focus()`
 * so a page-level `/` keyboard shortcut can jump to it from anywhere.
 */
@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  private readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  @Input() value = '';
  @Input({ required: true }) placeholder!: string;
  /** Accessible name for the input — falls back to `placeholder` when
   * omitted, but placeholder-only labeling disappears once the user types,
   * so callers should pass a dedicated label where one exists. */
  @Input() ariaLabel?: string;
  @Output() readonly valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  focus(): void {
    this.inputRef().nativeElement.focus();
  }
}
