import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/prisma';

/**
 * Exercises the real schema against the test database: confirms migrations are
 * applied, the on-hand/reserved stock defaults hold (FR-12.5), relations
 * round-trip, and unique constraints are enforced (#2 acceptance).
 */
describe('Prisma schema (integration)', () => {
  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  it('round-trips a category + product with default stock semantics', async () => {
    const category = await prisma.category.create({
      data: { slug: 'int-tcg', nameSr: 'TCG' },
    });

    const product = await prisma.product.create({
      data: {
        sku: 'INT-1',
        slug: 'int-product-1',
        nameSr: 'Proizvod',
        priceRsd: 1500,
        categoryId: category.id,
      },
    });

    expect(product.stockOnHand).toBe(0);
    expect(product.stockReserved).toBe(0);
    expect(product.status).toBe('DRAFT');

    const found = await prisma.product.findUnique({
      where: { sku: 'INT-1' },
      include: { category: true },
    });
    expect(found?.category?.slug).toBe('int-tcg');
  });

  it('enforces the unique slug constraint', async () => {
    await prisma.category.create({ data: { slug: 'int-dup', nameSr: 'A' } });
    await expect(
      prisma.category.create({ data: { slug: 'int-dup', nameSr: 'B' } }),
    ).rejects.toThrow();
  });

  it('supports the self-referential category tree', async () => {
    const parent = await prisma.category.create({ data: { slug: 'int-parent', nameSr: 'Parent' } });
    const child = await prisma.category.create({
      data: { slug: 'int-child', nameSr: 'Child', parentId: parent.id },
    });

    const withChildren = await prisma.category.findUnique({
      where: { id: parent.id },
      include: { children: true },
    });
    expect(withChildren?.children.map((c) => c.id)).toContain(child.id);
  });
});
