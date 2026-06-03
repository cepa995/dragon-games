// Ambient ash drifting up across the whole page (fire-ash feel). Pure CSS
// transform/opacity animations on a fixed layer — cheap and GPU-composited.
// Deterministic positions (SSR-safe). Under reduced motion the global CSS guard
// freezes the animation at opacity 0, so no ash is shown.

const ASH = Array.from({ length: 46 }, (_, i) => ({
  left: (i * 61) % 100,
  size: 1.5 + (i % 3),
  delay: (i % 12) * 1.4,
  duration: 15 + (i % 9),
  drift: (i % 2 ? 1 : -1) * (20 + (i % 5) * 12),
  opacity: 0.16 + (i % 4) * 0.06,
}));

export function AshField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {ASH.map((a, i) => (
        <span
          key={i}
          className="absolute -bottom-2 rounded-full"
          style={
            {
              left: `${a.left}%`,
              width: a.size,
              height: a.size,
              background:
                'color-mix(in oklch, var(--color-accent) 38%, var(--color-muted-foreground))',
              opacity: 0,
              ['--ash-drift']: `${a.drift}px`,
              ['--ash-opacity']: a.opacity,
              animation: `ash-float ${a.duration}s linear ${a.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
