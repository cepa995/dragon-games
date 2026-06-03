import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { logoutAction } from '@/lib/auth/actions';
import { requireUser } from '@/lib/auth/session';

const NAV = [
  { href: '/account/profile', key: 'profile' },
  { href: '/account/addresses', key: 'addresses' },
  { href: '/account/favorites', key: 'favorites' },
  { href: '/account/security', key: 'security' },
  { href: '/account/privacy', key: 'privacy' },
] as const;

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireUser(); // gates all /account/* routes (FR-13)
  const t = await getTranslations('account');

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-2xl">{t('title')}</h1>
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-row flex-wrap gap-2 md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-card text-muted-foreground hover:bg-surface-elevated hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-card text-destructive hover:bg-surface-elevated w-full px-3 py-2 text-left text-sm font-medium transition-colors"
            >
              {t('logout')}
            </button>
          </form>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
