function intlLocale(locale: string): string {
  return locale === 'en' ? 'en' : 'sr-Latn';
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Localized relative day, e.g. "danas" / "sutra" / "za 3 dana" / "in 3 days". */
export function relativeDays(date: Date, locale: string, now: Date = new Date()): string {
  const days = Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
  return new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' }).format(days, 'day');
}

export type WeeklyHours = Record<string, { open: string; close: string }>;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Whether the club is open now, given weekly hours, evaluated in Europe/Belgrade. */
export function isOpenNow(weekly: WeeklyHours | undefined, now: Date = new Date()): boolean {
  if (!weekly) return false;
  const local = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }));
  const slot = weekly[String(local.getDay())];
  if (!slot) return false;
  const minutes = local.getHours() * 60 + local.getMinutes();
  return minutes >= toMinutes(slot.open) && minutes < toMinutes(slot.close);
}
