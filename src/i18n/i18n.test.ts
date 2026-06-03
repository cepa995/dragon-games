import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import sr from '../../messages/sr.json';
import { deepMerge } from './merge';

describe('deepMerge (EN→SR fallback)', () => {
  it('overrides base values with the target locale', () => {
    const merged = deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 9 } });
    expect(merged).toEqual({ a: { x: 1, y: 9 } });
  });

  it('keeps the Serbian value when a key is missing in the override', () => {
    const base = { nav: { catalog: 'Katalog', onlySr: 'Samo SR' } };
    const override = { nav: { catalog: 'Catalog' } };
    const merged = deepMerge(base, override) as typeof base;
    expect(merged.nav.catalog).toBe('Catalog');
    expect(merged.nav.onlySr).toBe('Samo SR');
  });
});

describe('Serbian pluralization (NFR-9.4)', () => {
  const t = createTranslator({ locale: 'sr', messages: sr });

  it('uses one/few/other forms', () => {
    expect(t('cart.summary', { count: 0 })).toBe('Korpa je prazna');
    expect(t('cart.summary', { count: 1 })).toBe('1 artikal');
    expect(t('cart.summary', { count: 3 })).toBe('3 artikla');
    expect(t('cart.summary', { count: 5 })).toBe('5 artikala');
    expect(t('cart.summary', { count: 21 })).toBe('21 artikal');
  });
});

describe('English pluralization', () => {
  const t = createTranslator({ locale: 'en', messages: en });

  it('uses one/other forms', () => {
    expect(t('cart.summary', { count: 0 })).toBe('Your cart is empty');
    expect(t('cart.summary', { count: 1 })).toBe('1 item');
    expect(t('cart.summary', { count: 4 })).toBe('4 items');
  });
});

describe('message catalogs', () => {
  it('have matching top-level namespaces', () => {
    expect(Object.keys(sr).sort()).toEqual(Object.keys(en).sort());
  });
});
