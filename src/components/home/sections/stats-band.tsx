import { Award, CalendarClock, Swords, Trophy } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { CountUp } from './count-up';

const STATS = [
  { key: 'since', icon: CalendarClock, accent: 'var(--color-accent)' },
  { key: 'wpn', icon: Award, accent: 'var(--color-tcg-mtg)' },
  { key: 'ots', icon: Trophy, accent: 'var(--color-tcg-yugioh)' },
  { key: 'events', icon: Swords, accent: 'var(--color-tcg-riftbound)' },
] as const;

/** Full-bleed credibility band — breaks the section rhythm right after the hero. */
export async function StatsBand() {
  const t = await getTranslations('home.stats');

  return (
    <section className="border-border bg-surface/40 relative overflow-hidden border-y">
      <div className="bg-accent/10 pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full blur-3xl" />
      <div className="bg-tcg-yugioh/10 pointer-events-none absolute right-1/4 -bottom-24 size-72 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <p className="text-accent text-center text-xs font-semibold tracking-[0.25em] uppercase">
            {t('eyebrow')}
          </p>
        </Reveal>
        <Stagger className="mt-9 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {STATS.map(({ key, icon: Icon, accent }) => (
            <StaggerItem key={key} className="group flex flex-col items-center text-center">
              {/* Glowing icon tile */}
              <div className="relative mb-4">
                <span
                  aria-hidden
                  className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
                  style={{
                    background: `color-mix(in oklch, ${accent} 32%, transparent)`,
                    animation: 'pulse-soft 4.5s ease-in-out infinite',
                  }}
                />
                <span
                  className="relative flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(140deg, color-mix(in oklch, ${accent} 30%, var(--color-surface)), var(--color-surface))`,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 38%, transparent)`,
                  }}
                >
                  <Icon className="size-6" style={{ color: accent }} />
                </span>
              </div>

              {/* Gradient number with a hero-style glow + count-up */}
              <CountUp
                value={t(`${key}.value`)}
                className="font-display text-5xl leading-none sm:text-6xl"
                style={{
                  backgroundImage: `linear-gradient(180deg, var(--color-foreground) 22%, ${accent})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  filter: `drop-shadow(0 4px 24px color-mix(in oklch, ${accent} 45%, transparent))`,
                }}
              />
              <span className="text-muted-foreground mt-2 text-sm tracking-wide">
                {t(`${key}.label`)}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
