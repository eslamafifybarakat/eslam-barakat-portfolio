import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { PosterScene } from './project-poster.model';

let instanceCounter = 0;

/**
 * The drawn vector fallback rendered for every project card — a dot field,
 * two radial washes, a scene matched to what the project actually is
 * (referenced via `<use>` against `PosterSpriteComponent`'s `<symbol>`
 * defs), and the host domain in monospace. Theme-reactive via CSS custom
 * properties; this is also `ImgFallbackDirective`'s fallback target when a
 * screenshot fails to load.
 */
@Component({
  selector: 'app-project-poster',
  standalone: true,
  templateUrl: './project-poster.component.html',
  styleUrl: './project-poster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPosterComponent {
  private readonly instanceId = `pp${instanceCounter++}`;

  private readonly _scene = signal<PosterScene>('site');
  @Input({ required: true })
  set scene(value: PosterScene) {
    this._scene.set(value);
  }
  get scene(): PosterScene {
    return this._scene();
  }

  @Input({ required: true }) projectName!: string;
  @Input({ required: true }) hostLabel!: string;

  protected readonly sceneHref = computed(() => `#scene-${this._scene()}`);
  protected readonly ids = {
    grid: `${this.instanceId}-pg`,
    washA: `${this.instanceId}-w1`,
    washB: `${this.instanceId}-w2`,
  };
}
