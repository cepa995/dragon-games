import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, getNextTheme, THEMES } from './theme';

describe('theme helpers', () => {
  it('defaults to dark (tavern at night)', () => {
    expect(DEFAULT_THEME).toBe('dark');
    expect(THEMES).toContain('dark');
    expect(THEMES).toContain('light');
  });

  it('toggles between dark and light', () => {
    expect(getNextTheme('dark')).toBe('light');
    expect(getNextTheme('light')).toBe('dark');
  });

  it('falls back to light from an unknown/undefined current theme', () => {
    expect(getNextTheme(undefined)).toBe('light');
    expect(getNextTheme(null)).toBe('light');
    expect(getNextTheme('sepia')).toBe('light');
  });
});
