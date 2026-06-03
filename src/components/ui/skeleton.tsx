/**
 * Loading skeleton primitive (SRS FR-24.7). Uses Tailwind's `animate-pulse`,
 * which is neutralized by the global reduced-motion CSS guard. Decorative, so
 * hidden from assistive tech.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={['rounded-card bg-muted animate-pulse', className].filter(Boolean).join(' ')}
    />
  );
}
