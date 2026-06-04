import { notFound } from 'next/navigation';

/**
 * Catch-all that routes any unmatched in-locale path to the branded
 * `[locale]/not-found.tsx`. Without it, Next would render its default root 404
 * for unmatched URLs (next-intl App Router pattern).
 */
export default function CatchAllNotFound() {
  notFound();
}
