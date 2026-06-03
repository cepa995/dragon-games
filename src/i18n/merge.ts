export type Messages = Record<string, unknown>;

/**
 * Deep-merge `override` onto `base`. Used for the EN→SR fallback: Serbian is the
 * base, so any key missing in another locale resolves to its Serbian value
 * (SRS FR-26.6 / NFR-9.5).
 */
export function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function isPlainObject(value: unknown): value is Messages {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
