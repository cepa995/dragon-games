import { Award, CalendarClock, Swords, Trophy } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';

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

      <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14">
        <Reveal>
          <p className="text-accent text-center text-xs font-semibold tracking-[0.25em] uppercase">
            {t('eyebrow')}
          </p>
        </Reveal>
        <Stagger className="mt-7 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ key, icon: Icon, accent }) => (
            <StaggerItem key={key} className="flex flex-col items-center text-center">
              <span
                className="mb-3 flex size-11 items-center justify-center rounded-full"
                style={{
                  color: accent,
                  background: `color-mix(in oklch, ${accent} 15%, transparent)`,
                }}
              >
                <Icon className="size-5" />
              </span>
              <span className="font-display text-4xl sm:text-5xl" style={{ color: accent }}>
                {t(`${key}.value`)}
              </span>
              <span className="text-muted-foreground mt-1 text-sm">{t(`${key}.label`)}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
