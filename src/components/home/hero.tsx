'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type CardConfig = {
  key: string;
  label: string;
  glyph: string;
  accent: string;
  left: string;
  top: string;
  rotate: number;
  depth: number;
  delay: number;
  float: number;
};

// Positioned around the headline; `depth` drives parallax strength.
const CARDS: CardConfig[] = [
  {
    key: 'mtg',
    label: 'Magic',
    glyph: '✦',
    accent: 'var(--color-tcg-mtg)',
    left: '8%',
    top: '18%',
    rotate: -12,
    depth: 1.1,
    delay: 0.15,
    float: 6,
  },
  {
    key: 'riftbound',
    label: 'Riftbound',
    glyph: '◈',
    accent: 'var(--color-tcg-riftbound)',
    left: '17%',
    top: '58%',
    rotate: -6,
    depth: 1.9,
    delay: 0.35,
    float: 7.5,
  },
  {
    key: 'pokemon',
    label: 'Pokémon',
    glyph: '◓',
    accent: 'var(--color-tcg-pokemon)',
    left: '74%',
    top: '20%',
    rotate: 10,
    depth: 1.5,
    delay: 0.25,
    float: 6.8,
  },
  {
    key: 'yugioh',
    label: 'Yu-Gi-Oh!',
    glyph: '✪',
    accent: 'var(--color-tcg-yugioh)',
    left: '80%',
    top: '60%',
    rotate: 14,
    depth: 1.3,
    delay: 0.45,
    float: 8,
  },
];

// Deterministic so SSR and client markup match (no hydration mismatch).
const EMBERS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 101) % 100,
  size: 2 + (i % 3),
  delay: (i % 9) * 0.6,
  duration: 5 + (i % 6),
}));

function FloatingCard({
  card,
  sx,
  sy,
  reduce,
}: {
  card: CardConfig;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
}) {
  const x = useTransform(sx, (v) => v * card.depth * 38);
  const y = useTransform(sy, (v) => v * card.depth * 30);
  const rotateY = useTransform(sx, (v) => v * card.depth * 9);
  const rotateX = useTransform(sy, (v) => -v * card.depth * 9);

  return (
    <motion.div
      className="absolute hidden md:block"
      style={{ left: card.left, top: card.top }}
      initial={reduce ? false : { opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: card.delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="[transform-style:preserve-3d]"
        style={reduce ? undefined : { x, y, rotateX, rotateY }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={
            reduce ? undefined : { duration: card.float, repeat: Infinity, ease: 'easeInOut' }
          }
          style={
            {
              rotate: `${card.rotate}deg`,
              ['--accent' as string]: card.accent,
            } as React.CSSProperties
          }
        >
          <div
            className="relative flex h-[clamp(120px,15vw,176px)] w-[clamp(86px,10.5vw,124px)] flex-col justify-between rounded-2xl border p-3 backdrop-blur-sm"
            style={{
              borderColor: 'color-mix(in oklch, var(--accent) 55%, transparent)',
              background:
                'linear-gradient(155deg, color-mix(in oklch, var(--accent) 16%, var(--color-surface)), var(--color-surface))',
              boxShadow: '0 18px 50px -12px color-mix(in oklch, var(--accent) 50%, transparent)',
            }}
          >
            <span className="text-foreground/70 text-[10px] font-semibold tracking-wide">
              {card.label}
            </span>
            <span
              className="font-display text-4xl leading-none"
              style={{ color: 'var(--accent)' }}
              aria-hidden
            >
              {card.glyph}
            </span>
            <span
              className="absolute inset-0 rounded-2xl opacity-60"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 0%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 60%)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const t = useTranslations('home.hero');
  const reduce = useReducedMotion() ?? false;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 18 });
  const sy = useSpring(py, { stiffness: 50, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    px.set(0);
    py.set(0);
  }

  const reveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-[42%] left-1/2 size-[42rem] max-w-[90vw] rounded-full blur-3xl"
        style={{
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--color-accent) 26%, transparent), transparent 62%)',
          animation: reduce ? undefined : 'glow-pulse 7s ease-in-out infinite',
        }}
      />

      {/* Embers */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {EMBERS.map((ember, i) => (
            <span
              key={i}
              className="absolute bottom-0 rounded-full"
              style={{
                left: `${ember.left}%`,
                width: ember.size,
                height: ember.size,
                background: 'var(--color-accent)',
                opacity: 0,
                animation: `ember-rise ${ember.duration}s linear ${ember.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating cards */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
        {CARDS.map((card) => (
          <FloatingCard key={card.key} card={card} sx={sx} sy={sy} reduce={reduce} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <motion.p
          custom={0}
          variants={reveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="border-border bg-surface/60 text-muted-foreground rounded-full border px-4 py-1.5 text-xs font-medium tracking-widest uppercase backdrop-blur-sm"
        >
          {t('eyebrow')}
        </motion.p>

        <motion.h1
          custom={1}
          variants={reveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
          style={{
            backgroundImage:
              'linear-gradient(180deg, var(--color-foreground), color-mix(in oklch, var(--color-accent) 75%, var(--color-foreground)))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
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
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/catalog"
            className="group bg-primary text-primary-foreground shadow-primary focus-visible:outline-ring inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold shadow-[0_10px_40px_-10px] transition-transform hover:scale-[1.03] focus-visible:outline-2"
          >
            {t('ctaCatalog')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/tournaments"
            className="border-border bg-surface/50 text-foreground hover:bg-surface-elevated focus-visible:outline-ring inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold backdrop-blur-sm transition-colors focus-visible:outline-2"
          >
            {t('ctaTournaments')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="text-muted-foreground absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
        aria-hidden
      >
        <span className="text-[10px] tracking-widest uppercase">{t('scrollHint')}</span>
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
