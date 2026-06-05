import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { FavoriteButton } from '@/components/catalog/favorite-button';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';
import { formatRsd } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { STOCK_BADGE_CLASS, stockStatus } from '@/lib/product';
import { TCGS } from '@/lib/tcg';
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
    take: 7,
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

  const localize = (p: (typeof products)[number]) => {
    const name = locale === 'en' && p.nameEn ? p.nameEn : p.nameSr;
    const desc = locale === 'en' && p.descEn ? p.descEn : p.descSr;
    const attr = p.attributes[0];
    const game = attr ? (locale === 'en' && attr.valueEn ? attr.valueEn : attr.valueSr) : null;
    return { name, desc, game, accent: gameAccent(attr?.valueSr), status: stockStatus(p) };
  };

  const [spotlight, ...rest] = products;
  const s = spotlight!;
  const sl = localize(s);

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      actionHref="/catalog"
      actionLabel={t('viewAll')}
    >
      <div className="space-y-6">
        {/* Spotlight product */}
        <div
          className="rounded-hero border-border bg-surface group relative grid overflow-hidden border md:grid-cols-2"
          style={{ ['--accent' as string]: sl.accent } as React.CSSProperties}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(90% 120% at 0% 0%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 55%)',
            }}
          />
          <Link
            href={`/product/${s.slug}`}
            aria-label={sl.name}
            className="bg-muted relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[360px]"
          >
            <SmartImage
              src={s.images[0]?.url}
              alt={sl.name}
              sizes="(max-width: 768px) 100vw, 45vw"
              accent={sl.accent}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span
              className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium ${STOCK_BADGE_CLASS[sl.status]}`}
            >
              {tProduct(sl.status)}
            </span>
          </Link>

          <div className="relative flex flex-col justify-center gap-4 p-7 sm:p-9">
            {sl.game && (
              <span
                className="w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  color: 'var(--accent)',
                  background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                }}
              >
                {sl.game}
              </span>
            )}
            <Link href={`/product/${s.slug}`}>
              <h3 className="font-display text-2xl leading-snug sm:text-3xl">{sl.name}</h3>
            </Link>
            {sl.desc && <p className="text-muted-foreground line-clamp-3 max-w-md">{sl.desc}</p>}
            <p className="text-accent text-3xl font-bold">{formatRsd(s.priceRsd, locale)}</p>
            <div className="mt-1 flex items-center gap-3">
              <Link
                href={`/product/${s.slug}`}
                className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                {t('viewProduct')}
                <ArrowRight className="size-4" />
              </Link>
              <FavoriteButton productId={s.id} label={sl.name} />
            </div>
          </div>
        </div>

        {/* Supporting grid */}
        {rest.length > 0 && (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {rest.map((product) => {
              const p = localize(product);
              return (
                <div
                  key={product.id}
                  className="group rounded-hero border-border bg-surface relative w-[60vw] shrink-0 snap-start overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_color-mix(in_oklch,var(--accent)_55%,transparent)] sm:w-auto"
                  style={{ ['--accent' as string]: p.accent } as React.CSSProperties}
                >
                  <Link href={`/product/${product.slug}`} aria-label={p.name}>
                    <div className="bg-muted relative aspect-[4/5] overflow-hidden">
                      <SmartImage
                        src={product.images[0]?.url}
                        alt={p.name}
                        sizes="(max-width: 640px) 60vw, 30vw"
                        accent={p.accent}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${STOCK_BADGE_CLASS[p.status]}`}
                      >
                        {tProduct(p.status)}
                      </span>
                      <div className="from-surface absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent" />
                    </div>
                    <div className="space-y-1 p-4">
                      {p.game && (
                        <span
                          className="text-[11px] font-semibold tracking-wide uppercase"
                          style={{ color: 'var(--accent)' }}
                        >
                          {p.game}
                        </span>
                      )}
                      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">{p.name}</p>
                      <p className="text-accent text-lg font-bold">
                        {formatRsd(product.priceRsd, locale)}
                      </p>
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton productId={product.id} label={p.name} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
