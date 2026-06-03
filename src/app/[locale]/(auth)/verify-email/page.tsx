import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AuthShell } from '@/components/auth/auth-shell';
import { Link } from '@/i18n/navigation';
import { verifyEmail } from '@/lib/auth/account';

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { token } = await searchParams;
  const t = await getTranslations('auth.verify');

  const verified = token ? await verifyEmail(token) : false;

  return (
    <AuthShell title={t(verified ? 'success' : 'failed')}>
      <Link href="/login" className="text-accent text-sm hover:underline">
        {t('loginLink')}
      </Link>
    </AuthShell>
  );
}
