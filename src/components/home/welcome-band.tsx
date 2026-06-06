import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DeckSpread } from '@/components/home/deck-spread';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';

/** Welcome / manifesto band — narrative warmth right after the hero. */
export async function WelcomeBand() {
  const t = await getTranslations('home.welcome');
  const badges = t.raw('badges') as string[];

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 size-[28rem] -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'color-mix(in oklch, var(--color-accent) 10%, transparent)' }}
      />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div>
            <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase">
              {t('eyebrow')}
            </p>
            <h2
              className="font-display mt-3 text-3xl leading-snug sm:text-4xl"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, var(--color-foreground) 40%, color-mix(in oklch, var(--color-accent) 80%, var(--color-foreground)))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {t('title')}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
              {t('body')}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {badges.map((b) => (
                <li
                  key={b}
                  className="border-border bg-surface/50 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium"
                >
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="text-accent hover:text-foreground group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            >
              {t('cta')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="flex justify-center lg:justify-end">
          <DeckSpread />
        </div>
      </div>
    </section>
  );
}
