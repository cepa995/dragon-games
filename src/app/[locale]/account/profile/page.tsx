import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LanguagePreference } from '@/components/account/language-preference';
import { ProfileForm } from '@/components/account/profile-form';
import { VerificationStatus } from '@/components/account/verification-status';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, phone: true, emailVerified: true },
  });
  const t = await getTranslations('account.profile');

  return (
    <div className="space-y-8">
      <section className="rounded-hero border-border bg-surface space-y-4 border p-6">
        <h2 className="text-lg font-medium">{t('title')}</h2>
        <VerificationStatus verified={Boolean(user?.emailVerified)} email={user?.email ?? ''} />
        <ProfileForm name={user?.name ?? ''} phone={user?.phone ?? ''} />
      </section>

      <section className="rounded-hero border-border bg-surface space-y-3 border p-6">
        <h2 className="text-lg font-medium">{t('languageTitle')}</h2>
        <p className="text-muted-foreground text-sm">{t('languageHint')}</p>
        <LanguagePreference />
      </section>
    </div>
  );
}
