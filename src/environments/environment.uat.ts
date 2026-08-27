export const environment = {
  production: false,
  // Same shape as environment.staging.ts, with its own Vercel preview URL
  // so a "uat" branch deploy gets a stable link distinct from staging.
  siteUrl: 'https://eslam-barakat-portfolio-uat.vercel.app',
  defaultLanguage: 'en' as const,
  cvFileName: 'Eslam_Afify_Barakat_Senior_Angular_Frontend_Developer_CV.pdf',
  contact: {
    email: 'eslamafifybarakat@gmail.com',
    phone: '+201016221599',
    whatsapp: 'https://wa.me/201016221599',
    linkedin: 'https://www.linkedin.com/in/eslam-afify-barakat-3a1396142',
    github: 'https://github.com/eslamafifybarakat',
    location: 'Cairo, Egypt',
  },
};
