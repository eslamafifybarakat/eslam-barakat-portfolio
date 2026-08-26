import { Directive, ElementRef, Injectable, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { prefersReducedMotion } from '../utils/reduced-motion';

const STAGGER_STEP_MS = 50;
const STAGGER_CAP = 6;

/** One shared `IntersectionObserver` for every `.rv` element on the page —
 * matches the reference's single-observer approach and its small stagger
 * for elements that intersect in the same batch. */
@Injectable({ providedIn: 'root' })
class RevealObserverRegistry {
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  observe(el: Element): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }

    this.observer ??= new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const delay = Math.min(index, STAGGER_CAP) * STAGGER_STEP_MS;
          setTimeout(() => entry.target.classList.add('in'), delay);
          this.observer?.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(el);
  }

  unobserve(el: Element): void {
    this.observer?.unobserve(el);
  }
}

/** Applies the `.rv` reveal-on-scroll treatment to the host element. Under
 * `prefers-reduced-motion` (or with no `IntersectionObserver` support, e.g.
 * during SSR) the element is revealed immediately instead. */
@Directive({ selector: '[appRevealOnScroll]' })
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly registry = inject(RevealObserverRegistry);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.classList.add('rv');

    if (!isPlatformBrowser(this.platformId) || prefersReducedMotion()) {
      host.classList.add('in');
      return;
    }
    this.registry.observe(host);
  }

  ngOnDestroy(): void {
    this.registry.unobserve(this.el.nativeElement);
  }
}
