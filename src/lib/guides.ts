import { prisma } from '@/lib/prisma';

/** Supported guide games — keys match `TCGS` and the `guides.games.*` messages. */
export const GUIDE_GAMES = ['mtg', 'pokemon', 'yugioh', 'riftbound'] as const;
export type GuideGame = (typeof GUIDE_GAMES)[number];

export function isGuideGame(value: string): value is GuideGame {
  return (GUIDE_GAMES as readonly string[]).includes(value);
}

export type GuideCard = { src: string; w: number; h: number; label: string };

/**
 * Hero card art per game. MTG shows the five colors of Magic with real cards
 * (sourced via Scryfall); the others use a single signature card for now.
 */
export const GAME_CARDS: Record<GuideGame, GuideCard[]> = {
  mtg: [
    { src: '/images/guides/mtg/w-serra-angel.jpg', w: 488, h: 680, label: 'Serra Angel' },
    { src: '/images/guides/mtg/u-counterspell.jpg', w: 488, h: 680, label: 'Counterspell' },
    {
      src: '/images/guides/mtg/b-vampire-nighthawk.jpg',
      w: 488,
      h: 680,
      label: 'Vampire Nighthawk',
    },
    { src: '/images/guides/mtg/r-lightning-bolt.jpg', w: 488, h: 680, label: 'Lightning Bolt' },
    { src: '/images/guides/mtg/g-llanowar-elves.jpg', w: 488, h: 680, label: 'Llanowar Elves' },
  ],
  pokemon: [
    { src: '/images/hero-cards/pokemon-charizard.png', w: 733, h: 1024, label: 'Charizard' },
  ],
  yugioh: [{ src: '/images/hero-cards/ygo-slifer.jpg', w: 813, h: 1185, label: 'Slifer' }],
  riftbound: [
    {
      src: '/images/hero-cards/riftbound-elder-dragon.webp',
      w: 437,
      h: 610,
      label: 'Elder Dragon',
    },
  ],
};

// Recommended starter products per game (by slug). The catalog/admin (M5/M8)
// will let staff curate these; for now they map to the seeded starters.
const STARTER_SLUGS: Record<GuideGame, string[]> = {
  mtg: ['mtg-foundations-play-booster-box'],
  pokemon: ['pokemon-151-elite-trainer-box'],
  yugioh: ['yugioh-age-of-overlord-booster-box'],
  riftbound: ['riftbound-origins-starter-deck'],
};

export type StarterProduct = {
  id: string;
  slug: string;
  nameSr: string;
  nameEn: string | null;
  priceRsd: number;
  image: string | null;
};

/** Fetch the recommended starter products for a guide game (SRS FR-6.2). */
export async function starterProducts(game: GuideGame): Promise<StarterProduct[]> {
  const slugs = STARTER_SLUGS[game];
  if (slugs.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: 'PUBLISHED' },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    nameSr: p.nameSr,
    nameEn: p.nameEn,
    priceRsd: p.priceRsd,
    image: p.images[0]?.url ?? null,
  }));
}
