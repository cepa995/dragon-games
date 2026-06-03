import { authenticator } from 'otplib';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { registerUser } from '@/lib/auth/account';
import { verifyCredentials } from '@/lib/auth/login';
import { beginTwoFactorSetup, confirmTwoFactor } from '@/lib/auth/two-factor';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.recoveryCode.deleteMany();
  await prisma.userToken.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(email: string) {
  const res = await registerUser({ name: 'A', email, password: 'password123', locale: 'SR' });
  if (!res.ok) throw new Error('register failed');
  return res.userId;
}

describe('two-factor authentication (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('enrols 2FA and issues 10 recovery codes', async () => {
    const userId = await createUser('tfa@test.com');
    const { secret } = await beginTwoFactorSetup(userId, 'tfa@test.com');

    // Not active until confirmed.
    let user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.totpEnabledAt).toBeNull();

    const codes = await confirmTwoFactor(userId, authenticator.generate(secret));
    expect(codes).toHaveLength(10);

    user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.totpEnabledAt).toBeInstanceOf(Date);
    expect(await prisma.recoveryCode.count({ where: { userId } })).toBe(10);
  });

  it('rejects confirmation with a wrong code', async () => {
    const userId = await createUser('tfa2@test.com');
    await beginTwoFactorSetup(userId, 'tfa2@test.com');
    expect(await confirmTwoFactor(userId, '000000')).toBeNull();
  });

  it('requires a valid TOTP at login once enabled', async () => {
    const userId = await createUser('tfa3@test.com');
    const { secret } = await beginTwoFactorSetup(userId, 'tfa3@test.com');
    await confirmTwoFactor(userId, authenticator.generate(secret));

    const noCode = await verifyCredentials({ email: 'tfa3@test.com', password: 'password123' });
    expect(noCode).toEqual({ ok: false, reason: 'totp_required' });

    const wrong = await verifyCredentials({
      email: 'tfa3@test.com',
      password: 'password123',
      totp: '000000',
    });
    expect(wrong.ok).toBe(false);

    const good = await verifyCredentials({
      email: 'tfa3@test.com',
      password: 'password123',
      totp: authenticator.generate(secret),
    });
    expect(good.ok).toBe(true);
  });

  it('accepts a single-use recovery code at login', async () => {
    const userId = await createUser('tfa4@test.com');
    const { secret } = await beginTwoFactorSetup(userId, 'tfa4@test.com');
    const codes = await confirmTwoFactor(userId, authenticator.generate(secret));
    const recovery = codes![0];

    const first = await verifyCredentials({
      email: 'tfa4@test.com',
      password: 'password123',
      totp: recovery,
    });
    expect(first.ok).toBe(true);

    // Same recovery code cannot be reused.
    const second = await verifyCredentials({
      email: 'tfa4@test.com',
      password: 'password123',
      totp: recovery,
    });
    expect(second).toEqual({ ok: false, reason: 'totp_invalid' });
  });
});
