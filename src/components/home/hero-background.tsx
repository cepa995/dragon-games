// Layered "tavern at night" atmosphere for the hero. All motion is CSS-driven
// and neutralised by the global reduced-motion guard; the ember field is gated
// on `reduce` in JS. Purely decorative — pointer-events disabled.

const FAR_EMBERS = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 53) % 100,
  size: 1.5 + (i % 2),
  delay: (i % 11) * 0.5,
  duration: 6 + (i % 5),
}));

const NEAR_EMBERS = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 83) % 100,
  size: 3 + (i % 3),
  delay: (i % 7) * 0.8,
  duration: 7 + (i % 4),
}));

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function HeroBackground({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Base depth gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 8%, color-mix(in oklch, var(--color-surface) 70%, transparent), transparent 55%), radial-gradient(90% 70% at 50% 115%, color-mix(in oklch, var(--color-accent) 16%, transparent), transparent 60%)',
        }}
      />

      {/* Drifting nebula blobs */}
      <div
        className="absolute top-[6%] left-[12%] size-[34rem] max-w-[70vw] rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--color-tcg-mtg) 40%, transparent), transparent 65%)',
          opacity: 0.5,
          animation: reduce ? undefined : 'nebula-drift 16s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[8%] bottom-[4%] size-[32rem] max-w-[70vw] rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--color-tcg-yugioh) 38%, transparent), transparent 65%)',
          opacity: 0.45,
          animation: reduce ? undefined : 'nebula-drift 20s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute top-[34%] left-1/2 size-[40rem] max-w-[85vw] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--color-accent) 30%, transparent), transparent 62%)',
          opacity: 0.55,
          animation: reduce ? undefined : 'glow-pulse 9s ease-in-out infinite',
          transform: 'translate(-50%, 0)',
        }}
      />

      {/* God rays from above */}
      <div className="absolute -top-1/4 left-0 h-[80%] w-full">
        {[18, 42, 64, 82].map((x, i) => (
          <div
            key={x}
            className="absolute top-0 h-full w-[10vw] blur-2xl"
            style={{
              left: `${x}%`,
              background:
                'linear-gradient(to bottom, color-mix(in oklch, var(--color-accent) 22%, transparent), transparent 70%)',
              transform: 'skewX(-14deg)',
              opacity: 0.3,
              animation: reduce
                ? undefined
                : `ray-shift ${9 + i * 2}s ease-in-out ${i * 1.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ember fields (depth: far sharp + near blurred) */}
      {!reduce && (
        <>
          <div className="absolute inset-0">
            {FAR_EMBERS.map((e, i) => (
              <span
                key={`f${i}`}
                className="absolute bottom-0 rounded-full"
                style={{
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  background: 'var(--color-accent)',
                  opacity: 0,
                  animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 blur-[2px]">
            {NEAR_EMBERS.map((e, i) => (
              <span
                key={`n${i}`}
                className="absolute bottom-0 rounded-full"
                style={{
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  background: 'color-mix(in oklch, var(--color-accent) 80%, white)',
                  opacity: 0,
                  animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: '160px 160px' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 40%, transparent 55%, color-mix(in oklch, var(--color-background) 85%, transparent))',
        }}
      />

      {/* Smooth fade into the page background at the bottom */}
      <div className="to-background absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent" />
    </div>
  );
}
