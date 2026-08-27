import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, viewChildren } from '@angular/core';
import type { TabItem } from './tabs.model';

/**
 * An accessible WAI-ARIA tab strip — `role="tablist"`, roving `Left`/`Right`
 * (direction-aware) arrow-key navigation between tabs. Renders only the
 * strip; the consumer owns the panels (typically toggled via `@if` on the
 * active key), each with `role="tabpanel"` and a matching `aria-labelledby`.
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  private readonly tabEls = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  @Input({ required: true }) tabs!: readonly TabItem[];
  @Input({ required: true }) active!: string;
  @Input() idPrefix = 'tabs';
  @Output() readonly activeChange = new EventEmitter<string>();

  select(key: string): void {
    if (key !== this.active) this.activeChange.emit(key);
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();

    const isRtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl';
    const forward = event.key === 'ArrowRight' ? !isRtl : isRtl;
    const count = this.tabs.length;
    const nextIndex = forward ? (index + 1) % count : (index - 1 + count) % count;

    this.select(this.tabs[nextIndex].key);
    this.tabEls()[nextIndex]?.nativeElement.focus();
  }
}
