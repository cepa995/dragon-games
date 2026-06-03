import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DeleteAccountForm } from '@/components/account/delete-account-form';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { passwordHash: true },
  });
  const t = await getTranslations('account.privacy');

  return (
    <div className="space-y-8">
      <section className="rounded-hero border-border bg-surface space-y-3 border p-6">
        <h2 className="text-lg font-medium">{t('exportTitle')}</h2>
        <p className="text-muted-foreground text-sm">{t('exportHint')}</p>
        {/* Download from an API route (not a page) — a plain anchor is correct. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/account/export"
          className="rounded-card bg-surface-elevated text-foreground hover:bg-muted inline-flex h-10 items-center px-4 text-sm font-medium transition-colors"
        >
          {t('exportButton')}
        </a>
      </section>

      <section className="rounded-hero border-destructive/40 bg-surface space-y-3 border p-6">
        <h2 className="text-destructive text-lg font-medium">{t('deleteTitle')}</h2>
        <p className="text-muted-foreground text-sm">{t('deleteHint')}</p>
        <DeleteAccountForm hasPassword={Boolean(user?.passwordHash)} />
      </section>
    </div>
  );
}
