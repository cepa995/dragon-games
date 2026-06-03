import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { confirmSubscription, subscribeEmail, unsubscribe } from '@/lib/newsletter';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.newsletterSubscriber.deleteMany();
}

describe('newsletter double opt-in (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('records an unconfirmed subscriber with consent metadata', async () => {
    const res = await subscribeEmail('a@example.com', 'home', '1.2.3.4', 'sr');
    expect(res).toEqual({ ok: true, already: false });

    const sub = await prisma.newsletterSubscriber.findUnique({ where: { email: 'a@example.com' } });
    expect(sub).toBeTruthy();
    expect(sub!.confirmedAt).toBeNull();
    expect(sub!.confirmToken).toBeTruthy();
    expect(sub!.unsubscribeToken).toBeTruthy();
    expect(sub!.source).toBe('home');
    expect(sub!.consentIp).toBe('1.2.3.4');
    expect(sub!.consentAt).toBeInstanceOf(Date);
  });

  it('confirms via the token and clears it', async () => {
    await subscribeEmail('b@example.com', 'home', null, 'en');
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { email: 'b@example.com' } });

    const res = await confirmSubscription(sub!.confirmToken!);
    expect(res.ok).toBe(true);

    const after = await prisma.newsletterSubscriber.findUnique({
      where: { email: 'b@example.com' },
    });
    expect(after!.confirmedAt).toBeInstanceOf(Date);
    expect(after!.confirmToken).toBeNull();
  });

  it('rejects an invalid confirm token', async () => {
    expect((await confirmSubscription('nope')).ok).toBe(false);
  });

  it('leaves an already-confirmed address untouched (no duplicate)', async () => {
    await subscribeEmail('c@example.com', 'home', null, 'sr');
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { email: 'c@example.com' } });
    await confirmSubscription(sub!.confirmToken!);

    const res = await subscribeEmail('c@example.com', 'footer', null, 'sr');
    expect(res).toEqual({ ok: true, already: true });

    const count = await prisma.newsletterSubscriber.count({ where: { email: 'c@example.com' } });
    expect(count).toBe(1);
  });

  it('refreshes the token when re-subscribing an unconfirmed address', async () => {
    await subscribeEmail('d@example.com', 'home', null, 'sr');
    const first = await prisma.newsletterSubscriber.findUnique({
      where: { email: 'd@example.com' },
    });

    await subscribeEmail('d@example.com', 'home', null, 'sr');
    const second = await prisma.newsletterSubscriber.findUnique({
      where: { email: 'd@example.com' },
    });

    expect(second!.confirmToken).toBeTruthy();
    expect(second!.confirmToken).not.toBe(first!.confirmToken);
  });

  it('unsubscribes by token', async () => {
    await subscribeEmail('e@example.com', 'home', null, 'sr');
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { email: 'e@example.com' } });

    const res = await unsubscribe(sub!.unsubscribeToken);
    expect(res.ok).toBe(true);
    expect(
      await prisma.newsletterSubscriber.findUnique({ where: { email: 'e@example.com' } }),
    ).toBeNull();
  });

  it('rejects an invalid unsubscribe token', async () => {
    expect((await unsubscribe('nope')).ok).toBe(false);
  });
});
