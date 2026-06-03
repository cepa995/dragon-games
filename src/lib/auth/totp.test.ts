import { authenticator } from 'otplib';
import { describe, expect, it } from 'vitest';
import { generateRecoveryCodes, generateTotpSecret, hashRecoveryCode, verifyTotp } from './totp';

describe('TOTP', () => {
  it('verifies a freshly generated code and rejects garbage', () => {
    const secret = generateTotpSecret();
    const code = authenticator.generate(secret);
    expect(verifyTotp(code, secret)).toBe(true);
    expect(verifyTotp('not-numeric', secret)).toBe(false);
    expect(verifyTotp(code, generateTotpSecret())).toBe(false);
  });
});

describe('recovery codes', () => {
  it('generates the requested count in the expected format', () => {
    const codes = generateRecoveryCodes(10);
    expect(codes).toHaveLength(10);
    expect(new Set(codes).size).toBe(10);
    for (const code of codes) {
      expect(code).toMatch(/^[0-9a-f]{5}-[0-9a-f]{5}$/);
    }
  });

  it('hashes normalizing dashes and case', () => {
    expect(hashRecoveryCode('ABCDE-12345')).toBe(hashRecoveryCode('abcde12345'));
    expect(hashRecoveryCode('abcde-12345')).toMatch(/^[0-9a-f]{64}$/);
  });
});
