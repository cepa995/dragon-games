import { prisma } from '@/lib/prisma';

/** Toggle a product in the user's favorites. Returns the new state. */
export async function toggleFavorite(
  userId: string,
  productId: string,
): Promise<{ favorited: boolean }> {
  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId, productId } });
  return { favorited: true };
}

export async function isFavorite(userId: string, productId: string): Promise<boolean> {
  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return Boolean(existing);
}

export async function listFavoriteProductIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { productId: true },
  });
  return favorites.map((f) => f.productId);
}

export async function listFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        include: { images: { where: { isPrimary: true }, take: 1 } },
      },
    },
  });
}
