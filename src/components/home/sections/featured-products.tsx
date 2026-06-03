import { getTranslations } from 'next-intl/server';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';
import { formatRsd } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { STOCK_BADGE_CLASS, stockStatus } from '@/lib/product';
import { Section } from './section';

export async function FeaturedProducts({ locale }: { locale: string }) {
  const t = await getTranslations('home.featuredProducts');
  const tProduct = await getTranslations('product');

  const products = await prisma.product.findMany({
    where: { featured: true, status: 'PUBLISHED' },
    orderBy: [{ popularityScore: 'desc' }, { createdAt: 'desc' }],
    take: 8,
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  if (products.length === 0) {
    return (
      <Section title={t('title')} subtitle={t('subtitle')}>
        <p className="text-muted-foreground">{t('empty')}</p>
      </Section>
    );
  }

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      actionHref="/catalog"
      actionLabel={t('viewAll')}
    >
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map((product) => {
          const name = locale === 'en' && product.nameEn ? product.nameEn : product.nameSr;
          const status = stockStatus(product);
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group rounded-hero border-border bg-surface w-[60vw] shrink-0 snap-start overflow-hidden border transition-transform hover:-translate-y-1 sm:w-auto"
            >
              <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={product.images[0]?.url}
                  alt={name}
                  sizes="(max-width: 640px) 60vw, 25vw"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium ${STOCK_BADGE_CLASS[status]}`}
                >
                  {tProduct(status)}
                </span>
              </div>
              <div className="space-y-1 p-4">
                <p className="line-clamp-2 text-sm font-medium">{name}</p>
                <p className="text-accent font-semibold">{formatRsd(product.priceRsd, locale)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
