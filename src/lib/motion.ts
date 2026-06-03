import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion tokens (SRS FR-24). All motion is gated on `prefers-reduced-
 * motion` via the global `MotionProvider` (MotionConfig reducedMotion="user")
 * and the per-component `useReducedMotion` checks, plus the CSS guard in
 * globals.css.
 */

/** Spring preset for microinteractions (~150–250ms feel). FR-24.6. */
export const spring: Transition = { type: 'spring', stiffness: 300, damping: 30 };
export const springSnappy: Transition = { type: 'spring', stiffness: 420, damping: 28 };

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Scroll-reveal: fade in with a 24px translate-Y. FR-24.2. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

/** Container that staggers its reveal children. FR-24.2. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/** Enter transition for route changes. FR-24.1. */
export const pageEnter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: easeOut },
};
