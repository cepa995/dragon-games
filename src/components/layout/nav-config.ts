/**
 * Primary navigation targets. Hrefs are locale-prefixed automatically by the
 * next-intl `Link`. The target pages are built in later milestones (catalog M5,
 * tournaments/news M7, guides/contact M4), so these links 404 until then.
 */
export const NAV_ITEMS = [
  { key: 'catalog', href: '/catalog' },
  { key: 'tournaments', href: '/tournaments' },
  { key: 'news', href: '/news' },
  { key: 'guides', href: '/guides' },
  { key: 'contact', href: '/contact' },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['key'];
