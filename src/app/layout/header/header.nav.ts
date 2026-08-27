import type { IconName } from '../../shared/ui/icon/icon.model';
import { SECTION_IDS, SectionId } from '../../core/scroll/section-spy.service';

interface NavMeta {
  readonly id: SectionId;
  readonly icon: IconName;
  readonly translationKey: string;
}

const NAV_ICONS: Record<SectionId, IconName> = {
  home: 'up',
  about: 'layers',
  stack: 'code',
  path: 'route',
  work: 'grid',
  learning: 'cap',
  contact: 'mail',
};

/** id → icon + translation key, in document order — drives both the
 * desktop nav and the mobile sheet from one source. */
export const NAV_META: readonly NavMeta[] = SECTION_IDS.map((id) => ({
  id,
  icon: NAV_ICONS[id],
  translationKey: `portfolio_nav_${id}`,
}));
