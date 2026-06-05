'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { FavoriteButton } from '@/components/catalog/favorite-button';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';

const MAX_TILT = 12; // degrees

export type HoloProduct = {
  id: string;
  href: string;
  image?: string | null;
  name: string;
  price: string;
  game: string | null;
  accent: string;
  statusLabel: string;
  statusClass: string;
};

/**
 * A product shown like a shiny collectible card: tilts toward the cursor in 3D,
 * a holographic sheen + glare sweep across it, and a rarity-style aura glows in
 * the game's accent color. Reduced-motion renders a flat card.
 */
export function HoloProductCard({ product }: { product: HoloProduct }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 160, damping: 14 });
  const sry = useSpring(ry, { stiffness: 160, damping: 14 });

  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 50%)`;
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

  function onLeave() {
    setHovered(false);
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <div
      className="group relative"
      style={{ perspective: 1000, ['--accent' as string]: product.accent } as React.CSSProperties}
    >
      {/* Rarity glow aura beneath the card */}
      <div
        aria-hidden
        className="rounded-hero pointer-events-none absolute -inset-1 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'color-mix(in oklch, var(--accent) 40%, transparent)' }}
      />

      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => !reduce && setHovered(true)}
        onPointerLeave={onLeave}
        style={{
          rotateX: reduce ? 0 : srx,
          rotateY: reduce ? 0 : sry,
          transformStyle: 'preserve-3d',
        }}
        className="rounded-hero border-border bg-surface relative overflow-hidden border"
      >
        <Link href={product.href} aria-label={product.name}>
          <div className="bg-muted relative aspect-[4/5] overflow-hidden">
            <SmartImage
              src={product.image}
              alt={product.name}
              accent={product.accent}
              sizes="(max-width: 640px) 70vw, 25vw"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Holographic sheen */}
            <motion.div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                backgroundImage:
                  'linear-gradient(115deg, transparent 25%, rgba(255,80,220,0.35), rgba(90,200,255,0.35), rgba(255,225,120,0.35), transparent 75%)',
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
            <span
              className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${product.statusClass}`}
            >
              {product.statusLabel}
            </span>
            <div className="from-surface absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent" />
          </div>
          <div className="space-y-1 p-4">
            {product.game && (
              <span
                className="text-[11px] font-semibold tracking-wide uppercase"
                style={{ color: 'var(--accent)' }}
              >
                {product.game}
              </span>
            )}
            <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">{product.name}</p>
            <p className="text-accent text-lg font-bold">{product.price}</p>
          </div>
        </Link>

        {/* Accent rim that ignites on hover */}
        <span
          aria-hidden
          className="rounded-hero pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow:
              'inset 0 0 0 1px color-mix(in oklch, var(--accent) 60%, transparent), inset 0 0 44px -10px color-mix(in oklch, var(--accent) 55%, transparent)',
          }}
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton productId={product.id} label={product.name} />
        </div>
      </motion.div>
    </div>
  );
}
