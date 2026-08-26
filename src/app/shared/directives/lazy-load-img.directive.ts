import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const REVEAL_TIMEOUT_MS = 4000;

/**
 * `<img appLazyLoadImg [src]="shot.url" ...>` — below-the-fold image
 * loading: native `loading="lazy"` + `decoding="async"`, a fade-in once the
 * image actually loads, and a hard ~4s timeout that reveals it regardless
 * (a slow/blocked request never leaves the image invisible forever).
 * **Never** apply this to the LCP/hero image.
 */
@Directive({ selector: 'img[appLazyLoadImg]' })
export class LazyLoadImgDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private timeoutId?: ReturnType<typeof setTimeout>;
  // A signal, not a plain field: this can flip from a raw setTimeout
  // callback, outside any Angular-tracked event — only a signal write is
  // guaranteed to schedule the re-render in a zoneless app.
  private readonly loaded = signal(false);

  @HostBinding('attr.loading') readonly loading = 'lazy';
  @HostBinding('attr.decoding') readonly decoding = 'async';
  @HostBinding('style.transition') readonly transition = 'opacity .4s ease';
  @HostBinding('style.opacity') get opacity(): number {
    return this.loaded() ? 1 : 0;
  }

  @HostListener('load')
  onLoad(): void {
    this.reveal();
  }

  @HostListener('error')
  onError(): void {
    // ImgFallbackDirective (if present) handles hiding the broken image;
    // this directive's only job is to not leave it permanently invisible.
    this.reveal();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const img = this.el.nativeElement;
    if (img.complete && img.naturalWidth > 0) {
      this.reveal();
      return;
    }
    this.timeoutId = setTimeout(() => this.reveal(), REVEAL_TIMEOUT_MS);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  private reveal(): void {
    this.loaded.set(true);
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
