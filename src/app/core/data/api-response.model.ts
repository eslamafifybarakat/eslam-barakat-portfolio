/** Envelope every domain data source is read through — mirrors the shape a
 * real backend endpoint would return, so swapping a static JSON import for
 * an HTTP call later changes only the read call, not this type or any
 * consumer of it. */
export interface ApiResponse<T> {
  readonly status: boolean;
  readonly message: string | null;
  readonly data: T;
}
