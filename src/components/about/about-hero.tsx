'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HeroBackground } from '@/components/home/hero-background';

const STATS = ['since', 'wpn', 'ots', 'community'] as const;

/**
 * Atmospheric, animated About hero — shares the home page's visual language
 * (layered ambiance, a floating dragon centerpiece, cursor parallax and a
 * blur-in headline) so the two pages feel of a piece. Reduced-motion safe.
 */
export function AboutHero() {
  const t = useTranslations('about');
  const reduce = useReducedMotion() ?? false;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 45, damping: 18 });
  const sy = useSpring(py, { stiffness: 45, damping: 18 });
  const dragonX = useTransform(sx, (v) => v * 30);
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
      transition: { delay: 0.12 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[80vh] items-center overflow-hidden px-6 py-24"
    >
      <HeroBackground reduce={reduce} />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Dragon — left, side-facing toward the content */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.86, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none order-2 flex justify-center lg:order-1 lg:justify-start"
          style={{ perspective: 1100 }}
        >
          <div className="relative">
            <div
              className="absolute top-1/2 left-1/2 size-[clamp(300px,34vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in oklch, var(--color-tcg-riftbound) 32%, transparent), transparent 62%)',
              }}
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
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
                src="/images/hero-cards/dragon-3d-model-v1.png"
                alt=""
                width={1254}
                height={1254}
                priority
                aria-hidden
                className="relative h-[clamp(260px,36vw,500px)] w-auto drop-shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Content — right */}
        <div className="order-1 flex flex-col items-center gap-6 text-center lg:order-2 lg:items-start lg:text-left">
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
            className="font-display text-5xl leading-[1.04] sm:text-6xl lg:text-7xl"
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
            {t('lead')}
          </motion.p>

          <motion.dl
            custom={3}
            variants={reveal}
            initial={reduce ? false : 'hidden'}
            animate="visible"
            className="mt-2 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {STATS.map((key) => (
              <div
                key={key}
                className="rounded-hero border-border bg-surface/50 border px-3 py-3 text-center backdrop-blur-md"
              >
                <dt className="text-accent font-display text-2xl sm:text-3xl">
                  {t(`stats.${key}.value`)}
                </dt>
                <dd className="text-muted-foreground mt-0.5 text-xs">{t(`stats.${key}.label`)}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
