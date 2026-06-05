import { setRequestLocale } from 'next-intl/server';
import { AshField } from '@/components/home/ash-field';
import { CommunityBand } from '@/components/home/community-band';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/sections/featured-products';
import { FeaturedTcgs } from '@/components/home/sections/featured-tcgs';
import { LatestNews } from '@/components/home/sections/latest-news';
import { LocationsPreview } from '@/components/home/sections/locations-preview';
import { NewsletterSignup } from '@/components/home/sections/newsletter-signup';
import { StatsBand } from '@/components/home/sections/stats-band';
import { UpcomingTournaments } from '@/components/home/sections/upcoming-tournaments';

// The featured sections read live data (products/tournaments/news) from the DB,
// so the page is server-rendered per request. Caching/ISR is added in M9 (#41).
export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="relative">
      <AshField />
      <Hero />
      <StatsBand />
      <FeaturedTcgs />
      <FeaturedProducts locale={locale} />
      <UpcomingTournaments locale={locale} />
      <LatestNews locale={locale} />
      <CommunityBand />
      <LocationsPreview />
      <NewsletterSignup />
    </main>
  );
}
