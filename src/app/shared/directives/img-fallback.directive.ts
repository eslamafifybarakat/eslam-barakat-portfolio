import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

/**
 * `<img appImgFallback [src]="shot" ...>` — on load error, hides the image
 * (`display: none`) so a branded fallback element placed behind it (a
 * `ProjectPoster`, typically) shows through instead of a broken-image icon.
 * SSR-safe (it just adds a listener; nothing here touches `window`). The
 * broken state resets whenever `src` changes, so swapping to a new,
 * possibly-valid URL gets a fresh chance to load.
 */
@Directive({ selector: 'img[appImgFallback]' })
export class ImgFallbackDirective implements OnChanges {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly renderer = inject(Renderer2);

  @Input() src: string | null = null;

  private readonly broken = signal(false);

  @HostBinding('style.display') get display(): string | null {
    return this.broken() ? 'none' : null;
  }

  @HostListener('error')
  onError(): void {
    this.broken.set(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['src']) return;
    this.broken.set(false);
    if (this.src) {
      this.renderer.setProperty(this.el.nativeElement, 'src', this.src);
    }
  }
}
