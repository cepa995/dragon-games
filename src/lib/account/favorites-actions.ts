'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/session';
import { toggleFavorite } from './favorites';

export interface ToggleFavoriteResult {
  favorited?: boolean;
  needsAuth?: boolean;
}

export async function toggleFavoriteAction(productId: string): Promise<ToggleFavoriteResult> {
  const user = await getCurrentUser();
  if (!user) return { needsAuth: true };

  const result = await toggleFavorite(user.id, productId);
  revalidatePath('/', 'layout');
  return result;
}
