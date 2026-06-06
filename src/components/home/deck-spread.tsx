'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// A full deck (14 cards across the four games, interleaved for color).
const CARDS = [
  '/images/guides/pokemon/charizard.webp',
  '/images/guides/yugioh/blue-eyes.jpg',
  '/images/guides/mtg/w-elspeth.jpg',
  '/images/guides/riftbound/jinx.webp',
  '/images/guides/pokemon/pikachu.webp',
  '/images/guides/yugioh/dark-magician.jpg',
  '/images/guides/mtg/u-jace.jpg',
  '/images/guides/riftbound/ekko.webp',
  '/images/guides/pokemon/mewtwo.webp',
  '/images/guides/yugioh/slifer.jpg',
  '/images/guides/mtg/b-sheoldred.jpg',
  '/images/guides/riftbound/stormbringer.webp',
  '/images/guides/pokemon/blastoise.webp',
  '/images/guides/mtg/r-glorybringer.jpg',
];
const N = CARDS.length;
const MID = (N - 1) / 2;

const variants = {
  // Tight stack — a thick deck (slight offsets show the edges).
  stacked: (i: number) => ({
    x: (i - MID) * 0.9,
    y: (N - i) * -0.9,
    rotate: (i - MID) * 0.7,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const, delay: (N - i) * 0.012 },
  }),
  // Wide spread arc — the whole deck fanned out.
  spread: (i: number) => ({
    x: (i - MID) * 30,
    y: Math.pow(Math.abs(i - MID), 1.25) * 8,
    rotate: (i - MID) * 5,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.03 },
  }),
};

/**
 * A whole deck that fans into a wide spread and periodically gathers and
 * re-shuffles. Reduced motion shows the spread statically.
 */
export function DeckSpread() {
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<'stacked' | 'spread'>('stacked');

  useEffect(() => {
    if (reduce) {
      setPhase('spread');
      return;
    }
    const intro = setTimeout(() => setPhase('spread'), 350);
    let gather: ReturnType<typeof setTimeout>;
    const loop = setInterval(() => {
      setPhase('stacked');
      gather = setTimeout(() => setPhase('spread'), 650);
    }, 5200);
    return () => {
      clearTimeout(intro);
      clearTimeout(gather);
      clearInterval(loop);
    };
  }, [reduce]);

  return (
    <div className="relative h-[240px] w-full max-w-[460px]" aria-hidden>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'color-mix(in oklch, var(--color-accent) 14%, transparent)' }}
      />
      {CARDS.map((src, i) => (
        <motion.div
          key={`${src}-${i}`}
          custom={i}
          variants={variants}
          initial="stacked"
          animate={phase}
          className="absolute top-1/2 left-1/2 -mt-[82px] -ml-[58px] h-[164px] w-[116px] overflow-hidden rounded-lg shadow-[0_16px_36px_-14px_rgba(0,0,0,0.7)] ring-1 ring-white/12"
          style={{ zIndex: i }}
        >
          <Image src={src} alt="" fill sizes="116px" className="object-cover" />
        </motion.div>
      ))}
    </div>
  );
}
