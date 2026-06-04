import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { TCGS } from '@/lib/tcg';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'guides' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function GuidesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('intro')}</p>
        </div>
      </Reveal>

      <Stagger className="grid gap-5 sm:grid-cols-2">
        {TCGS.map((game) => (
          <StaggerItem key={game.key} className="h-full">
            <Link
              href={`/guides/${game.key}`}
              className="group rounded-hero border-border bg-surface hover:border-accent/40 relative flex h-full flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1.5"
              style={{ ['--a' as string]: game.accent } as React.CSSProperties}
            >
              <div className="bg-muted relative aspect-[16/9] overflow-hidden">
                <Image
                  src={game.banner}
                  alt={game.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="from-surface absolute inset-0 bg-gradient-to-t to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h2 className="font-display text-2xl">{game.label}</h2>
                <p className="text-muted-foreground text-sm">{t(`games.${game.key}.tagline`)}</p>
                <span className="text-accent mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold">
                  {t('openGuide')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </main>
  );
}
