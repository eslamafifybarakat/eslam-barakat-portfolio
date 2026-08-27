/** The 11 drawn vector scenes a project poster can render — assigned by
 * what the project actually is, not decoration. Each is defined once as an
 * SVG `<symbol id="scene-{name}">` in `PosterSpriteComponent` and
 * referenced here via `<use>`. */
export type PosterScene =
  | 'health'
  | 'agri'
  | 'dashboard'
  | 'erp'
  | 'payment'
  | 'library'
  | 'travel'
  | 'culture'
  | 'ai'
  | 'site'
  | 'tool';

/** project name → poster scene, ported verbatim from the reference's
 * `POSTER_OF` map — kept here so the mapping choice stays auditable against
 * the reference in one place; the work domain's data file re-derives it per
 * project via each project's own `posterScene` field. */
export const POSTER_OF: Record<string, PosterScene> = {
  'Reference Portal — Talbinah': 'health',
  'AGRO TEBA': 'agri',
  'Talbinah Website': 'health',
  Procurelinker: 'site',
  'Knowledge Bank (Tweeq)': 'library',
  'Medjol Patient (Availy)': 'health',
  'Medjol Provider Dashboard': 'dashboard',
  'QR Payment': 'payment',
  'Civil Services Management Dashboard': 'dashboard',
  'Jusur Dashboard': 'dashboard',
  'WRTH — Royal Institute of Traditional Arts': 'culture',
  'AMS Policies': 'payment',
  Hawdaj: 'travel',
  Mention: 'ai',
  Estkdam: 'site',
  'Gdawel ERP': 'erp',
  'Seaah Stakeholders': 'erp',
  'HashStudio — Digital Destination': 'site',
  'Swarm Technologies': 'site',
  'Social Studio': 'tool',
  'QIAS Dashboard': 'dashboard',
  'Eid Adha Card': 'tool',
  'Wakeb Tech Site': 'site',
  'Wakeb AI Chat': 'ai',
  'Nile Ortho': 'health',
  'NEN Site': 'site',
  'Sarie Site': 'site',
  'Qaraah Site': 'library',
  'Taba Educational Program': 'library',
  'Download Images': 'tool',
};
