import { describe, expect, it } from 'vitest';
import { isOpenNow, relativeDays, type WeeklyHours } from './datetime';

// Wed–Sun 15:00–21:00 (0=Sun … 6=Sat).
const weekly: WeeklyHours = {
  '0': { open: '15:00', close: '21:00' },
  '3': { open: '15:00', close: '21:00' },
  '4': { open: '15:00', close: '21:00' },
  '5': { open: '15:00', close: '21:00' },
  '6': { open: '15:00', close: '21:00' },
};

const at = (iso: string) => new Date(iso);

describe('isOpenNow', () => {
  // 2024-01-03 is a Wednesday; Belgrade is CET (UTC+1) in January.
  it('is open during business hours (Wed 16:00 Belgrade)', () => {
    expect(isOpenNow(weekly, at('2024-01-03T15:00:00Z'))).toBe(true);
  });

  it('is open exactly at the opening minute (15:00 Belgrade)', () => {
    expect(isOpenNow(weekly, at('2024-01-03T14:00:00Z'))).toBe(true);
  });

  it('is closed one minute before opening (14:59 Belgrade)', () => {
    expect(isOpenNow(weekly, at('2024-01-03T13:59:00Z'))).toBe(false);
  });

  it('is open one minute before closing (20:59 Belgrade)', () => {
    expect(isOpenNow(weekly, at('2024-01-03T19:59:00Z'))).toBe(true);
  });

  it('is closed exactly at the closing minute (21:00 Belgrade)', () => {
    expect(isOpenNow(weekly, at('2024-01-03T20:00:00Z'))).toBe(false);
  });

  it('is closed on a non-business day (Monday 16:00)', () => {
    expect(isOpenNow(weekly, at('2024-01-01T15:00:00Z'))).toBe(false);
  });

  it('is closed on Tuesday afternoon', () => {
    expect(isOpenNow(weekly, at('2024-01-02T15:00:00Z'))).toBe(false);
  });

  it('evaluates in Europe/Belgrade, not UTC', () => {
    // 14:30 UTC = 15:30 Belgrade (CET) → open, even though UTC wall time is
    // before the 15:00 opening.
    expect(isOpenNow(weekly, at('2024-01-03T14:30:00Z'))).toBe(true);
  });

  it('handles summer DST (CEST, UTC+2)', () => {
    // 2024-07-03 is a Wednesday. 13:30 UTC = 15:30 CEST → open.
    expect(isOpenNow(weekly, at('2024-07-03T13:30:00Z'))).toBe(true);
    // 12:30 UTC = 14:30 CEST → closed.
    expect(isOpenNow(weekly, at('2024-07-03T12:30:00Z'))).toBe(false);
  });

  it('returns false when no hours are configured', () => {
    expect(isOpenNow(undefined)).toBe(false);
  });
});

describe('relativeDays', () => {
  const now = at('2024-01-03T10:00:00Z');

  it('formats "today" in Serbian', () => {
    expect(relativeDays(at('2024-01-03T18:00:00Z'), 'sr', now)).toMatch(/danas/i);
  });

  it('formats "tomorrow" in English', () => {
    expect(relativeDays(at('2024-01-04T10:00:00Z'), 'en', now)).toMatch(/tomorrow/i);
  });
});
