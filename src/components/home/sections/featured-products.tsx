import { getTranslations } from 'next-intl/server';
import { FavoriteButton } from '@/components/catalog/favorite-button';
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
        <div className="rounded-hero border-border text-muted-foreground border border-dashed p-10 text-center">
          {t('empty')}
        </div>
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
      <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map((product) => {
          const name = locale === 'en' && product.nameEn ? product.nameEn : product.nameSr;
          const status = stockStatus(product);
          return (
            <div
              key={product.id}
              className="group rounded-hero border-border bg-surface hover:border-accent/40 relative w-[62vw] shrink-0 snap-start overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_color-mix(in_oklch,var(--color-accent)_55%,transparent)] sm:w-auto"
            >
              <Link href={`/product/${product.slug}`} aria-label={name}>
                <div className="bg-muted relative aspect-[4/5] overflow-hidden">
                  <SmartImage
                    src={product.images[0]?.url}
                    alt={name}
                    sizes="(max-width: 640px) 62vw, 25vw"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${STOCK_BADGE_CLASS[status]}`}
                  >
                    {tProduct(status)}
                  </span>
                  <div className="from-surface absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent" />
                </div>
                <div className="space-y-1 p-4">
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">{name}</p>
                  <p className="text-accent text-lg font-bold">
                    {formatRsd(product.priceRsd, locale)}
                  </p>
                </div>
              </Link>
              <div className="absolute top-2 right-2">
                <FavoriteButton productId={product.id} label={name} />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
