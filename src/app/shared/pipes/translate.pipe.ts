/** Re-exported so presentation-layer code can import every template pipe
 * from `shared/pipes` in one place, without reaching into `core/i18n`
 * directly for this one. The pipe itself is owned by `core/i18n` — see
 * `core/i18n/translate.pipe.ts`. */
export { TranslatePipe } from '@core/i18n/translate.pipe';
