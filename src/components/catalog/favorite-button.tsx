'use client';

import { Heart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { toggleFavoriteAction } from '@/lib/account/favorites-actions';

/**
 * Heart toggle for favoriting a product (FR-11.4 / FR-13.5). Optimistic, and
 * auth-gated: guests are sent to login. Mounted on catalog cards / product
 * detail in M5; also used on the favorites page to remove items.
 */
export function FavoriteButton({
  productId,
  initialFavorited = false,
  label = 'Favorite',
}: {
  productId: string;
  initialFavorited?: boolean;
  label?: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      const previous = favorited;
      setFavorited(!previous); // optimistic
      const result = await toggleFavoriteAction(productId);
      if (result.needsAuth) {
        setFavorited(previous);
        router.push('/login');
        return;
      }
      if (typeof result.favorited === 'boolean') setFavorited(result.favorited);
    });
  }

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={onClick}
      className="text-foreground/70 hover:bg-surface-elevated hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors"
    >
      <Heart className={favorited ? 'fill-destructive text-destructive size-5' : 'size-5'} />
    </button>
  );
}
