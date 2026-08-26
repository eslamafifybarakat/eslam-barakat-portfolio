import {
  DOCUMENT,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * `[appFocusTrap]="isOpen"` — while active, confines Tab/Shift+Tab to the
 * host's focusable descendants, focuses the first one on activation, and
 * restores focus to whatever was focused before on deactivation. Used by
 * the project modal and the mobile sheet.
 */
@Directive({ selector: '[appFocusTrap]' })
export class FocusTrapDirective implements OnChanges, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private lastFocused: HTMLElement | null = null;

  @Input('appFocusTrap') active = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['active']) return;
    if (this.active) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  ngOnDestroy(): void {
    if (this.active) this.deactivate();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.active || event.key !== 'Tab') return;
    const focusable = this.getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private activate(): void {
    this.lastFocused = this.document.activeElement as HTMLElement | null;
    queueMicrotask(() => this.getFocusable()[0]?.focus());
  }

  private deactivate(): void {
    this.lastFocused?.focus?.();
    this.lastFocused = null;
  }

  private getFocusable(): HTMLElement[] {
    const nodeList = this.el.nativeElement.querySelectorAll(FOCUSABLE_SELECTOR);
    return Array.from(nodeList) as HTMLElement[];
  }
}
