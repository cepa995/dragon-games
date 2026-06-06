import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { LocationCard } from '@/components/locations/location-card';
import { getBusiness } from '@/lib/business';

// Reads business settings and renders a timezone-aware open-now status, so it is
// server-rendered per request (no build-time DB; ISR added in M9 / #41).
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'locations' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('locations');
  const business = await getBusiness();

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('intro')}</p>
        </div>
      </Reveal>
      <Reveal>
        <LocationCard business={business} locale={locale} />
      </Reveal>
    </main>
  );
}
