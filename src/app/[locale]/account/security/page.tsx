import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TwoFactorSetup } from '@/components/auth/two-factor-setup';
import { getTwoFactorStatus } from '@/lib/auth/two-factor-actions';

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { enabled } = await getTwoFactorStatus();
  const t = await getTranslations('auth.twoFactor');

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">{t('title')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t('description')}</p>
      </div>
      <div className="rounded-hero border-border bg-surface border p-6">
        <TwoFactorSetup enabled={enabled} />
      </div>
    </section>
  );
}
