import { describe, expect, it } from 'vitest';
import { passwordSchema, registerSchema } from './schemas';

describe('auth schemas', () => {
  it('accepts a valid registration and normalizes the email', () => {
    const result = registerSchema.parse({
      name: '  Marko  ',
      email: 'Marko@Example.COM',
      password: 'longenough',
    });
    expect(result.email).toBe('marko@example.com');
    expect(result.name).toBe('Marko');
  });

  it('rejects short passwords and invalid emails', () => {
    expect(passwordSchema.safeParse('short').success).toBe(false);
    expect(
      registerSchema.safeParse({ name: 'A', email: 'nope', password: 'longenough' }).success,
    ).toBe(false);
  });
});
