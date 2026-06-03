import { setRequestLocale } from 'next-intl/server';
import { AshField } from '@/components/home/ash-field';
import { Hero } from '@/components/home/hero';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Hero first (#16). The featured TCGs / products / tournaments / news /
  // locations / newsletter sections follow in the next step.
  return (
    <main id="main-content" className="relative">
      <AshField />
      <Hero />
    </main>
  );
}
