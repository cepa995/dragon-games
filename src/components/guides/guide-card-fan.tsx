'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import type { GuideCard } from '@/lib/guides';

/**
 * A fanned "hand" of real cards for a guide hero. Cards arc outward, bob gently
 * and lift on hover. Reduced-motion renders the fan statically.
 */
export function GuideCardFan({ cards, accent }: { cards: GuideCard[]; accent: string }) {
  const reduce = useReducedMotion() ?? false;
  const n = cards.length;
  const center = (n - 1) / 2;
  const spread = n > 1 ? 13 : 0; // degrees between neighboring cards
  const arc = 16; // px the edge cards drop to form the arc

  return (
    <div
      className="relative flex items-end justify-center"
      style={{ ['--a' as string]: accent } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'color-mix(in oklch, var(--a) 26%, transparent)' }}
      />
      {cards.map((card, i) => {
        const off = i - center;
        const rotate = off * spread;
        const ty = Math.pow(Math.abs(off), 1.4) * arc;
        const z = Math.round(n - Math.abs(off));
        const settled = { opacity: 1, y: ty, rotate };
        return (
          <motion.div
            key={card.src}
            className="relative"
            style={{ zIndex: z, marginLeft: i === 0 ? 0 : '-2.6rem' }}
            initial={reduce ? settled : { opacity: 0, y: 28, rotate: rotate * 0.5 }}
            whileInView={settled}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={
              reduce ? undefined : { y: ty - 20, rotate: rotate * 0.4, scale: 1.06, zIndex: 50 }
            }
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={
                reduce ? undefined : { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Image
                src={card.src}
                alt={card.label}
                width={card.w}
                height={card.h}
                sizes="160px"
                className="h-auto w-[clamp(104px,11vw,148px)] rounded-xl shadow-[0_24px_55px_-18px_rgba(0,0,0,0.75)] ring-1"
                style={
                  {
                    ['--tw-ring-color' as string]: 'color-mix(in oklch, var(--a) 55%, transparent)',
                  } as React.CSSProperties
                }
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
