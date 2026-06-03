import { useTranslations } from 'next-intl';

/**
 * Skip-to-content link (NFR-4.6 / WCAG 2.2). Visually hidden until focused, then
 * jumps keyboard users past the header to the main content.
 */
export function SkipLink() {
  const t = useTranslations('actions');
  return (
    <a
      href="#main-content"
      className="rounded-card bg-primary text-primary-foreground sr-only z-100 px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
    >
      {t('skipToContent')}
    </a>
  );
}
