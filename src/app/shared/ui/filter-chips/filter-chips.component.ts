import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { FilterOption } from './filter-chips.model';

/** The project filter row (`.filters`/`.fchip` in the reference) — a
 * single-select group of pill buttons. */
@Component({
  selector: 'app-filter-chips',
  standalone: true,
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  @Input({ required: true }) options!: readonly FilterOption[];
  @Input({ required: true }) active!: string;
  @Input() ariaLabel?: string;
  @Output() readonly activeChange = new EventEmitter<string>();

  select(key: string): void {
    if (key !== this.active) this.activeChange.emit(key);
  }
}
