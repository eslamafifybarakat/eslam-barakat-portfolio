import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * The single passive scroll/resize listener for the whole app, rAF-throttled.
 * `ScrollProgressService` owns it; `SectionSpyService` reads `scrollTop` off
 * it rather than attaching a second listener — the brief is explicit that
 * this must be one rAF-driven handler, not one per feature.
 */
@Injectable({ providedIn: 'root' })
export class ScrollProgressService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private rafPending = false;

  /** 0–100, the page's scroll progress. */
  readonly progress = signal(0);
  /** Raw `scrollingElement.scrollTop`, in pixels — the shared tick other
   * scroll-driven features (section-spy, back-to-top) key off. */
  readonly scrollTop = signal(0);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.measure();
    this.document.defaultView?.addEventListener('scroll', this.onScroll, { passive: true });
    this.document.defaultView?.addEventListener('resize', this.onScroll, { passive: true });
  }

  private readonly onScroll = (): void => {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.measure();
    });
  };

  private measure(): void {
    const el = this.document.scrollingElement ?? this.document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    this.scrollTop.set(el.scrollTop);
    this.progress.set(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
  }
}
