'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Image that degrades to an accent gradient when the source is missing or fails
 * (e.g. seeded products without uploaded photography yet). Avoids broken-image
 * icons while real imagery is added via the admin panel (M8).
 */
export function SmartImage({
  src,
  alt,
  sizes,
  className,
  accent = 'var(--color-accent)',
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
  accent?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          background: `linear-gradient(135deg, color-mix(in oklch, ${accent} 28%, var(--color-surface)), var(--color-surface))`,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
