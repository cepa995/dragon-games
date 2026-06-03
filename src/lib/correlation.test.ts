import { afterEach, describe, expect, it, vi } from 'vitest';
import { CORRELATION_HEADER, generateCorrelationId, getCorrelationId } from './correlation';

const headersMock = vi.hoisted(() => vi.fn());
vi.mock('next/headers', () => ({ headers: headersMock }));

afterEach(() => {
  headersMock.mockReset();
});

describe('generateCorrelationId', () => {
  it('returns a unique UUID each call', () => {
    const a = generateCorrelationId();
    const b = generateCorrelationId();
    expect(a).toMatch(/^[0-9a-f-]{36}$/i);
    expect(a).not.toBe(b);
  });
});

describe('getCorrelationId', () => {
  it('reads the id set by middleware', async () => {
    headersMock.mockResolvedValue(new Map([[CORRELATION_HEADER, 'req-123']]));
    await expect(getCorrelationId()).resolves.toBe('req-123');
  });

  it('falls back to a generated id when the header is absent', async () => {
    headersMock.mockResolvedValue(new Map());
    const id = await getCorrelationId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
