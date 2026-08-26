export const environment = {
  production: true,
  // Single source of truth for the deployed origin — every canonical,
  // hreflang, OG url and sitemap entry derives from this one constant.
  // Swapping in a custom domain later is a one-line change.
  siteUrl: 'https://eslam-barakat-portfolio.vercel.app',
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
