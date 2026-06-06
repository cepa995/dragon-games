import { ArrowRight, Clock, Gauge, Trophy, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCardFan } from '@/components/guides/guide-card-fan';
import { AshField } from '@/components/home/ash-field';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { GAME_CARDS } from '@/lib/guides';
import { TCGS } from '@/lib/tcg';

const FACTS = [
  ['players', Users],
  ['time', Clock],
  ['complexity', Gauge],
  ['age', Trophy],
] as const;

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
    <main id="main-content" className="relative">
      <AshField />

      <div className="mx-auto w-full max-w-[1280px] px-4 pt-16 sm:px-6 sm:pt-20">
        <Reveal>
          <div className="max-w-3xl space-y-4">
            <h1
              className="font-display text-4xl leading-tight sm:text-5xl"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, var(--color-foreground) 35%, color-mix(in oklch, var(--color-accent) 85%, var(--color-foreground)))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {t('title')}
            </h1>
            <p className="text-muted-foreground text-lg">{t('intro')}</p>
          </div>
        </Reveal>
      </div>

      {/* Immersive alternating feature row per game */}
      <div className="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-12 sm:px-6 sm:py-16">
        {TCGS.map((game, i) => {
          const cards = GAME_CARDS[game.key];
          const flip = i % 2 === 1;
          return (
            <Reveal key={game.key}>
              <div
                className="rounded-hero border-border bg-surface relative overflow-hidden border"
                style={{ ['--a' as string]: game.accent } as React.CSSProperties}
              >
                <Image
                  src={game.banner}
                  alt=""
                  aria-hidden
                  fill
                  sizes="100vw"
                  className="-z-10 object-cover opacity-[0.08]"
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'radial-gradient(80% 120% at 100% 0%, color-mix(in oklch, var(--a) 14%, transparent), transparent 60%)',
                  }}
                />

                <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:gap-10 md:p-12">
                  <div className={`flex justify-center ${flip ? 'md:order-2' : ''}`}>
                    <GuideCardFan cards={cards} accent={game.accent} />
                  </div>

                  <div className={flip ? 'md:order-1' : ''}>
                    <p
                      className="text-sm font-semibold tracking-[0.18em] uppercase"
                      style={{ color: 'var(--a)' }}
                    >
                      {game.label}
                    </p>
                    <h2 className="font-display mt-2 text-2xl leading-snug sm:text-3xl">
                      {t(`games.${game.key}.tagline`)}
                    </h2>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {FACTS.map(([key, Icon]) => (
                        <li
                          key={key}
                          className="border-border bg-background/40 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
                        >
                          <Icon className="size-4" style={{ color: 'var(--a)' }} />
                          <span className="font-semibold">
                            {t(`games.${game.key}.facts.${key}`)}
                          </span>
                          <span className="text-muted-foreground">{t(`facts.${key}`)}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/guides/${game.key}`}
                      className="group bg-accent text-accent-foreground hover:bg-accent/90 mt-7 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                    >
                      {t('openGuide')}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
