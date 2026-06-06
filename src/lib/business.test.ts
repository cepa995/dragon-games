import { describe, expect, it } from 'vitest';
import {
  directionsUrl,
  FALLBACK_BUSINESS,
  mapEmbedUrl,
  normalizeBusiness,
  telUrl,
  viberUrl,
} from './business';

describe('normalizeBusiness', () => {
  it('falls back to defaults when settings are missing', () => {
    const b = normalizeBusiness(null, null);
    expect(b.name).toBe('Dragon Games');
    expect(b.locations[0]!.address).toContain('Kralja Aleksandra 4');
    expect(b.hours.timezone).toBe('Europe/Belgrade');
    expect(Object.keys(b.hours.weekly)).toContain('3');
  });

  it('merges provided info over the fallback', () => {
    const b = normalizeBusiness(
      { name: 'X', phone: '011 222 333', locations: [{ key: 'shop', address: 'Test 1' }] },
      { timezone: 'Europe/Belgrade', weekly: { '1': { open: '10:00', close: '18:00' } } },
    );
    expect(b.name).toBe('X');
    expect(b.phone).toBe('011 222 333');
    expect(b.locations[0]!.address).toBe('Test 1');
    expect(b.hours.weekly['1']!.open).toBe('10:00');
    // Fields not provided still fall back.
    expect(b.email).toBe(FALLBACK_BUSINESS.email);
  });

  it('ignores empty locations/weekly and keeps the fallback', () => {
    const b = normalizeBusiness({ locations: [] }, { weekly: {} });
    expect(b.locations).toEqual(FALLBACK_BUSINESS.locations);
    expect(b.hours.weekly).toEqual(FALLBACK_BUSINESS.hours.weekly);
  });
});

describe('url helpers', () => {
  it('builds a key-free Google Maps embed url', () => {
    expect(mapEmbedUrl('Kralja Aleksandra 4, Novi Sad')).toBe(
      'https://www.google.com/maps?q=Kralja%20Aleksandra%204%2C%20Novi%20Sad&output=embed',
    );
  });

  it('builds a directions deep link to the destination', () => {
    expect(directionsUrl('Kralja Aleksandra 4')).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=Kralja%20Aleksandra%204',
    );
  });

  it('normalizes Serbian numbers to E.164 for viber and tel', () => {
    expect(viberUrl('063 624 038')).toBe('viber://chat?number=%2B38163624038');
    expect(telUrl('063624038')).toBe('tel:+38163624038');
  });
});
