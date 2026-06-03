import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { registerUser } from '@/lib/auth/account';
import { isFavorite, listFavorites, toggleFavorite } from '@/lib/account/favorites';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userToken.deleteMany();
  await prisma.user.deleteMany();
}

async function seed() {
  const res = await registerUser({
    name: 'F',
    email: 'fav@test.com',
    password: 'password123',
    locale: 'SR',
  });
  if (!res.ok) throw new Error('register failed');
  const category = await prisma.category.create({ data: { slug: 'fav-cat', nameSr: 'Cat' } });
  const product = await prisma.product.create({
    data: {
      sku: 'FAV-1',
      slug: 'fav-product',
      nameSr: 'Proizvod',
      priceRsd: 1000,
      categoryId: category.id,
    },
  });
  return { userId: res.userId, productId: product.id };
}

describe('favorites (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('toggles a product on and off', async () => {
    const { userId, productId } = await seed();

    expect(await isFavorite(userId, productId)).toBe(false);

    expect(await toggleFavorite(userId, productId)).toEqual({ favorited: true });
    expect(await isFavorite(userId, productId)).toBe(true);

    const favorites = await listFavorites(userId);
    expect(favorites).toHaveLength(1);
    expect(favorites[0]?.product.id).toBe(productId);

    expect(await toggleFavorite(userId, productId)).toEqual({ favorited: false });
    expect(await listFavorites(userId)).toHaveLength(0);
  });
});
