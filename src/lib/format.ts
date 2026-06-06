function intlLocale(locale: string): string {
  // Serbian formatting in Latin script (NFR-9.2); English as en-GB.
  return locale === 'en' ? 'en-GB' : 'sr-Latn-RS';
}

/** Price in whole RSD, e.g. "18.500 RSD". */
export function formatRsd(amount: number, locale: string): string {
  const n = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 0 }).format(amount);
  return `${n} RSD`;
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function dateParts(date: Date, locale: string) {
  const l = intlLocale(locale);
  return {
    day: new Intl.DateTimeFormat(l, { day: 'numeric' }).format(date),
    month: new Intl.DateTimeFormat(l, { month: 'short' }).format(date).replace('.', ''),
    weekday: new Intl.DateTimeFormat(l, { weekday: 'long' }).format(date),
    time: new Intl.DateTimeFormat(l, { hour: '2-digit', minute: '2-digit' }).format(date),
  };
}

export function formatDateTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
