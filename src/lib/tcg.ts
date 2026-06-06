import type { TournamentGame } from '@/generated/prisma';

/** Supported TCGs — display metadata + branded banner art, shared across the site. */
export const TCGS = [
  {
    key: 'mtg',
    label: 'Magic: The Gathering',
    slug: 'magic-the-gathering',
    accent: 'var(--color-tcg-mtg)',
    glyph: '✦',
    banner: '/images/game-banners/MTG-banner.jpg',
  },
  {
    key: 'pokemon',
    label: 'Pokémon',
    slug: 'pokemon',
    accent: 'var(--color-tcg-pokemon)',
    glyph: '◓',
    banner: '/images/game-banners/Pokemon-banner.webp',
  },
  {
    key: 'yugioh',
    label: 'Yu-Gi-Oh!',
    slug: 'yu-gi-oh',
    accent: 'var(--color-tcg-yugioh)',
    glyph: '✪',
    banner: '/images/game-banners/YuGiOh-banner.jpeg',
  },
  {
    key: 'riftbound',
    label: 'Riftbound',
    slug: 'riftbound',
    accent: 'var(--color-tcg-riftbound)',
    glyph: '◈',
    banner: '/images/game-banners/riftbound-banner.webp',
  },
] as const;

const GAME_META: Record<TournamentGame, { label: string; accent: string }> = {
  MTG: { label: 'Magic: The Gathering', accent: 'var(--color-tcg-mtg)' },
  POKEMON: { label: 'Pokémon', accent: 'var(--color-tcg-pokemon)' },
  YUGIOH: { label: 'Yu-Gi-Oh!', accent: 'var(--color-tcg-yugioh)' },
  RIFTBOUND: { label: 'Riftbound', accent: 'var(--color-tcg-riftbound)' },
  OTHER: { label: 'Other', accent: 'var(--color-muted-foreground)' },
};

export function gameMeta(game: TournamentGame) {
  return GAME_META[game];
}
