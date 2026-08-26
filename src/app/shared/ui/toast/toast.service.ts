import { Injectable, signal } from '@angular/core';

const AUTO_DISMISS_MS = 2200;

/** A single, app-wide toast — `role="status"` / `aria-live="polite"`,
 * auto-dismissing after ~2.2s. Used by the contact section's
 * copy-to-clipboard action. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _message = signal<string | null>(null);
  readonly message = this._message.asReadonly();

  private timeoutId?: ReturnType<typeof setTimeout>;

  show(message: string): void {
    this._message.set(message);
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this._message.set(null), AUTO_DISMISS_MS);
  }
}
