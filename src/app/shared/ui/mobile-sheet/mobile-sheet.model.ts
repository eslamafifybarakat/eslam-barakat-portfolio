import type { IconName } from '../icon/icon.model';

export interface SheetNavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: IconName;
  /** Fragment href, e.g. `#work`. */
  readonly href: string;
}
