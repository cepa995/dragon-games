import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TwoFactorSetup } from '@/components/auth/two-factor-setup';
import { requireUser } from '@/lib/auth/session';
import { getTwoFactorStatus } from '@/lib/auth/two-factor-actions';

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireUser(); // gate: redirects to login when unauthenticated
  const { enabled } = await getTwoFactorStatus();
  const t = await getTranslations('auth.twoFactor');

  return (
    <main id="main-content" className="mx-auto max-w-2xl space-y-6 px-6 py-12">
      <div>
        <h1 className="text-2xl">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('description')}</p>
      </div>
      <div className="rounded-hero border-border bg-surface border p-6">
        <TwoFactorSetup enabled={enabled} />
      </div>
    </main>
  );
}
