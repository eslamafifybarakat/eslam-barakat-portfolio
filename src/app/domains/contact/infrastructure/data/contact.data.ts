import type { ContactRow } from '../../domain/contact-row.model';

/** Ported verbatim from the reference's `CONTACT` array. Values mirror
 * `environment.contact` — kept as static presentation data here (row order,
 * icon, label key, ltr/copy flags) rather than derived, since the Maps
 * place link and row metadata aren't part of the generic contact-channel
 * config other call sites (JSON-LD, footer) might reuse. */
const raw = [
  {
    labelKey: 'portfolio_contact_location_label',
    value: 'Cairo, Egypt',
    href: 'https://www.google.com/maps/place/Cairo,+Egypt',
    icon: 'pin',
  },
  {
    labelKey: 'portfolio_contact_phone_label',
    value: '+20 101 622 1599',
    href: 'tel:+201016221599',
    icon: 'phone',
    ltr: true,
  },
  {
    labelKey: 'portfolio_contact_whatsapp_label',
    value: '+20 101 622 1599',
    href: 'https://wa.me/201016221599',
    icon: 'whatsapp',
    ltr: true,
  },
  {
    labelKey: 'portfolio_contact_email_label',
    value: 'eslamafifybarakat@gmail.com',
    href: 'mailto:eslamafifybarakat@gmail.com',
    icon: 'mail',
    copy: true,
    ltr: true,
  },
  {
    labelKey: 'portfolio_contact_linkedin_label',
    value: 'linkedin.com/in/eslam-afify-barakat-3a1396142',
    href: 'https://www.linkedin.com/in/eslam-afify-barakat-3a1396142',
    icon: 'linkedin',
    ltr: true,
  },
  {
    labelKey: 'portfolio_contact_github_label',
    value: 'github.com/eslamafifybarakat',
    href: 'https://github.com/eslamafifybarakat',
    icon: 'github',
    ltr: true,
  },
] satisfies ContactRow[];

export const CONTACT_ROWS: readonly ContactRow[] = Object.freeze(raw);
