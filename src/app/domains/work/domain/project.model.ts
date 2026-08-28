import type { PosterScene } from '@shared/ui/project-poster/project-poster.model';
import type { SeoPayload } from '@core/seo/seo.model';

export type ProjectKind = 'ng' | 'js';

export interface Project {
  /** Deterministically derived from `name` via `slugify` — see the data
   * file. Public URL (`/work/:slug`); must never shift when the array is
   * reordered, which slugify-from-name naturally guarantees. */
  readonly slug: string;
  readonly name: string;
  readonly kind: ProjectKind;
  readonly flagship: boolean;
  readonly periodKey: string;
  readonly descriptionKey: string;
  /** `·`-joined in the reference; kept as a real array here. */
  readonly stack: readonly string[];
  readonly links: readonly string[];
  readonly noteKey?: string;
  /** Candidate screenshot filenames (relative to `/assets/shots/`) — not
   * verified here; the gallery probes them at render time and falls back
   * to the poster silently if a file is missing. */
  readonly shot?: string;
  readonly shots?: readonly string[];
  readonly posterScene: PosterScene;
  /** Per-project SEO override — absent for every project today;
   * `project-detail` falls back to a computed title/description from
   * `name`/`descriptionKey` when this is absent or `null`. */
  readonly seo?: SeoPayload | null;
}
