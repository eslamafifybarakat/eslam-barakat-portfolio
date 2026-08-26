import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

/** Emits `appClickOutside` when a click lands outside the host element. */
@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Output() readonly appClickOutside = new EventEmitter<Event>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as Node | null;
    if (target && !this.el.nativeElement.contains(target)) {
      this.appClickOutside.emit(event);
    }
  }
}
