import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Generic `IntersectionObserver` primitive: emits `appIntersect` when the
 * host crosses into (and, unless `once`, out of) view. Browsers without
 * `IntersectionObserver` — or SSR, where it doesn't exist at all — fall
 * back to reporting "visible" immediately rather than never firing.
 */
@Directive({ selector: '[appIntersectionObserver]' })
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  @Input() threshold = 0;
  @Input() rootMargin = '0px 0px -8% 0px';
  @Input() once = true;
  @Output() readonly appIntersect = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      this.appIntersect.emit(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.appIntersect.emit(true);
            if (this.once) this.observer?.unobserve(entry.target);
          } else if (!this.once) {
            this.appIntersect.emit(false);
          }
        }
      },
      { threshold: this.threshold, rootMargin: this.rootMargin },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
