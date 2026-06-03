'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { HeroBackground } from './hero-background';
import { HoloCard, type HeroCard } from './holo-card';

// Depth-layered composition: near cards are large/sharp, far cards small/blurred.
const CARDS: HeroCard[] = [
  {
    key: 'mtg',
    label: 'Magic: The Gathering',
    glyph: '✦',
    accent: 'var(--color-tcg-mtg)',
    image: '/images/hero-cards/mtg-dragon.jpg',
    w: 488,
    h: 680,
    left: '4%',
    top: '19%',
    rotate: -13,
    scale: 1.12,
    blur: 0,
    opacity: 1,
    depth: 1.2,
    delay: 0.15,
    float: 6.5,
    z: 3,
  },
  {
    key: 'pokemon',
    label: 'Pokémon',
    glyph: '◓',
    accent: 'var(--color-tcg-pokemon)',
    image: '/images/hero-cards/pokemon-charizard.png',
    w: 733,
    h: 1024,
    left: '72%',
    top: '12%',
    rotate: 11,
    scale: 1.05,
    blur: 0,
    opacity: 1,
    depth: 1.6,
    delay: 0.28,
    float: 7.2,
    z: 3,
  },
  {
    key: 'yugioh',
    label: 'Yu-Gi-Oh!',
    glyph: '✪',
    accent: 'var(--color-tcg-yugioh)',
    image: '/images/hero-cards/ygo-slifer.jpg',
    w: 813,
    h: 1185,
    left: '78%',
    top: '54%',
    rotate: 13,
    scale: 0.96,
    blur: 0,
    opacity: 1,
    depth: 1.35,
    delay: 0.42,
    float: 8,
    z: 2,
  },
  {
    key: 'riftbound',
    label: 'Riftbound',
    glyph: '◈',
    accent: 'var(--color-tcg-riftbound)',
    image: '/images/hero-cards/riftbound-elder-dragon.webp',
    w: 437,
    h: 610,
    left: '10%',
    top: '58%',
    rotate: -7,
    scale: 0.9,
    blur: 0,
    opacity: 1,
    depth: 2.1,
    delay: 0.34,
    float: 9,
    z: 1,
  },
];

export function Hero() {
  const t = useTranslations('home.hero');
  const reduce = useReducedMotion() ?? false;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 45, damping: 18 });
  const sy = useSpring(py, { stiffness: 45, damping: 18 });

  // Subtle 3D parallax for the dragon centerpiece.
  const dragonX = useTransform(sx, (v) => v * 26);
  const dragonRotateY = useTransform(sx, (v) => v * 12);
  const dragonRotateX = useTransform(sy, (v) => -v * 8);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  const reveal = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6"
    >
      <HeroBackground reduce={reduce} />

      {/* Floating holographic cards */}
      <div className="absolute inset-0 mx-auto max-w-[1400px]">
        {CARDS.map((card) => (
          <HoloCard key={card.key} card={card} sx={sx} sy={sy} reduce={reduce} />
        ))}
      </div>

      {/* Content */}
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        {/* Dragon centerpiece */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative -mb-3"
          style={{ perspective: 900 }}
        >
          <div
            className="absolute top-1/2 left-1/2 -z-10 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklch, var(--color-tcg-riftbound) 42%, transparent), transparent 64%)',
            }}
          />
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={
              reduce
                ? undefined
                : {
                    x: dragonX,
                    rotateX: dragonRotateX,
                    rotateY: dragonRotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
          >
            <Image
              src="/images/hero-cards/dragon-3d-model-v2.png"
              alt=""
              width={1254}
              height={1254}
              priority
              aria-hidden
              className="h-[clamp(150px,20vw,260px)] w-auto drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
        </motion.div>

        <motion.p
          custom={0}
          variants={reveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="border-border bg-surface/50 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-md"
        >
          <span className="bg-accent shadow-accent size-1.5 rounded-full shadow-[0_0_8px]" />
          {t('eyebrow')}
        </motion.p>

        <motion.h1
          custom={1}
          variants={reveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="font-display text-6xl leading-[1.02] sm:text-7xl lg:text-8xl"
          style={{
            backgroundImage:
              'linear-gradient(180deg, var(--color-foreground) 30%, color-mix(in oklch, var(--color-accent) 85%, var(--color-foreground)))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            filter:
              'drop-shadow(0 6px 30px color-mix(in oklch, var(--color-accent) 40%, transparent))',
          }}
        >
          {t('title')}
        </motion.h1>

        <motion.p
          custom={2}
          variants={reveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="text-muted-foreground max-w-xl text-base sm:text-lg"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          custom={3}
          variants={reveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="pointer-events-auto flex flex-col gap-3 pt-2 sm:flex-row"
        >
          <Link
            href="/catalog"
            className="group bg-primary text-primary-foreground shadow-primary focus-visible:outline-ring relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold shadow-[0_12px_45px_-10px] transition-transform hover:scale-[1.04] focus-visible:outline-2"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {t('ctaCatalog')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/tournaments"
            className="border-border bg-surface/40 text-foreground hover:border-accent/50 hover:bg-surface-elevated focus-visible:outline-ring inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold backdrop-blur-md transition-colors focus-visible:outline-2"
          >
            {t('ctaTournaments')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-muted-foreground absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">{t('scrollHint')}</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}
