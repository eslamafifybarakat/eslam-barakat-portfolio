import { isPlatformBrowser } from '@angular/common';
import { parseCookies, serializeCookie } from './cookie.util';

interface CookieReadContext {
  readonly platformId: object;
  readonly document: Document;
  readonly request?: Request | null;
}

interface CookieWriteContext {
  readonly platformId: object;
  readonly document: Document;
}

/**
 * Reads one cookie: on the server from the incoming `Request` (available via
 * Angular's `REQUEST` token whenever a live SSR request is actually being
 * handled — most routes here are prerendered at build time and have none),
 * on the browser from `document.cookie`. Takes its context explicitly
 * (rather than calling `inject()` itself) so it can be called from anywhere,
 * not just an active injection context.
 */
export function readCookieFrom(name: string, ctx: CookieReadContext): string | null {
  if (isPlatformBrowser(ctx.platformId)) {
    return parseCookies(ctx.document.cookie)[name] ?? null;
  }
  return parseCookies(ctx.request?.headers.get('cookie'))[name] ?? null;
}

/** Writes one cookie. No-ops on the server (there is no response to attach
 * a Set-Cookie header to for a prerendered/static route). */
export function writeCookieTo(name: string, value: string, ctx: CookieWriteContext): void {
  if (!isPlatformBrowser(ctx.platformId)) return;
  ctx.document.cookie = serializeCookie(name, value);
}
