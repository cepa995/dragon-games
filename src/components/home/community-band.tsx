import { Compass, Trophy } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';

// Real card art across all four games, interleaved so each row mixes games.
const CARDS = [
  '/images/guides/mtg/w-elspeth.jpg',
  '/images/guides/pokemon/charizard.webp',
  '/images/guides/yugioh/blue-eyes.jpg',
  '/images/guides/riftbound/jinx.webp',
  '/images/guides/mtg/u-jace.jpg',
  '/images/guides/pokemon/pikachu.webp',
  '/images/guides/yugioh/dark-magician.jpg',
  '/images/guides/riftbound/ekko.webp',
  '/images/guides/mtg/b-sheoldred.jpg',
  '/images/guides/pokemon/mewtwo.webp',
  '/images/guides/yugioh/slifer.jpg',
  '/images/guides/riftbound/stormbringer.webp',
  '/images/guides/mtg/r-glorybringer.jpg',
  '/images/guides/pokemon/blastoise.webp',
  '/images/guides/yugioh/obelisk.jpg',
  '/images/guides/riftbound/kogmaw.webp',
  '/images/guides/mtg/g-craterhoof.jpg',
  '/images/guides/pokemon/venusaur.webp',
  '/images/guides/yugioh/red-eyes.jpg',
  '/images/guides/riftbound/mageseeker.webp',
];

const ROW1 = CARDS.filter((_, i) => i % 2 === 0);
const ROW2 = CARDS.filter((_, i) => i % 2 === 1);

function MarqueeRow({ cards, reverse }: { cards: string[]; reverse?: boolean }) {
  const doubled = [...cards, ...cards];
  return (
    <div
      className="flex w-max gap-4"
      style={{ animation: `${reverse ? 'marquee-reverse' : 'marquee'} 55s linear infinite` }}
    >
      {doubled.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative h-44 w-[122px] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10"
        >
          <Image src={src} alt="" fill sizes="122px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/** Full-bleed community band: real cards stream past behind a centered CTA. */
export async function CommunityBand() {
  const t = await getTranslations('home.community');

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Marquee backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col justify-center gap-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] opacity-40"
      >
        <MarqueeRow cards={ROW1} />
        <MarqueeRow cards={ROW2} reverse />
      </div>
      {/* Legibility scrims */}
      <div className="from-background via-background/65 to-background absolute inset-0 bg-gradient-to-r" />
      <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

      <Reveal className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase">
          {t('eyebrow')}
        </p>
        <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">{t('title')}</h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl">{t('subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/guides"
            className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
          >
            <Compass className="size-4" />
            {t('guides')}
          </Link>
          <Link
            href="/tournaments"
            className="border-border bg-surface/40 hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors"
          >
            <Trophy className="size-4" />
            {t('tournaments')}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
