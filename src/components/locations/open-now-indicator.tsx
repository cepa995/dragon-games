'use client';

import { useEffect, useState } from 'react';
import { isOpenNow, type WeeklyHours } from '@/lib/datetime';

/**
 * Live "Open now / Closed" badge (SRS FR-3.3). The status is computed on the
 * server (`initialOpen`) so the first client render matches and hydration is
 * stable, then re-evaluated every minute in the browser so the indicator stays
 * current without a page reload. `isOpenNow` is timezone-aware (Europe/Belgrade).
 */
export function OpenNowIndicator({
  weekly,
  initialOpen,
  openLabel,
  closedLabel,
  className,
}: {
  weekly: WeeklyHours;
  initialOpen: boolean;
  openLabel: string;
  closedLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    const tick = () => setOpen(isOpenNow(weekly));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [weekly]);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${className ?? ''}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`size-2 rounded-full ${
          open ? 'bg-success shadow-success shadow-[0_0_8px]' : 'bg-muted-foreground'
        }`}
      />
      <span className={open ? 'text-success' : 'text-muted-foreground'}>
        {open ? openLabel : closedLabel}
      </span>
    </span>
  );
}
