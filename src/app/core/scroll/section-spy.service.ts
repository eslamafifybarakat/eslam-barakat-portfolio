import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollProgressService } from './scroll-progress.service';

/** The seven one-page sections, in document order — matches the nav and the
 * mobile sheet, and the reference's own `SECTIONS` list. */
export const SECTION_IDS = ['home', 'about', 'stack', 'path', 'work', 'learning', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

const ACTIVE_THRESHOLD = 0.35; // fraction of viewport height, matches the reference

/**
 * The currently active one-page section, recomputed from
 * `ScrollProgressService.scrollTop` — reuses that single shared scroll tick
 * rather than attaching its own listener.
 */
@Injectable({ providedIn: 'root' })
export class SectionSpyService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollProgress = inject(ScrollProgressService);

  readonly active = computed<SectionId>(() => {
    // establishes the reactive dependency; the pixel value itself is unused
    // below in favour of a fresh getBoundingClientRect() per section
    this.scrollProgress.scrollTop();

    if (!isPlatformBrowser(this.platformId)) return SECTION_IDS[0];

    const viewportHeight = this.document.defaultView?.innerHeight ?? 0;
    let current: SectionId = SECTION_IDS[0];

    for (const id of SECTION_IDS) {
      const el = this.document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= viewportHeight * ACTIVE_THRESHOLD) {
        current = id;
      }
    }

    return current;
  });
}
