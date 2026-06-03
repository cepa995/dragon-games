'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { revealVariants, staggerContainer } from '@/lib/motion';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Reveals its content (fade + 24px translate-Y) when scrolled into view, once
 * (SRS FR-24.2). Renders statically when reduced motion is preferred.
 */
export function Reveal({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers the reveal of its `StaggerItem` children. */
export function Stagger({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={revealVariants}>
      {children}
    </motion.div>
  );
}
