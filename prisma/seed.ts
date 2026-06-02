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
        viber: '063624038',
        social: {
          facebook: 'https://facebook.com/klubdragonnovisad',
          instagram: 'https://instagram.com/dragon_novi_sad',
        },
        locations: [
          { key: 'shop', address: 'Stražilovska 3, Novi Sad' },
          { key: 'club', address: 'Kralja Aleksandra 4, Novi Sad' },
        ],
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

  return { mtgBoosterId: mtgBooster.id, pokemonId: gameCategories['pokemon']! };
}

async function seedProducts(categoryIds: { mtgBoosterId: string; pokemonId: string }) {
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

  await prisma.newsPost.upsert({
    where: { slug: 'dobrodosli-na-novu-platformu' },
    create: {
      slug: 'dobrodosli-na-novu-platformu',
      titleSr: 'Dobrodošli na novu Dragon Games platformu',
      titleEn: 'Welcome to the new Dragon Games platform',
      bodySr: 'Radimo na novom sajtu — uskoro stiže katalog, turniri i još mnogo toga.',
      bodyEn: 'We are building a new site — catalog, tournaments and more are coming soon.',
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2026-06-01T10:00:00+02:00'),
    },
    update: {},
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
      titleSr: 'Lokacije',
      titleEn: 'Locations',
      bodySr: 'Stražilovska 3 i Kralja Aleksandra 4, Novi Sad.',
      bodyEn: 'Stražilovska 3 and Kralja Aleksandra 4, Novi Sad.',
    },
  ]) {
    await prisma.staticPage.upsert({ where: { key: page.key }, create: page, update: page });
  }
}

async function main() {
  await seedSettings();
  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);
  await seedUsers();
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
