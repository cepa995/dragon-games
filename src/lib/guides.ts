import { prisma } from '@/lib/prisma';

/** Supported guide games — keys match `TCGS` and the `guides.games.*` messages. */
export const GUIDE_GAMES = ['mtg', 'pokemon', 'yugioh', 'riftbound'] as const;
export type GuideGame = (typeof GUIDE_GAMES)[number];

export function isGuideGame(value: string): value is GuideGame {
  return (GUIDE_GAMES as readonly string[]).includes(value);
}

/** Hero/overview card art per game (reuses the home hero-card imagery). */
export const GAME_ART: Record<GuideGame, { src: string; w: number; h: number }> = {
  mtg: { src: '/images/hero-cards/mtg-dragon.jpg', w: 488, h: 680 },
  pokemon: { src: '/images/hero-cards/pokemon-charizard.png', w: 733, h: 1024 },
  yugioh: { src: '/images/hero-cards/ygo-slifer.jpg', w: 813, h: 1185 },
  riftbound: { src: '/images/hero-cards/riftbound-elder-dragon.webp', w: 437, h: 610 },
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
