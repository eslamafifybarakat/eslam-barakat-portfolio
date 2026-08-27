import type { Job } from '../../domain/job.model';

/** Ported verbatim from the reference's `JOBS` array, in chronological
 * (most-recent-first) order. */
const raw = [
  {
    company: 'Talbinah — تلبينة',
    when: { en: 'May 2025 – Present', ar: 'مايو 2025 – حتى الآن' },
    role: { en: 'Angular Frontend Developer', ar: 'مطوّر واجهات أمامية — Angular' },
    meta: { en: 'Remote · Saudi Arabia', ar: 'عن بُعد · السعودية' },
    site: 'https://talbinah.net/',
    bullets: {
      en: [
        'Deliver and maintain the <strong>Angular 19 SSR</strong> frontend of a bilingual Arabic/English <strong>telehealth</strong> platform: therapist booking, live sessions, assessments, subscriptions, community features and an internal operations dashboard.',
        'Engineered a <strong>Signals-first, Domain-Driven architecture</strong> with facade, repository and store layers, isolating UI from data access and keeping feature domains independently testable.',
        'Integrated the <strong>Agora RTC SDK</strong> for <strong>live voice and video therapy sessions</strong> — device permissions, session lifecycle, connection-state recovery, in-session UI states.',
        'Built the frontend for <strong>AI-assisted chat and AI companion experiences</strong> across text and voice, alongside real-time chat and notifications on <strong>Socket.io</strong> and <strong>Pusher</strong>.',
        'Built an <strong>SSR-correct SEO layer</strong> — titles, canonicals, hreflang, Open Graph, JSON-LD — with sitemap generation, and optimised <strong>Core Web Vitals</strong> across the public platform.',
        'Own RTL/LTR theming, i18n and <strong>WCAG accessibility</strong> across the shared design system, and coordinate QA readiness and weekly delivery reporting against <strong>Azure DevOps</strong> work items.',
      ],
      ar: [
        'أطوّر وأصون واجهة <strong>Angular 19 مع SSR</strong> لمنصّة <strong>صحة نفسية عن بُعد</strong> ثنائية اللغة: حجز المعالجين والجلسات المباشرة والمقاييس والاشتراكات ومزايا المجتمع ولوحة تشغيل داخلية.',
        'هندست <strong>معمارية تعتمد Signals والتصميم المُوجَّه بالنطاق</strong> بطبقات facade و repository و store، تفصل الواجهة عن الوصول للبيانات وتُبقي النطاقات قابلة للاختبار باستقلال.',
        'دمجت <strong>Agora RTC SDK</strong> لتوفير <strong>جلسات صوت وفيديو علاجية مباشرة</strong> — أذونات الأجهزة، ودورة حياة الجلسة، واستعادة حالة الاتصال، وحالات الواجهة داخل الجلسة.',
        'بنيت واجهة <strong>محادثات مدعومة بالذكاء الاصطناعي ورفيق ذكي</strong> نصًّا وصوتًا، مع محادثات وإشعارات فورية عبر <strong>Socket.io</strong> و<strong>Pusher</strong>.',
        'بنيت <strong>طبقة SEO سليمة مع العرض من الخادم</strong> — العناوين والروابط المعيارية و hreflang و Open Graph و JSON-LD — مع توليد خرائط الموقع، وحسّنت <strong>Core Web Vitals</strong>.',
        'أتولّى التنسيق ثنائي الاتجاه والتعريب و<strong>إمكانية الوصول وفق WCAG</strong> في نظام التصميم المشترك، وأنسّق جاهزية الاختبار والتقارير الأسبوعية على <strong>Azure DevOps</strong>.',
      ],
    },
  },
  {
    company: 'AppzLabz',
    when: { en: 'April 2023 – April 2025', ar: 'أبريل 2023 – أبريل 2025' },
    role: { en: 'Angular Frontend Developer', ar: 'مطوّر واجهات أمامية — Angular' },
    meta: { en: 'Remote', ar: 'عن بُعد' },
    bullets: {
      en: [
        'Developed and maintained multiple <strong>Angular SSR</strong> applications, dashboards and corporate platforms for Saudi and regional clients across healthcare booking, payments, education finance, government/CMS and traditional-arts sectors.',
        'Built <strong>reusable, themeable component libraries</strong> on PrimeNG, Angular Material and Angular CDK, cutting duplicated UI work and standardising form, table and modal patterns.',
        'Implemented reactive data flows with <strong>RxJS</strong> and <strong>NgRx</strong> for data-heavy dashboards, including role-based access, route guards, HTTP interceptors and authentication.',
        'Delivered SSR and technical SEO improvements for public-facing product and marketing sites, and implemented full <strong>RTL/LTR and Arabic/English localisation</strong>.',
        'Integrated REST APIs, payment flows, Google Maps and file/media handling; wrote unit tests with <strong>Jasmine</strong> and <strong>Karma</strong> in Agile teams.',
      ],
      ar: [
        'طوّرت وصنت عدّة تطبيقات <strong>Angular مع SSR</strong> ولوحات تحكّم ومنصّات مؤسسية لعملاء سعوديين وإقليميين في الحجز الصحي والمدفوعات وتمويل التعليم والقطاع الحكومي وإدارة المحتوى والفنون التراثية.',
        'بنيت <strong>مكتبات مكوّنات قابلة لإعادة الاستخدام والتنسيق</strong> على PrimeNG و Angular Material و Angular CDK، ما قلّل تكرار العمل ووحّد أنماط النماذج والجداول والنوافذ.',
        'نفّذت تدفّقات بيانات تفاعلية بـ <strong>RxJS</strong> و<strong>NgRx</strong> للوحات كثيفة البيانات، مع صلاحيات حسب الدور وحُرّاس المسارات ومعترضات HTTP والمصادقة.',
        'سلّمت تحسينات العرض من الخادم و SEO التقني للمواقع العامة، ونفّذت <strong>التعريب الكامل ثنائي الاتجاه</strong> عربي/إنجليزي.',
        'دمجت واجهات REST ومسارات الدفع وخرائط Google ومعالجة الملفات والوسائط، وكتبت اختبارات وحدة بـ <strong>Jasmine</strong> و<strong>Karma</strong> داخل فرق Agile.',
      ],
    },
  },
  {
    company: 'Hashstudio Inc.',
    when: { en: 'June 2021 – March 2023', ar: 'يونيو 2021 – مارس 2023' },
    role: { en: 'Angular Frontend Developer', ar: 'مطوّر واجهات أمامية — Angular' },
    meta: { en: 'Shebin El-Kom, Menoufia, Egypt', ar: 'شبين الكوم، المنوفية، مصر' },
    site: 'https://hashstudio.dev/',
    bullets: {
      en: [
        'Built Angular applications from design handoff through production release, including <strong>ERP modules</strong> (accounting, sales, customers, employees, Zakat/Tax compliance) and a large-scale <strong>digital library platform</strong>.',
        'Implemented complex data-entry, tabular and editor-driven interfaces using <strong>Angular Material</strong>, <strong>PrimeNG</strong>, <strong>NgRx</strong>, Froala Editor and Pusher-based updates.',
        'Developed responsive, cross-browser interfaces with SCSS and Bootstrap 5, and contributed to corporate site delivery with Angular SSR and SEO fundamentals.',
      ],
      ar: [
        'بنيت تطبيقات Angular من تسليم التصميم حتى الإصدار الإنتاجي، منها <strong>وحدات ERP</strong> (الحسابات والمبيعات والعملاء والموظفون والامتثال للزكاة والضريبة) و<strong>منصّة مكتبة رقمية</strong> واسعة النطاق.',
        'نفّذت واجهات معقّدة لإدخال البيانات والجداول والمحرّرات باستخدام <strong>Angular Material</strong> و<strong>PrimeNG</strong> و<strong>NgRx</strong> و Froala Editor وتحديثات Pusher.',
        'طوّرت واجهات متجاوبة متوافقة مع المتصفّحات بـ SCSS و Bootstrap 5، وشاركت في تسليم مواقع تعريفية بأساسيات SSR و SEO.',
      ],
    },
  },
] satisfies Job[];

export const JOBS: readonly Job[] = Object.freeze(raw);
