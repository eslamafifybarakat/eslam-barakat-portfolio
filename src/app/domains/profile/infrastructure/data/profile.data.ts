import type { Profile } from '../../domain/profile.model';

/** Ported verbatim from the reference's `ABOUT` and `PILLARS` arrays. */
const raw = {
  aboutParagraphs: [
    {
      en: '<p><strong>Senior Angular Frontend Developer</strong> with 5+ years of professional experience since June 2021, building and maintaining large-scale production web applications. I specialise in modern Angular architecture — <strong>Standalone Components, Signals, SSR / Angular Universal, RxJS</strong> and TypeScript — applied through <strong>Domain-Driven Design</strong> with facade, repository and store layers.</p>',
      ar: '<p><strong>مطوّر واجهات أمامية أول — Angular</strong> بخبرة تتجاوز خمس سنوات منذ يونيو 2021 في بناء تطبيقات ويب إنتاجية واسعة النطاق وصيانتها. تخصّصي في معمارية Angular الحديثة — <strong>Standalone Components و Signals و SSR / Angular Universal و RxJS</strong> و TypeScript — مطبَّقة عبر <strong>التصميم المُوجَّه بالنطاق (DDD)</strong> بطبقات facade و repository و store.</p>',
    },
    {
      en: '<p>Most of my work is bilingual <strong>Arabic/English (RTL/LTR)</strong>: healthcare and telehealth platforms, enterprise dashboards, ERP modules and corporate sites. That includes real-time chat and notifications on Socket.io and Pusher, <strong>live voice and video sessions via the Agora RTC SDK</strong>, and frontend integration of AI chat across text and voice.</p>',
      ar: '<p>معظم عملي ثنائي اللغة <strong>عربي/إنجليزي (RTL/LTR)</strong>: منصّات صحية واستشارات نفسية عن بُعد، ولوحات تحكّم مؤسسية، ووحدات ERP، ومواقع تعريفية. يشمل ذلك المحادثات والإشعارات الفورية عبر Socket.io و Pusher، و<strong>جلسات الصوت والفيديو المباشرة عبر Agora RTC SDK</strong>، وتكامل واجهات محادثات الذكاء الاصطناعي نصًّا وصوتًا.</p>',
    },
    {
      en: "<p>I've worked with Angular from <strong>16 through 21</strong> and keep adopting the latest releases. Beyond features I care about reusable component systems, SSR-correct SEO, Core Web Vitals and WCAG accessibility — the parts that decide whether a platform still works two years later.</p>",
      ar: '<p>عملت على Angular من الإصدار <strong>16 حتى 21</strong> وأواصل تبنّي الإصدارات الأحدث. وإلى جانب المزايا، يهمّني بناء مكوّنات قابلة لإعادة الاستخدام، وSEO سليم مع العرض من الخادم، ومؤشرات Core Web Vitals، وإمكانية الوصول وفق WCAG — وهي ما يحدّد إن كانت المنصّة ستبقى صالحة بعد عامين.</p>',
    },
  ],
  pillars: [
    {
      icon: 'layers',
      title: { en: 'Signals-first architecture', ar: 'معمارية تعتمد Signals أولًا' },
      description: {
        en: 'Facade, repository and store layers that keep feature domains independently testable.',
        ar: 'طبقات facade و repository و store تُبقي نطاقات المزايا قابلة للاختبار باستقلال.',
      },
    },
    {
      icon: 'wave',
      title: { en: 'Real-time voice and video', ar: 'صوت وفيديو فوري' },
      description: {
        en: 'Agora RTC SDK sessions: device permissions, lifecycle, connection recovery, in-session UI.',
        ar: 'جلسات Agora RTC SDK: أذونات الأجهزة ودورة الحياة واستعادة الاتصال وواجهة الجلسة.',
      },
    },
    {
      icon: 'mirror',
      title: { en: 'Bilingual by construction', ar: 'ثنائي اللغة من الأساس' },
      description: {
        en: 'RTL/LTR theming and i18n owned across a shared design system, not patched on at the end.',
        ar: 'إدارة التنسيق ثنائي الاتجاه والتعريب داخل نظام تصميم مشترك، لا كإضافة لاحقة.',
      },
    },
    {
      icon: 'seo',
      title: { en: 'SSR that search engines read', ar: 'عرض من الخادم تقرأه محرّكات البحث' },
      description: {
        en: 'Titles, canonicals, hreflang, Open Graph and JSON-LD rendered on the server, with sitemaps.',
        ar: 'العناوين والروابط المعيارية و hreflang و Open Graph و JSON-LD مُعروضة من الخادم، مع خرائط الموقع.',
      },
    },
  ],
  stats: {
    years: 5,
    yearsSuffix: '+',
    projects: 30,
    languages: 2,
  },
} satisfies Profile;

export const PROFILE: Profile = Object.freeze(raw);
