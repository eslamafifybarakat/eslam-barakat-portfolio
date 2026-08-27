import type { EducationEntry } from '../../domain/education-entry.model';

/** Ported verbatim from the reference's `EDU` array. */
const raw = [
  {
    icon: 'cap',
    title: { en: 'B.Sc. in Computer Science', ar: 'بكالوريوس علوم الحاسب' },
    place: { en: 'Faculty of Computers & Information, Menoufia University', ar: 'كلية الحاسبات والمعلومات، جامعة المنوفية' },
    when: { en: 'August 2015 – July 2019', ar: 'أغسطس 2015 – يوليو 2019' },
  },
  {
    icon: 'doc',
    title: { en: 'Professional Diploma — MEARN Stack Web Development', ar: 'دبلوم مهني — تطوير الويب MEARN' },
    place: { en: 'Information Technology Institute (ITI), MCIT', ar: 'معهد تكنولوجيا المعلومات (ITI)، وزارة الاتصالات' },
    when: { en: 'April – July 2021 · 3 months', ar: 'أبريل – يوليو 2021 · 3 أشهر' },
  },
  {
    icon: 'globe',
    title: { en: 'Arabic — native / bilingual', ar: 'العربية — لغة أم' },
    place: { en: 'English — professional working proficiency', ar: 'الإنجليزية — إتقان مهني للعمل' },
    when: { en: 'Languages', ar: 'اللغات' },
  },
] satisfies EducationEntry[];

export const EDUCATION_ENTRIES: readonly EducationEntry[] = Object.freeze(raw);
