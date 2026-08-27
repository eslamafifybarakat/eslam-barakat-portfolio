import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Defines every poster scene once as an SVG `<symbol>`; `ProjectPosterComponent`
 * instances reference them via `<use>`. Included exactly once, in
 * `AppComponent` — see `IconSpriteComponent` for why `[innerHTML]` on an SVG
 * element isn't an option here (it throws during server rendering).
 */
@Component({
  selector: 'app-poster-sprite',
  standalone: true,
  templateUrl: './poster-sprite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: none' },
})
export class PosterSpriteComponent {}
