export const environment = {
  production: false,
  // Overridden per-deployment by a Vercel Preview env var in real use;
  // this is the fallback when a preview build has none set.
  siteUrl: 'https://eslam-barakat-portfolio-staging.vercel.app',
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
