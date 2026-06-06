import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import {
  ContentStatus,
  PostStatus,
  PrismaClient,
  TournamentGame,
  TournamentStatus,
  UserRole,
} from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Dev-only password hash (`scrypt$salt$hash`). Real auth (Auth.js + Argon2id)
 * lands in M3 (#11); the seeded admin password is reset there. Never used in
 * production seeding.
 */
function devHash(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function seedSettings() {
  const settings: { key: string; value: unknown }[] = [
    { key: 'currency.rsd_eur_rate', value: { rate: 117.5 } },
    {
      key: 'business.info',
      value: {
        name: 'Dragon Games',
        email: 'info@dragon.rs',
        phone: '063 624 038',
        viber: '063624038',
        social: {
          facebook: 'https://facebook.com/klubdragonnovisad',
          instagram: 'https://instagram.com/dragon_novi_sad',
        },
        locations: [{ key: 'shop', address: 'Kralja Aleksandra 4, Novi Sad' }],
      },
    },
    {
      key: 'business.hours',
      // Club hours: Wed–Sun 15:00–21:00 (SRS §2.1). 0=Sun … 6=Sat.
      value: {
        timezone: 'Europe/Belgrade',
        weekly: {
          0: { open: '15:00', close: '21:00' },
          3: { open: '15:00', close: '21:00' },
          4: { open: '15:00', close: '21:00' },
          5: { open: '15:00', close: '21:00' },
          6: { open: '15:00', close: '21:00' },
        },
      },
    },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: s.value as object },
      update: { value: s.value as object },
    });
  }
}

async function seedCategories() {
  // Top-level: TCG, with per-game children, plus Board Games & Accessories.
  const tcg = await prisma.category.upsert({
    where: { slug: 'tcg' },
    create: { slug: 'tcg', nameSr: 'TCG', nameEn: 'TCG', sortOrder: 0 },
    update: {},
  });

  const games = [
    { slug: 'magic-the-gathering', sr: 'Magic: The Gathering', en: 'Magic: The Gathering' },
    { slug: 'pokemon', sr: 'Pokémon', en: 'Pokémon' },
    { slug: 'yu-gi-oh', sr: 'Yu-Gi-Oh!', en: 'Yu-Gi-Oh!' },
    { slug: 'riftbound', sr: 'Riftbound', en: 'Riftbound' },
  ];

  const gameCategories: Record<string, string> = {};
  for (const [i, g] of games.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: g.slug },
      create: { slug: g.slug, nameSr: g.sr, nameEn: g.en, parentId: tcg.id, sortOrder: i },
      update: { parentId: tcg.id },
    });
    gameCategories[g.slug] = cat.id;
  }

  // MTG sub-categories.
  const mtgId = gameCategories['magic-the-gathering']!;
  const mtgBooster = await prisma.category.upsert({
    where: { slug: 'mtg-booster-packs' },
    create: {
      slug: 'mtg-booster-packs',
      nameSr: 'Booster pakovanja',
      nameEn: 'Booster Packs',
      parentId: mtgId,
      sortOrder: 0,
    },
    update: { parentId: mtgId },
  });

  for (const [i, c] of [
    { slug: 'board-games', sr: 'Društvene igre', en: 'Board Games' },
    { slug: 'accessories', sr: 'Dodaci', en: 'Accessories' },
  ].entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, nameSr: c.sr, nameEn: c.en, sortOrder: i + 1 },
      update: {},
    });
  }

  return {
    mtgBoosterId: mtgBooster.id,
    pokemonId: gameCategories['pokemon']!,
    yugiohId: gameCategories['yu-gi-oh']!,
    riftboundId: gameCategories['riftbound']!,
  };
}

async function seedProducts(categoryIds: {
  mtgBoosterId: string;
  pokemonId: string;
  yugiohId: string;
  riftboundId: string;
}) {
  const products = [
    {
      sku: 'MTG-FDN-PLAY-EN',
      slug: 'mtg-foundations-play-booster-box',
      nameSr: 'MTG Foundations Play Booster kutija',
      nameEn: 'MTG Foundations Play Booster Box',
      descSr: 'Kutija sa 36 Play Booster pakovanja za Magic: The Gathering Foundations set.',
      descEn: '36-pack Play Booster box for Magic: The Gathering Foundations.',
      categoryId: categoryIds.mtgBoosterId,
      priceRsd: 18500,
      stockOnHand: 8,
      featured: true,
      status: ContentStatus.PUBLISHED,
      image: {
        url: '/images/products/mtg-foundations-box.jpg',
        altSr: 'MTG Foundations kutija',
        altEn: 'MTG Foundations box',
      },
      attributes: [
        { key: 'game', valueSr: 'Magic: The Gathering', valueEn: 'Magic: The Gathering' },
        { key: 'set', valueSr: 'Foundations', valueEn: 'Foundations' },
      ],
      variants: [
        {
          sku: 'MTG-FDN-PLAY-EN-V',
          attributes: { language: 'EN' },
          priceRsd: 18500,
          stockOnHand: 8,
        },
      ],
    },
    {
      sku: 'PKM-151-ETB-EN',
      slug: 'pokemon-151-elite-trainer-box',
      nameSr: 'Pokémon 151 Elite Trainer Box',
      nameEn: 'Pokémon 151 Elite Trainer Box',
      descSr: 'Elite Trainer Box za Pokémon 151 set.',
      descEn: 'Elite Trainer Box for the Pokémon 151 set.',
      categoryId: categoryIds.pokemonId,
      priceRsd: 7200,
      stockOnHand: 2,
      featured: true,
      status: ContentStatus.PUBLISHED,
      image: {
        url: '/images/products/pokemon-151-etb.jpg',
        altSr: 'Pokémon 151 ETB',
        altEn: 'Pokémon 151 ETB',
      },
      attributes: [{ key: 'game', valueSr: 'Pokémon', valueEn: 'Pokémon' }],
      variants: [],
    },
    {
      sku: 'YGO-AGOV-BOOSTER-EN',
      slug: 'yugioh-age-of-overlord-booster-box',
      nameSr: 'Yu-Gi-Oh! Age of Overlord Booster kutija',
      nameEn: 'Yu-Gi-Oh! Age of Overlord Booster Box',
      descSr: 'Booster kutija za Yu-Gi-Oh! Age of Overlord set (24 pakovanja).',
      descEn: '24-pack booster box for the Yu-Gi-Oh! Age of Overlord set.',
      categoryId: categoryIds.yugiohId,
      priceRsd: 9800,
      stockOnHand: 5,
      featured: true,
      status: ContentStatus.PUBLISHED,
      image: {
        url: '/images/products/yugioh-booster.jpg',
        altSr: 'Yu-Gi-Oh! booster kutija',
        altEn: 'Yu-Gi-Oh! booster box',
      },
      attributes: [{ key: 'game', valueSr: 'Yu-Gi-Oh!', valueEn: 'Yu-Gi-Oh!' }],
      variants: [],
    },
    {
      sku: 'RIFT-OGN-STARTER-EN',
      slug: 'riftbound-origins-starter-deck',
      nameSr: 'Riftbound Origins starter špil',
      nameEn: 'Riftbound Origins Starter Deck',
      descSr: 'Starter špil za Riftbound: League of Legends TCG — idealan za početak.',
      descEn: 'Starter deck for the Riftbound: League of Legends TCG — a perfect entry point.',
      categoryId: categoryIds.riftboundId,
      priceRsd: 3500,
      stockOnHand: 0,
      featured: true,
      status: ContentStatus.PUBLISHED,
      image: {
        url: '/images/products/riftbound-starter.jpg',
        altSr: 'Riftbound starter špil',
        altEn: 'Riftbound starter deck',
      },
      attributes: [{ key: 'game', valueSr: 'Riftbound', valueEn: 'Riftbound' }],
      variants: [],
    },
  ];

  for (const p of products) {
    const { image, attributes, variants, ...scalar } = p;
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      create: scalar,
      update: scalar,
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { productId: product.id, isPrimary: true, sortOrder: 0, ...image },
    });

    await prisma.productAttribute.deleteMany({ where: { productId: product.id } });
    if (attributes.length) {
      await prisma.productAttribute.createMany({
        data: attributes.map((a) => ({ productId: product.id, ...a })),
      });
    }

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        create: {
          productId: product.id,
          sku: v.sku,
          attributes: v.attributes,
          priceRsd: v.priceRsd,
          stockOnHand: v.stockOnHand,
        },
        update: { attributes: v.attributes, priceRsd: v.priceRsd, stockOnHand: v.stockOnHand },
      });
    }
  }
}

async function seedUsers() {
  await prisma.user.upsert({
    where: { email: 'admin@dragon.rs' },
    create: {
      email: 'admin@dragon.rs',
      name: 'Dragon Admin',
      role: UserRole.ADMIN,
      passwordHash: devHash('dragon-admin-dev'),
      emailVerified: new Date(),
    },
    update: { role: UserRole.ADMIN },
  });

  await prisma.user.upsert({
    where: { email: 'member@example.com' },
    create: {
      email: 'member@example.com',
      name: 'Test Member',
      role: UserRole.MEMBER,
      passwordHash: devHash('member-dev'),
      emailVerified: new Date(),
    },
    update: {},
  });
}

async function seedContent() {
  await prisma.tournament.upsert({
    where: { slug: 'fnm-standard-2026-06-05' },
    create: {
      slug: 'fnm-standard-2026-06-05',
      nameSr: 'FNM Standard',
      nameEn: 'FNM Standard',
      game: TournamentGame.MTG,
      format: 'Standard',
      descSr: 'Friday Night Magic — Standard format.',
      descEn: 'Friday Night Magic — Standard format.',
      startsAt: new Date('2026-06-05T19:00:00+02:00'),
      entryFeeRsd: 600,
      capacity: 32,
      prizeSr: 'Booster nagrade prema plasmanu.',
      prizeEn: 'Booster prizes by placement.',
      status: TournamentStatus.OPEN,
    },
    update: {},
  });

  const welcomePost = {
    titleSr: 'Dobrodošli na novu Dragon Games platformu',
    titleEn: 'Welcome to the new Dragon Games platform',
    bodySr:
      'Nakon više od 30 godina, Dragon Games dobija novi digitalni dom. Pregledajte katalog, pratite turnire i ostanite u toku sa svim dešavanjima u klubu — sve na jednom mestu. Vidimo se u prodavnici na Kralja Aleksandra 4!',
    bodyEn:
      'After more than 30 years, Dragon Games gets a new digital home. Browse the catalog, follow tournaments and keep up with everything happening at the club — all in one place. See you at the shop on Kralja Aleksandra 4!',
    coverImage: '/images/news/welcome.jpg',
    status: PostStatus.PUBLISHED,
    publishedAt: new Date('2026-06-01T10:00:00+02:00'),
  };
  await prisma.newsPost.upsert({
    where: { slug: 'dobrodosli-na-novu-platformu' },
    create: { slug: 'dobrodosli-na-novu-platformu', ...welcomePost },
    update: welcomePost,
  });

  for (const page of [
    {
      key: 'about',
      titleSr: 'O nama',
      titleEn: 'About',
      bodySr: 'Dragon Games postoji od 1994.',
      bodyEn: 'Dragon Games has operated since 1994.',
    },
    {
      key: 'locations',
      titleSr: 'Lokacija',
      titleEn: 'Location',
      bodySr: 'Kralja Aleksandra 4, Novi Sad.',
      bodyEn: 'Kralja Aleksandra 4, Novi Sad.',
    },
  ]) {
    await prisma.staticPage.upsert({ where: { key: page.key }, create: page, update: page });
  }
}

async function main() {
  await seedSettings();
  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);
  // Dev-credential users (admin@dragon.rs / member@example.com) must NEVER exist
  // in production. Skip them when NODE_ENV=production; promote a real registered
  // user to ADMIN out-of-band instead.
  if (process.env.NODE_ENV === 'production') {
    console.log('↷ Skipping dev users (NODE_ENV=production).');
  } else {
    await seedUsers();
  }
  await seedContent();
  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
