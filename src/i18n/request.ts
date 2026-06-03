import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { logger } from '@/lib/logger';
import { deepMerge, type Messages } from './merge';
import { routing } from './routing';

async function loadMessages(locale: string): Promise<Messages> {
  return (await import(`../../messages/${locale}.json`)).default as Messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Serbian is the fallback base; any key missing in another locale resolves to
  // its Serbian value (SRS FR-26.6 / NFR-9.5).
  const base = await loadMessages(routing.defaultLocale);
  const messages =
    locale === routing.defaultLocale ? base : deepMerge(base, await loadMessages(locale));

  return {
    locale,
    messages,
    // Format dates/numbers as Serbian Latin / British English (NFR-9.2).
    timeZone: 'Europe/Belgrade',
    // Missing keys are logged, never thrown (NFR-9.5).
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        logger.warn({ err: error.message, locale }, 'i18n missing message');
      } else {
        logger.error({ err: error.message, locale }, 'i18n error');
      }
    },
    getMessageFallback({ key }) {
      return key;
    },
  };
});
