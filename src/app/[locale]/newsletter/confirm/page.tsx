import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ResultMessage } from '@/components/ui/result-message';
import { confirmSubscription } from '@/lib/newsletter';

// Mutates subscriber state from a token in the URL — never cached/prerendered.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'newsletter' });
  return { title: t('metaConfirm'), robots: { index: false } };
}

export default async function NewsletterConfirmPage({
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

  const res = token ? await confirmSubscription(token) : { ok: false };

  return res.ok ? (
    <ResultMessage
      ok
      title={t('confirmedTitle')}
      body={t('confirmedBody')}
      backLabel={t('backHome')}
    />
  ) : (
    <ResultMessage
      ok={false}
      title={t('confirmErrorTitle')}
      body={t('confirmErrorBody')}
      backLabel={t('backHome')}
    />
  );
}
