export const environment = {
  production: false,
  // Same values as environment.ts today — kept as its own file (paired with
  // the "dev" build configuration / build:dev-api script) so a future
  // dev-only backend can diverge from the plain local environment.ts
  // without touching it.
  siteUrl: 'http://localhost:4200',
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
