import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { registerUser } from '@/lib/auth/account';
import {
  anonymizeExpiredAccounts,
  anonymizeUser,
  DELETION_GRACE_PERIOD_MS,
  exportUserData,
  requestAccountDeletion,
} from '@/lib/account/gdpr';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.userToken.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUser(email: string) {
  const res = await registerUser({ name: 'G', email, password: 'password123', locale: 'SR' });
  if (!res.ok) throw new Error('register failed');
  return res.userId;
}

async function seedData(userId: string) {
  const tag = userId.slice(0, 8);
  const category = await prisma.category.create({ data: { slug: `c-${tag}`, nameSr: 'C' } });
  const product = await prisma.product.create({
    data: {
      sku: `S-${tag}`,
      slug: `p-${tag}`,
      nameSr: 'P',
      priceRsd: 1000,
      categoryId: category.id,
    },
  });
  await prisma.address.create({
    data: { userId, street: 'Ul 1', city: 'NS', postalCode: '21000' },
  });
  await prisma.favorite.create({ data: { userId, productId: product.id } });
  await prisma.order.create({
    data: {
      refNo: `DG-${tag}`,
      userId,
      customerName: 'Pera',
      email: 'pera@test.com',
      phone: '064',
      fulfillmentMethod: 'PICKUP_SHOP',
      paymentMethod: 'CASH_ON_PICKUP',
      items: {
        create: [
          {
            productId: product.id,
            nameSnapshot: 'P',
            skuSnapshot: 'S',
            unitPriceSnapshotRsd: 1000,
            quantity: 1,
          },
        ],
      },
    },
  });
}

describe('GDPR / erasure (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('exports the member data without secrets', async () => {
    const userId = await seedUser('exp@test.com');
    await seedData(userId);
    const data = await exportUserData(userId);

    expect(data.user?.email).toBe('exp@test.com');
    expect(data.user).not.toHaveProperty('passwordHash');
    expect(data.addresses).toHaveLength(1);
    expect(data.orders).toHaveLength(1);
    expect(data.orders[0]?.items).toHaveLength(1);
    expect(data.favorites).toHaveLength(1);
  });

  it('flags the account for deletion and audits it', async () => {
    const userId = await seedUser('del@test.com');
    await requestAccountDeletion(userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.status).toBe('PENDING_DELETION');
    expect(user?.deletionRequestedAt).toBeInstanceOf(Date);
    expect(
      await prisma.auditLog.count({
        where: { entityId: userId, action: 'account.deletion_requested' },
      }),
    ).toBe(1);
  });

  it('anonymizes PII but retains anonymized orders', async () => {
    const userId = await seedUser('anon@test.com');
    await seedData(userId);
    await anonymizeUser(userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.email).toContain('anonimizovano.invalid');
    expect(user?.name).toBeNull();
    expect(user?.passwordHash).toBeNull();
    expect(user?.anonymizedAt).toBeInstanceOf(Date);
    expect(await prisma.address.count({ where: { userId } })).toBe(0);
    expect(await prisma.favorite.count({ where: { userId } })).toBe(0);

    const orders = await prisma.order.findMany({ where: { userId }, include: { items: true } });
    expect(orders).toHaveLength(1);
    expect(orders[0]?.customerName).toBe('Obrisani korisnik');
    expect(orders[0]?.items).toHaveLength(1); // bookkeeping retained
  });

  it('only anonymizes accounts past the grace period', async () => {
    const oldUser = await seedUser('old@test.com');
    const recentUser = await seedUser('recent@test.com');

    await prisma.user.update({
      where: { id: oldUser },
      data: {
        status: 'PENDING_DELETION',
        deletionRequestedAt: new Date(Date.now() - DELETION_GRACE_PERIOD_MS - 1000),
      },
    });
    await requestAccountDeletion(recentUser);

    const processed = await anonymizeExpiredAccounts(new Date());
    expect(processed).toBe(1);
    expect((await prisma.user.findUnique({ where: { id: oldUser } }))?.anonymizedAt).toBeInstanceOf(
      Date,
    );
    expect((await prisma.user.findUnique({ where: { id: recentUser } }))?.anonymizedAt).toBeNull();
  });
});
