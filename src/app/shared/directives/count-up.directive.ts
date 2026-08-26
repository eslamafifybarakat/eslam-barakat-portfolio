import { Directive, ElementRef, Input, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IntersectionObserverDirective } from './intersection-observer.directive';
import { prefersReducedMotion } from '../utils/reduced-motion';

const STEPS = 26;

/**
 * `<b [appCountUp]="30">0</b>` — counts up to the target once the host
 * scrolls into view. Renders the final number immediately (no animation)
 * during SSR, under `prefers-reduced-motion`, and wherever
 * `IntersectionObserver` isn't available, rather than shipping a "0" that
 * only becomes correct after JS runs.
 */
@Directive({
  selector: '[appCountUp]',
  hostDirectives: [
    { directive: IntersectionObserverDirective, inputs: ['rootMargin'], outputs: ['appIntersect'] },
  ],
})
export class CountUpDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly intersection = inject(IntersectionObserverDirective);

  @Input({ required: true }) appCountUp!: number;
  @Input() suffix = '';

  ngOnInit(): void {
    this.intersection.appIntersect.subscribe((visible) => {
      if (!visible) return;
      if (!isPlatformBrowser(this.platformId) || prefersReducedMotion()) {
        this.render(this.appCountUp);
      } else {
        this.animate();
      }
    });
  }

  private animate(): void {
    const to = this.appCountUp;
    let n = 0;
    const step = (): void => {
      n += Math.max(1, Math.round(to / STEPS));
      if (n >= to) {
        this.render(to);
        return;
      }
      this.render(n);
      requestAnimationFrame(step);
    };
    step();
  }

  private render(n: number): void {
    this.el.nativeElement.textContent = `${n}${this.suffix}`;
  }
}
