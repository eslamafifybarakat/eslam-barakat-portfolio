import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Defines every icon once as an SVG `<symbol>`; `IconComponent` instances
 * reference them via `<use>`. Included exactly once, in `AppComponent`.
 *
 * This exists because `[innerHTML]` on an `<svg>`/`<g>` element throws
 * during server rendering (`@angular/platform-server`'s DOM implementation
 * doesn't support `innerHTML` on SVG nodes) — `<use href>` is a plain
 * attribute reference, so it works identically on the server and browser.
 */
@Component({
  selector: 'app-icon-sprite',
  standalone: true,
  templateUrl: './icon-sprite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: none' },
})
export class IconSpriteComponent {}
