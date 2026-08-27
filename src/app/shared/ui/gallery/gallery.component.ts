import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ImgFallbackDirective } from '../../directives/img-fallback.directive';

/**
 * The project modal's image gallery — main image + thumbnail strip, poster
 * first with screenshots appended once verified. Arrow-key navigation is
 * direction-aware: the key that means "next" flips under RTL. The caller
 * probes candidate screenshot URLs before passing them in as `images` (see
 * the `work` domain's gallery-probe use case) — an empty `images` array
 * means "poster only", projected via the `gallery-poster` slot, which also
 * sits behind the live image as its `ImgFallbackDirective` target should a
 * previously-verified URL ever fail to load later (a rare edge case, not
 * the primary existence check — that already happened during probing).
 */
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImgFallbackDirective],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private readonly document = inject(DOCUMENT);

  @Input() images: readonly string[] = [];
  @Input({ required: true }) alt!: string;
  @Input() index = 0;
  @Output() readonly indexChange = new EventEmitter<number>();
  @Input({ required: true }) captionScreenshot!: string;
  @Input({ required: true }) captionPoster!: string;

  select(i: number): void {
    this.indexChange.emit(i);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.images.length < 2) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const isRtl = this.document.documentElement.dir === 'rtl';
    const forward = event.key === 'ArrowRight' ? !isRtl : isRtl;
    const count = this.images.length;
    const next = forward ? (this.index + 1) % count : (this.index - 1 + count) % count;
    this.select(next);
  }
}
