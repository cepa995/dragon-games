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
    { src: '/images/guides/mtg/w-elspeth.jpg', w: 488, h: 680, label: "Elspeth, Sun's Champion" },
    { src: '/images/guides/mtg/u-jace.jpg', w: 488, h: 680, label: 'Jace, the Mind Sculptor' },
    {
      src: '/images/guides/mtg/b-sheoldred.jpg',
      w: 488,
      h: 680,
      label: 'Sheoldred, the Apocalypse',
    },
    { src: '/images/guides/mtg/r-glorybringer.jpg', w: 488, h: 680, label: 'Glorybringer' },
    { src: '/images/guides/mtg/g-craterhoof.jpg', w: 488, h: 680, label: 'Craterhoof Behemoth' },
  ],
  pokemon: [
    { src: '/images/guides/pokemon/charizard.webp', w: 600, h: 825, label: 'Charizard' },
    { src: '/images/guides/pokemon/blastoise.webp', w: 600, h: 825, label: 'Blastoise' },
    { src: '/images/guides/pokemon/venusaur.webp', w: 600, h: 825, label: 'Venusaur' },
    { src: '/images/guides/pokemon/pikachu.webp', w: 600, h: 825, label: 'Pikachu' },
    { src: '/images/guides/pokemon/mewtwo.webp', w: 600, h: 825, label: 'Mewtwo' },
  ],
  yugioh: [
    {
      src: '/images/guides/yugioh/blue-eyes.jpg',
      w: 813,
      h: 1185,
      label: 'Blue-Eyes White Dragon',
    },
    { src: '/images/guides/yugioh/dark-magician.jpg', w: 813, h: 1185, label: 'Dark Magician' },
    { src: '/images/guides/yugioh/red-eyes.jpg', w: 813, h: 1185, label: 'Red-Eyes Black Dragon' },
    { src: '/images/guides/yugioh/slifer.jpg', w: 813, h: 1185, label: 'Slifer the Sky Dragon' },
    { src: '/images/guides/yugioh/obelisk.jpg', w: 813, h: 1185, label: 'Obelisk the Tormentor' },
  ],
  riftbound: [
    { src: '/images/guides/riftbound/jinx.webp', w: 750, h: 1047, label: 'Jinx' },
    {
      src: '/images/guides/riftbound/mageseeker.webp',
      w: 750,
      h: 1047,
      label: 'Mageseeker Warden',
    },
    { src: '/images/guides/riftbound/ekko.webp', w: 750, h: 1047, label: 'Ekko' },
    { src: '/images/guides/riftbound/kogmaw.webp', w: 750, h: 1047, label: "Kog'Maw" },
    { src: '/images/guides/riftbound/stormbringer.webp', w: 750, h: 1047, label: 'Stormbringer' },
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
