import type { TournamentGame } from '@/generated/prisma';

/**
 * Supported TCGs — display metadata shared across the site. Drop official logos
 * (transparent PNG/SVG) at the `logo` paths; until then the `glyph` is shown.
 */
export const TCGS = [
  {
    key: 'mtg',
    label: 'Magic: The Gathering',
    slug: 'magic-the-gathering',
    accent: 'var(--color-tcg-mtg)',
    glyph: '✦',
    logo: '/images/tcg/mtg.png',
  },
  {
    key: 'pokemon',
    label: 'Pokémon',
    slug: 'pokemon',
    accent: 'var(--color-tcg-pokemon)',
    glyph: '◓',
    logo: '/images/tcg/pokemon.png',
  },
  {
    key: 'yugioh',
    label: 'Yu-Gi-Oh!',
    slug: 'yu-gi-oh',
    accent: 'var(--color-tcg-yugioh)',
    glyph: '✪',
    logo: '/images/tcg/yugioh.png',
  },
  {
    key: 'riftbound',
    label: 'Riftbound',
    slug: 'riftbound',
    accent: 'var(--color-tcg-riftbound)',
    glyph: '◈',
    logo: '/images/tcg/riftbound.png',
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
