'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts a numeric value up from zero when scrolled into view. Non-numeric
 * values (e.g. "WPN") and reduced-motion render the value as-is. A trailing
 * suffix like "+" is preserved (e.g. "52+").
 */
export function CountUp({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion() ?? false;

  const match = /^(\d[\d.,]*)(.*)$/.exec(value);
  const digits = match?.[1];
  const target = digits ? parseInt(digits.replace(/[.,]/g, ''), 10) : null;
  const suffix = match?.[2] ?? '';

  const [display, setDisplay] = useState(() => (target == null || reduce ? value : `0${suffix}`));

  useEffect(() => {
    if (target == null || reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, target, suffix, value, reduce]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
