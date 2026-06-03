'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Global motion configuration. `reducedMotion="user"` makes every framer-motion
 * component automatically skip transform/opacity animation when the user has
 * `prefers-reduced-motion: reduce` set (SRS C-8 / FR-24.9 / NFR-4.7).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
