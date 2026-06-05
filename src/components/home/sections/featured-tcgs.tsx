import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { GAME_CARDS } from '@/lib/guides';
import { TCGS } from '@/lib/tcg';
import { Section } from './section';

// Asymmetric bento spans (12-col) so the row sizes vary instead of a flat 2×2.
const SPAN: Record<string, string> = {
  mtg: 'md:col-span-7',
  pokemon: 'md:col-span-5',
  yugioh: 'md:col-span-5',
  riftbound: 'md:col-span-7',
};

export async function FeaturedTcgs() {
  const t = await getTranslations('home.featuredTcgs');
  const tg = await getTranslations('guides');

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      <div className="grid gap-5 md:grid-cols-12">
        {TCGS.map((g) => {
          const cards = GAME_CARDS[g.key].slice(0, 3);
          return (
            <Link
              key={g.key}
              href={`/guides/${g.key}`}
              aria-label={g.label}
              className={`group rounded-hero border-border bg-surface relative h-64 overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 sm:h-72 ${SPAN[g.key]}`}
              style={{ ['--accent' as string]: g.accent } as React.CSSProperties}
            >
              <Image
                src={g.banner}
                alt={g.label}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* darken for legibility + accent wash on hover */}
              <div className="from-background/90 via-background/35 absolute inset-0 bg-gradient-to-t to-transparent" />
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(120% 80% at 80% 100%, color-mix(in oklch, var(--accent) 28%, transparent), transparent 60%)',
                }}
              />

              {/* Real cards fan out of the corner on hover */}
              <div className="pointer-events-none absolute right-3 bottom-0 flex translate-y-12 items-end opacity-0 transition-all duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-100">
                {cards.map((c, i) => (
                  <div
                    key={c.src}
                    className="relative -ml-7 h-28 w-[78px] shrink-0 overflow-hidden rounded-md shadow-xl ring-1 ring-white/15 first:ml-0 sm:h-32 sm:w-[90px]"
                    style={{ transform: `rotate(${(i - 1) * 9}deg)`, zIndex: i }}
                  >
                    <Image src={c.src} alt="" fill sizes="90px" className="object-cover" />
                  </div>
                ))}
              </div>

              {/* accent ring on hover */}
              <div
                className="rounded-hero pointer-events-none absolute inset-0 opacity-0 ring-1 transition-opacity duration-300 ring-inset group-hover:opacity-100"
                style={{
                  boxShadow:
                    'inset 0 0 60px -12px color-mix(in oklch, var(--accent) 70%, transparent)',
                  ['--tw-ring-color' as string]:
                    'color-mix(in oklch, var(--accent) 55%, transparent)',
                }}
              />

              {/* content */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  {g.label}
                </span>
                <p className="text-foreground/85 max-w-[18rem] text-sm">
                  {tg(`games.${g.key}.tagline`)}
                </p>
                <span className="text-foreground group-hover:text-accent mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors">
                  {t('explore')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
