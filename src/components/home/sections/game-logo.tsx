'use client';

import Image from 'next/image';
import { useState } from 'react';

/** Game logo with a glyph fallback while official logos aren't added yet. */
export function GameLogo({
  src,
  alt,
  glyph,
  accent,
}: {
  src: string;
  alt: string;
  glyph: string;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="font-display text-5xl" style={{ color: accent }} aria-hidden>
        {glyph}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={56}
      onError={() => setFailed(true)}
      className="h-12 w-auto max-w-[150px] object-contain"
    />
  );
}
