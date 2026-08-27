export type WorkFilterKey = 'all' | 'ng' | 'js' | 'feat';

export const WORK_FILTER_KEYS: readonly WorkFilterKey[] = ['all', 'ng', 'js', 'feat'];

export function isWorkFilterKey(value: string | null | undefined): value is WorkFilterKey {
  return value === 'all' || value === 'ng' || value === 'js' || value === 'feat';
}
