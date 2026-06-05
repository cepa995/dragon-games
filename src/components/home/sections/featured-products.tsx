import { getTranslations } from 'next-intl/server';
import { formatRsd } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { STOCK_BADGE_CLASS, stockStatus } from '@/lib/product';
import { TCGS } from '@/lib/tcg';
import { HoloProductCard, type HoloProduct } from './holo-product-card';
import { Section } from './section';

function gameAccent(label?: string | null): string {
  return TCGS.find((g) => g.label === label)?.accent ?? 'var(--color-accent)';
}

export async function FeaturedProducts({ locale }: { locale: string }) {
  const t = await getTranslations('home.featuredProducts');
  const tProduct = await getTranslations('product');

  const products = await prisma.product.findMany({
    where: { featured: true, status: 'PUBLISHED' },
    orderBy: [{ popularityScore: 'desc' }, { createdAt: 'desc' }],
    take: 8,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      attributes: { where: { key: 'game' }, take: 1 },
    },
  });

  if (products.length === 0) {
    return (
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="rounded-hero border-border text-muted-foreground border border-dashed p-10 text-center">
          {t('empty')}
        </div>
      </Section>
    );
  }

  const items: HoloProduct[] = products.map((p) => {
    const attr = p.attributes[0];
    const status = stockStatus(p);
    return {
      id: p.id,
      href: `/product/${p.slug}`,
      image: p.images[0]?.url,
      name: locale === 'en' && p.nameEn ? p.nameEn : p.nameSr,
      price: formatRsd(p.priceRsd, locale),
      game: attr ? (locale === 'en' && attr.valueEn ? attr.valueEn : attr.valueSr) : null,
      accent: gameAccent(attr?.valueSr),
      statusLabel: tProduct(status),
      statusClass: STOCK_BADGE_CLASS[status],
    };
  });

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      actionHref="/catalog"
      actionLabel={t('viewAll')}
    >
      <div className="relative">
        {/* Atmospheric "vault" glows behind the cards */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-10 left-1/4 size-80 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'color-mix(in oklch, var(--color-tcg-mtg) 12%, transparent)' }}
          />
          <div
            className="absolute right-1/4 bottom-0 size-80 rounded-full blur-3xl"
            style={{ background: 'color-mix(in oklch, var(--color-tcg-yugioh) 12%, transparent)' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {items.map((product) => (
            <HoloProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Section>
  );
}
