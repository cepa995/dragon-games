'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

export type HeroCard = {
  key: string;
  label: string;
  glyph: string;
  accent: string;
  image?: string;
  w?: number;
  h?: number;
  left: string;
  top: string;
  rotate: number;
  scale: number;
  blur: number;
  opacity: number;
  depth: number;
  delay: number;
  float: number;
  z: number;
};

const MAX_TILT = 26; // degrees

export function HoloCard({
  card,
  sx,
  sy,
  reduce,
}: {
  card: HeroCard;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 170, damping: 14 });
  const sry = useSpring(ry, { stiffness: 170, damping: 14 });
  const hoverScale = useSpring(1, { stiffness: 200, damping: 18 });

  // Idle drift from the global cursor position (parallax by depth).
  const driftX = useTransform(sx, (v) => v * card.depth * 26);
  const driftY = useTransform(sy, (v) => v * card.depth * 20);

  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), transparent 48%)`;
  const sheenPos = useMotionTemplate`${gx}% ${gy}%`;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * MAX_TILT);
    rx.set(-(py - 0.5) * MAX_TILT);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function onEnter() {
    if (reduce) return;
    setHovered(true);
    hoverScale.set(1.07);
  }

  function onLeave() {
    setHovered(false);
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
    hoverScale.set(1);
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: card.left,
        top: card.top,
        zIndex: card.z,
        x: reduce ? 0 : driftX,
        y: reduce ? 0 : driftY,
      }}
      initial={reduce ? false : { opacity: 0, scale: card.scale * 0.8 }}
      animate={{ opacity: card.opacity, scale: card.scale }}
      transition={{ delay: card.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={
          reduce ? undefined : { duration: card.float, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ perspective: 1000 }}
      >
        <motion.div
          ref={ref}
          onPointerMove={onMove}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          className="pointer-events-auto relative w-fit cursor-pointer overflow-hidden rounded-2xl ring-1"
          style={
            {
              rotate: `${card.rotate}deg`,
              rotateX: reduce ? 0 : srx,
              rotateY: reduce ? 0 : sry,
              scale: reduce ? 1 : hoverScale,
              transformStyle: 'preserve-3d',
              filter: card.blur ? `blur(${card.blur}px)` : undefined,
              boxShadow: '0 34px 90px -22px color-mix(in oklch, var(--accent) 70%, transparent)',
              ['--accent' as string]: card.accent,
              ['--tw-ring-color' as string]: 'color-mix(in oklch, var(--accent) 55%, transparent)',
            } as React.CSSProperties
          }
        >
          {card.image ? (
            // Rendered at the card's true aspect ratio so no edges are cropped.
            <Image
              src={card.image}
              alt={card.label}
              width={card.w ?? 488}
              height={card.h ?? 680}
              sizes="200px"
              className="block h-auto w-[clamp(124px,13vw,184px)]"
            />
          ) : (
            <div
              className="flex aspect-[2.5/3.5] w-[clamp(124px,13vw,184px)] flex-col justify-between p-3"
              style={{
                background:
                  'linear-gradient(155deg, color-mix(in oklch, var(--accent) 24%, var(--color-surface)), var(--color-surface))',
              }}
            >
              <span className="text-foreground/70 text-[11px] font-semibold tracking-wide">
                {card.label}
              </span>
              <span
                className="font-display text-5xl leading-none"
                style={{ color: 'var(--accent)' }}
                aria-hidden
              >
                {card.glyph}
              </span>
            </div>
          )}

          {/* Holographic sheen */}
          <motion.div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundImage:
                'linear-gradient(115deg, transparent 25%, rgba(255,80,220,0.4), rgba(90,200,255,0.4), rgba(255,225,120,0.4), transparent 75%)',
              backgroundSize: '220% 220%',
              backgroundPosition: sheenPos,
              mixBlendMode: 'color-dodge',
              opacity: hovered ? 0.55 : 0,
            }}
          />
          {/* Moving glare */}
          <motion.div
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
            style={{ background: glare, opacity: hovered ? 1 : 0 }}
          />
          {/* Inner rim glow */}
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: 'inset 0 0 36px color-mix(in oklch, var(--accent) 32%, transparent)',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
