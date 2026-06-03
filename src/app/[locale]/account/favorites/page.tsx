import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { FavoriteButton } from '@/components/catalog/favorite-button';
import { Link } from '@/i18n/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listFavorites } from '@/lib/account/favorites';

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return null;

  const favorites = await listFavorites(sessionUser.id);
  const t = await getTranslations('account.favorites');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{t('title')}</h2>

      {favorites.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('empty')}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {favorites.map((fav) => {
            const name =
              locale === 'en' && fav.product.nameEn ? fav.product.nameEn : fav.product.nameSr;
            const image = fav.product.images[0]?.url;
            return (
              <li
                key={fav.id}
                className="rounded-card border-border bg-surface flex items-center gap-3 border p-3"
              >
                <div className="rounded-card bg-muted size-14 shrink-0 overflow-hidden">
                  {image && (
                    <Image
                      src={image}
                      alt=""
                      width={56}
                      height={56}
                      unoptimized
                      className="size-14 object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${fav.product.slug}`}
                    className="hover:text-accent line-clamp-2 font-medium"
                  >
                    {name}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {fav.product.priceRsd.toLocaleString('sr-RS')} RSD
                  </p>
                </div>
                <FavoriteButton productId={fav.product.id} initialFavorited label={t('remove')} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
