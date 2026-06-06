import type { WeeklyHours } from './datetime';
import { prisma } from './prisma';

/**
 * Business profile (address, hours, contact) backing the home Locations
 * preview, the Locations page and the footer. Values live in the
 * `business.info` / `business.hours` settings (admin-editable in M8); this
 * module reads them with a safe fallback so the public site always renders.
 *
 * Dragon Games currently operates a single venue — the shop/club at Kralja
 * Aleksandra 4 (the former Stražilovska 3 shop is closed).
 */

export type BusinessLocation = { key: string; address: string };

export type Business = {
  name: string;
  email?: string;
  phone?: string;
  viber?: string;
  social?: { facebook?: string; instagram?: string };
  locations: BusinessLocation[];
  hours: { timezone: string; weekly: WeeklyHours };
};

type BusinessInfoSetting = {
  name?: string;
  email?: string;
  phone?: string;
  viber?: string;
  social?: { facebook?: string; instagram?: string };
  locations?: BusinessLocation[];
};

type BusinessHoursSetting = { timezone?: string; weekly?: WeeklyHours };

/** Wed–Sun 15:00–21:00, Europe/Belgrade (SRS §2.1). 0=Sun … 6=Sat. */
const FALLBACK_WEEKLY: WeeklyHours = {
  '0': { open: '15:00', close: '21:00' },
  '3': { open: '15:00', close: '21:00' },
  '4': { open: '15:00', close: '21:00' },
  '5': { open: '15:00', close: '21:00' },
  '6': { open: '15:00', close: '21:00' },
};

export const FALLBACK_BUSINESS: Business = {
  name: 'Dragon Games',
  email: 'info@dragon.rs',
  phone: '063 624 038',
  viber: '063624038',
  social: {
    facebook: 'https://facebook.com/klubdragonnovisad',
    instagram: 'https://instagram.com/dragon_novi_sad',
  },
  locations: [{ key: 'shop', address: 'Kralja Aleksandra 4, Novi Sad' }],
  hours: { timezone: 'Europe/Belgrade', weekly: FALLBACK_WEEKLY },
};

/**
 * Merge the raw `business.info` / `business.hours` setting values onto the
 * fallback. Pure (no I/O) so it can be unit-tested; `getBusiness` wraps it
 * around Prisma.
 */
export function normalizeBusiness(
  info: BusinessInfoSetting | null | undefined,
  hours: BusinessHoursSetting | null | undefined,
): Business {
  const locations =
    info?.locations && info.locations.length > 0 ? info.locations : FALLBACK_BUSINESS.locations;
  return {
    name: info?.name ?? FALLBACK_BUSINESS.name,
    email: info?.email ?? FALLBACK_BUSINESS.email,
    phone: info?.phone ?? FALLBACK_BUSINESS.phone,
    viber: info?.viber ?? FALLBACK_BUSINESS.viber,
    social: info?.social ?? FALLBACK_BUSINESS.social,
    locations,
    hours: {
      timezone: hours?.timezone ?? FALLBACK_BUSINESS.hours.timezone,
      weekly:
        hours?.weekly && Object.keys(hours.weekly).length > 0
          ? hours.weekly
          : FALLBACK_BUSINESS.hours.weekly,
    },
  };
}

/** Read the business profile from settings, falling back to sane defaults. */
export async function getBusiness(): Promise<Business> {
  const [infoSetting, hoursSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'business.info' } }),
    prisma.setting.findUnique({ where: { key: 'business.hours' } }),
  ]);
  return normalizeBusiness(
    infoSetting?.value as BusinessInfoSetting | undefined,
    hoursSetting?.value as BusinessHoursSetting | undefined,
  );
}

/** Serbian mobile number to E.164, e.g. "063 624 038" → "+38163624038". */
function toE164(number: string): string {
  return `+381${number.replace(/\D/g, '').replace(/^0/, '')}`;
}

/** Key-free Google Maps embed for an address query (SRS FR-3.2). */
export function mapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** "Get directions" deep link to the address (SRS FR-3.2). */
export function directionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/** Viber chat deep link for a Serbian number (SRS FR-3.2). */
export function viberUrl(number: string): string {
  return `viber://chat?number=${encodeURIComponent(toE164(number))}`;
}

/** `tel:` link for a Serbian number. */
export function telUrl(number: string): string {
  return `tel:${toE164(number)}`;
}
