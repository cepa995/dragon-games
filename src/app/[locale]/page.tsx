import { setRequestLocale } from 'next-intl/server';
import { AshField } from '@/components/home/ash-field';
import { CommunityBand } from '@/components/home/community-band';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/home/sections/featured-products';
import { FeaturedTcgs } from '@/components/home/sections/featured-tcgs';
import { LatestNews } from '@/components/home/sections/latest-news';
import { LocationsPreview } from '@/components/home/sections/locations-preview';
import { NewsletterSignup } from '@/components/home/sections/newsletter-signup';
import { UpcomingTournaments } from '@/components/home/sections/upcoming-tournaments';
import { WelcomeBand } from '@/components/home/welcome-band';

// The featured sections read live data (products/tournaments/news) from the DB,
// so the page is server-rendered per request. Caching/ISR is added in M9 (#41).
export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="relative">
      <AshField />

      {/* Hero, welcome and games share one continuous atmospheric canvas so
          their edges blend instead of reading as stacked boxes. */}
      <div className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-[40%] left-1/2 h-[55rem] w-[80rem] max-w-[150vw] -translate-x-1/2 rounded-[50%] blur-[130px]"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklch, var(--color-accent) 8%, transparent), transparent 60%)',
            }}
          />
          <div
            className="absolute top-[64%] right-[6%] size-[40rem] rounded-full blur-[120px]"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklch, var(--color-tcg-yugioh) 7%, transparent), transparent 62%)',
            }}
          />
          <div
            className="absolute top-[82%] left-[4%] size-[36rem] rounded-full blur-[120px]"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklch, var(--color-tcg-riftbound) 6%, transparent), transparent 62%)',
            }}
          />
        </div>

        <Hero />
        <WelcomeBand />
        {/* Credibility stats (StatsBand in sections/stats-band.tsx) are kept and
            can be dropped back in here if we want them again. */}
        <FeaturedTcgs />
      </div>

      <FeaturedProducts locale={locale} />
      <UpcomingTournaments locale={locale} />
      <LatestNews locale={locale} />
      <CommunityBand />
      <LocationsPreview />
      <NewsletterSignup />
    </main>
  );
}
