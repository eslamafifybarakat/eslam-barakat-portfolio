import type { ApiResponse } from './api-response.model';

/** Unwraps an `ApiResponse<T>`, throwing on `status: false` — the single
 * seam every domain data loader reads through, whether `response` came
 * from a static JSON import (today) or a resolved HTTP call (later). */
export function readApiResponse<T>(response: ApiResponse<T>, source: string): T {
  if (!response.status) {
    throw new Error(`[${source}] data response status is false: ${response.message ?? 'no message'}`);
  }
  return response.data;
}
