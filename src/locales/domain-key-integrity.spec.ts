import en from './en.json';
import ar from './ar.json';
import { PROFILE } from '../app/domains/profile/infrastructure/data/profile.data';
import { SKILL_GROUPS } from '../app/domains/skills/infrastructure/data/skills.data';
import { JOBS } from '../app/domains/experience/infrastructure/data/experience.data';
import { EDUCATION_ENTRIES } from '../app/domains/education/infrastructure/data/education.data';
import { PROJECTS } from '../app/domains/work/infrastructure/data/work.data';

/** Every domain data file now stores translation keys instead of literal
 * text (see profile/skills/experience/education/work `infrastructure/data`).
 * A typo in one of those keys wouldn't fail a build or `locale-parity.spec`
 * (a missing key just falls back to rendering the key itself — see
 * `TranslationService.translate`) — this test is the safety net that
 * catches it. */
function collectDomainKeys(): readonly string[] {
  return [
    ...PROFILE.aboutParagraphKeys,
    ...PROFILE.pillars.flatMap((p) => [p.titleKey, p.descriptionKey]),
    ...SKILL_GROUPS.map((g) => g.labelKey),
    ...JOBS.flatMap((job) => [job.whenKey, job.roleKey, job.metaKey, ...job.bulletKeys]),
    ...EDUCATION_ENTRIES.flatMap((entry) => [entry.titleKey, entry.placeKey, entry.whenKey]),
    ...PROJECTS.flatMap((project) => [
      project.periodKey,
      project.descriptionKey,
      ...(project.noteKey ? [project.noteKey] : []),
    ]),
  ];
}

describe('domain data key integrity', () => {
  it('every *Key/*Keys field across domain data resolves in both en.json and ar.json', () => {
    const keys = collectDomainKeys();
    expect(keys.length).toBeGreaterThan(0);

    const enCatalog = en as Record<string, string>;
    const arCatalog = ar as Record<string, string>;

    for (const key of keys) {
      expect(enCatalog[key], `en.json is missing key "${key}"`).toBeTruthy();
      expect(arCatalog[key], `ar.json is missing key "${key}"`).toBeTruthy();
    }
  });
});
