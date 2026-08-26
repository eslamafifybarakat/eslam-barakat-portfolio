import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The `EB` monogram (and, in `variant="full"`, the full wordmark lockup),
 * inlined as SVG so the header/footer never issue a network request or
 * flash while a logo asset swaps for theme — colors are CSS custom
 * properties (`--brand-frame`/`--brand-inner`/`--brand-wordmark`/
 * `--brand-subtitle`, see `styles/_themes.scss`) that flip instantly with
 * `data-theme`, ported geometrically from `reference/mark-*.svg` and
 * `reference/logo-*.svg`.
 */
@Component({
  selector: 'app-brand-lockup',
  standalone: true,
  templateUrl: './brand-lockup.component.html',
  styleUrl: './brand-lockup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLockupComponent {
  @Input() variant: 'mark' | 'full' = 'mark';
}
