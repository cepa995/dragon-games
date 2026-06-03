import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createPasswordReset, registerUser, resetPassword, verifyEmail } from '@/lib/auth/account';
import { verifyPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.userToken.deleteMany();
  await prisma.user.deleteMany();
}

describe('auth account flows (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('registers a user with a hashed password and a verification token', async () => {
    const result = await registerUser({
      name: 'Marko',
      email: 'marko@test.com',
      password: 'password123',
      locale: 'SR',
    });
    expect(result.ok).toBe(true);

    const user = await prisma.user.findUnique({ where: { email: 'marko@test.com' } });
    expect(user?.passwordHash).toBeTruthy();
    expect(user?.passwordHash).not.toBe('password123');
    expect(await verifyPassword(user!.passwordHash!, 'password123')).toBe(true);
    expect(user?.emailVerified).toBeNull();

    const tokens = await prisma.userToken.count({
      where: { userId: user!.id, purpose: 'EMAIL_VERIFICATION' },
    });
    expect(tokens).toBe(1);
  });

  it('rejects a duplicate email', async () => {
    await registerUser({ name: 'A', email: 'dup@test.com', password: 'password123', locale: 'SR' });
    const dup = await registerUser({
      name: 'B',
      email: 'dup@test.com',
      password: 'password123',
      locale: 'SR',
    });
    expect(dup).toEqual({ ok: false, reason: 'email_taken' });
  });

  it('verifies email with a single-use token', async () => {
    const result = await registerUser({
      name: 'V',
      email: 'verify@test.com',
      password: 'password123',
      locale: 'EN',
    });
    if (!result.ok) throw new Error('registration failed');

    expect(await verifyEmail(result.verifyToken)).toBe(true);
    const user = await prisma.user.findUnique({ where: { email: 'verify@test.com' } });
    expect(user?.emailVerified).toBeInstanceOf(Date);

    // Token is consumed — a second attempt fails.
    expect(await verifyEmail(result.verifyToken)).toBe(false);
  });

  it('resets a password with a single-use token', async () => {
    await registerUser({
      name: 'R',
      email: 'reset@test.com',
      password: 'oldpassword1',
      locale: 'SR',
    });

    const token = await createPasswordReset('reset@test.com');
    expect(token).toBeTruthy();

    expect(await resetPassword(token!, 'newpassword2')).toBe(true);
    const user = await prisma.user.findUnique({ where: { email: 'reset@test.com' } });
    expect(await verifyPassword(user!.passwordHash!, 'newpassword2')).toBe(true);
    expect(await verifyPassword(user!.passwordHash!, 'oldpassword1')).toBe(false);

    // Single use.
    expect(await resetPassword(token!, 'another3')).toBe(false);
  });

  it('does not reveal whether an email exists on reset request', async () => {
    expect(await createPasswordReset('nobody@test.com')).toBeNull();
  });
});
