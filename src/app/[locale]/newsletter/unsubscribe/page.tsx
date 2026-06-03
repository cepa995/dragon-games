import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ResultMessage } from '@/components/ui/result-message';
import { unsubscribe } from '@/lib/newsletter';

// Mutates subscriber state from a token in the URL — never cached/prerendered.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'newsletter' });
  return { title: t('metaUnsubscribe'), robots: { index: false } };
}

export default async function NewsletterUnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { token } = await searchParams;
  const t = await getTranslations('newsletter');

  const res = token ? await unsubscribe(token) : { ok: false };

  return res.ok ? (
    <ResultMessage
      ok
      title={t('unsubscribedTitle')}
      body={t('unsubscribedBody')}
      backLabel={t('backHome')}
    />
  ) : (
    <ResultMessage
      ok={false}
      title={t('unsubscribeErrorTitle')}
      body={t('unsubscribeErrorBody')}
      backLabel={t('backHome')}
    />
  );
}
