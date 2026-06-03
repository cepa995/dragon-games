'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';

/**
 * Enter transition for route changes (fade + slight translate-Y, SRS FR-24.1).
 * Mounted via `app/[locale]/template.tsx`, which Next.js re-instantiates on every
 * navigation, so the enter animation plays per route. Skipped under reduced
 * motion. (The View Transitions API can replace this where supported in M-later.)
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={pageEnter.initial}
      animate={pageEnter.animate}
      transition={pageEnter.transition}
    >
      {children}
    </motion.div>
  );
}
