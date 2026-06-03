import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AddressBook } from '@/components/account/address-book';
import { getCurrentUser } from '@/lib/auth/session';
import { listAddresses } from '@/lib/account/profile';

export default async function AddressesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return null;

  const addresses = await listAddresses(sessionUser.id);
  const t = await getTranslations('account.addresses');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{t('title')}</h2>
      <AddressBook addresses={addresses} />
    </section>
  );
}
