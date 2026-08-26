/** SSR-safe, point-in-time check of `prefers-reduced-motion: reduce`.
 * Directives that drive JS-level animation (count-up, reveal-on-scroll,
 * smooth-scroll, the directional hover nudge) read this once on init —
 * CSS itself already handles the blanket `animation-duration: .001s`
 * override for everything else, see `styles/index.scss`. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
