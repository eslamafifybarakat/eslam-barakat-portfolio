import { Directive, EventEmitter, HostListener, Input, Output, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * `<a [appCopyToClipboard]="email" (copied)="toast()" href="mailto:...">` —
 * copies `text` to the clipboard on click and emits `copied`. Only
 * intercepts the click (via `preventDefault`) when `text` is non-empty and
 * the Clipboard API is actually available; otherwise the host's default
 * action (e.g. the `mailto:` navigation) proceeds untouched — this also
 * makes the directive a safe no-op when applied unconditionally across a
 * list where only some rows should copy (an empty binding just falls
 * through to normal navigation).
 */
@Directive({ selector: '[appCopyToClipboard]' })
export class CopyToClipboardDirective {
  private readonly platformId = inject(PLATFORM_ID);

  @Input('appCopyToClipboard') text = '';
  @Output() readonly copied = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  async onClick(event: Event): Promise<void> {
    if (!this.text || !isPlatformBrowser(this.platformId) || !navigator.clipboard) return;

    event.preventDefault();
    try {
      await navigator.clipboard.writeText(this.text);
      this.copied.emit();
    } catch {
      // clipboard write denied (permissions) — default action was already
      // prevented, which is an acceptable degradation for a rare failure
    }
  }
}
