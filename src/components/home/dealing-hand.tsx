'use client';

import { useAnimate, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

// One signature card per game, plus a fifth, for a five-card hand.
const CARDS = [
  '/images/guides/pokemon/charizard.webp',
  '/images/guides/yugioh/blue-eyes.jpg',
  '/images/guides/mtg/r-glorybringer.jpg',
  '/images/guides/riftbound/jinx.webp',
  '/images/guides/mtg/w-elspeth.jpg',
];
const N = CARDS.length;
const MID = (N - 1) / 2;

function dealt(i: number) {
  const off = i - MID;
  return {
    x: off * 52,
    y: Math.pow(Math.abs(off), 1.4) * 14,
    rotate: off * 9,
    opacity: 1,
  };
}

/**
 * A deck that shuffles (a quick riffle) and deals a five-card hand when scrolled
 * into view, and re-deals on hover. Reduced motion shows the dealt hand
 * statically. Driven imperatively with useAnimate.
 */
export function DealingHand() {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, margin: '-80px' });
  const reduce = useReducedMotion() ?? false;
  const playing = useRef(false);

  const deal = useCallback(async () => {
    if (playing.current) return;
    playing.current = true;

    // Gather into the deck.
    await animate('.dh-card', { x: 0, y: 0, rotate: 0, opacity: 1 }, { duration: 0.25 });
    // Riffle shuffle: split + merge, twice.
    for (let r = 0; r < 2; r++) {
      await Promise.all([
        animate('.dh-left', { x: -34, rotate: -5 }, { duration: 0.13 }),
        animate('.dh-right', { x: 34, rotate: 5 }, { duration: 0.13 }),
      ]);
      await animate('.dh-card', { x: 0, rotate: 0 }, { duration: 0.13 });
    }
    // Deal the hand, one card at a time.
    await Promise.all(
      CARDS.map((_, i) =>
        animate(`.dh-${i}`, dealt(i), {
          delay: 0.09 * i,
          type: 'spring',
          stiffness: 220,
          damping: 18,
        }),
      ),
    );

    playing.current = false;
  }, [animate]);

  useEffect(() => {
    if (reduce) {
      CARDS.forEach((_, i) => animate(`.dh-${i}`, dealt(i), { duration: 0 }));
      return;
    }
    if (inView) void deal();
  }, [inView, reduce, deal, animate]);

  return (
    <div
      ref={scope}
      className="relative h-[260px] w-full max-w-[360px]"
      onPointerEnter={() => !reduce && void deal()}
      aria-hidden
    >
      {CARDS.map((src, i) => (
        <div
          key={src}
          className={`dh-card dh-${i} ${i % 2 === 0 ? 'dh-left' : 'dh-right'} absolute top-1/2 left-1/2 -mt-[88px] -ml-[62px] h-[176px] w-[124px] overflow-hidden rounded-xl opacity-0 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/15`}
          style={{ zIndex: Math.round(N - Math.abs(i - MID)) }}
        >
          <Image src={src} alt="" fill sizes="124px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
