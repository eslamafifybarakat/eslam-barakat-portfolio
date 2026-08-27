import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Probes candidate screenshot URLs and resolves only the ones that
 * genuinely load — so a half-filled `assets/shots/` folder never produces
 * empty thumbnails or a caption claiming "Screenshot" over a drawn poster.
 * A no-op on the server (there's no Image() constructor there, and
 * prerendering shouldn't depend on which optional screenshots exist at
 * build time) — the gallery renders poster-only until this resolves
 * client-side.
 */
@Injectable({ providedIn: 'root' })
export class GalleryProbeService {
  private readonly platformId = inject(PLATFORM_ID);

  async probe(candidates: readonly string[]): Promise<string[]> {
    if (!isPlatformBrowser(this.platformId) || candidates.length === 0) return [];

    const results = await Promise.all(candidates.map((url) => this.checkImage(url)));
    return results.filter((url): url is string => url !== null);
  }

  private checkImage(url: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}
