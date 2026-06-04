import { ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';
import { formatRsd } from '@/lib/format';
import type { StarterProduct } from '@/lib/guides';

/** Recommended-starter card linking into the catalog (SRS FR-6.2). */
export function StarterProductCard({
  product,
  locale,
  ctaLabel,
}: {
  product: StarterProduct;
  locale: string;
  ctaLabel: string;
}) {
  const name = locale === 'en' && product.nameEn ? product.nameEn : product.nameSr;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-hero border-border bg-surface hover:border-accent/40 flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1"
    >
      <div className="bg-muted relative aspect-[4/5] overflow-hidden">
        <SmartImage
          src={product.image}
          alt={name}
          sizes="(max-width: 640px) 100vw, 25vw"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="line-clamp-2 text-sm font-medium">{name}</p>
        <p className="text-accent text-lg font-bold">{formatRsd(product.priceRsd, locale)}</p>
        <span className="text-accent mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold">
          {ctaLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
