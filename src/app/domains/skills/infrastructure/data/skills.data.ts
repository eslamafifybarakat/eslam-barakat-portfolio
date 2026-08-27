import type { SkillGroup } from '../../domain/skill-group.model';

/** Ported verbatim from the reference's `SKILLS` array (technology strings
 * split on ` · `, group labels bilingual). */
const raw = [
  {
    icon: 'code',
    label: { en: 'Languages & markup', ar: 'اللغات والترميز' },
    technologies: 'TypeScript · JavaScript (ES6+) · HTML5 · CSS3 · SCSS/SASS · jQuery (legacy)'.split(' · '),
  },
  {
    icon: 'layers',
    label: { en: 'Angular ecosystem', ar: 'منظومة Angular' },
    technologies:
      'Angular 16 / 19 / 20 / 21 · Standalone Components · Signals · RxJS · SSR / Angular Universal · typed route constants · Reactive Forms · Guards & Interceptors · Angular CDK · Angular Material · PrimeNG · ngx-translate · NgRx'.split(
        ' · ',
      ),
  },
  {
    icon: 'route',
    label: { en: 'Architecture & patterns', ar: 'المعمارية والأنماط' },
    technologies:
      'Domain-Driven Design · Facade · Repository · Store · reactive Signals state · feature-based modules · reusable component libraries · design systems · BEM · SOLID'.split(
        ' · ',
      ),
  },
  {
    icon: 'wave',
    label: { en: 'Real-time & integrations', ar: 'الفوري والتكاملات' },
    technologies:
      'Agora RTC SDK · Socket.io · Pusher · Firebase / AngularFire · REST APIs · AI chat integration (text & voice) · Google Maps'.split(
        ' · ',
      ),
  },
  {
    icon: 'mirror',
    label: { en: 'UI, styling & localization', ar: 'الواجهة والتنسيق والتعريب' },
    technologies:
      'Responsive Web Design · Tailwind CSS · Bootstrap 5 · custom design systems · RTL/LTR · i18n · Arabic–English interfaces'.split(
        ' · ',
      ),
  },
  {
    icon: 'gauge',
    label: { en: 'Quality & performance', ar: 'الجودة والأداء' },
    technologies:
      'Karma & Jasmine · Core Web Vitals (LCP, CLS, INP, FCP, TTFB) · technical SEO · semantic HTML · JSON-LD · sitemaps · WCAG · Lighthouse'.split(
        ' · ',
      ),
  },
  {
    icon: 'shield',
    label: { en: 'Tooling & delivery', ar: 'الأدوات والتسليم' },
    technologies:
      'Git · GitHub · Azure DevOps · Node.js / Express SSR · Vercel · Netlify · Agile / Scrum · code review · QA coordination'.split(
        ' · ',
      ),
  },
] satisfies SkillGroup[];

export const SKILL_GROUPS: readonly SkillGroup[] = Object.freeze(raw);
