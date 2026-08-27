import type { LocalizedText } from '../../../core/i18n/i18n.model';
import type { PosterScene } from '../../../shared/ui/project-poster/project-poster.model';

export type ProjectKind = 'ng' | 'js';

export interface Project {
  /** Deterministically derived from `name` via `slugify` — see the data
   * file. Public URL (`/work/:slug`); must never shift when the array is
   * reordered, which slugify-from-name naturally guarantees. */
  readonly slug: string;
  readonly name: string;
  readonly kind: ProjectKind;
  readonly flagship: boolean;
  readonly period: LocalizedText;
  readonly description: LocalizedText;
  /** `·`-joined in the reference; kept as a real array here. */
  readonly stack: readonly string[];
  readonly links: readonly string[];
  readonly note?: LocalizedText;
  /** Candidate screenshot filenames (relative to `/assets/shots/`) — not
   * verified here; the gallery probes them at render time and falls back
   * to the poster silently if a file is missing. */
  readonly shot?: string;
  readonly shots?: readonly string[];
  readonly posterScene: PosterScene;
}
