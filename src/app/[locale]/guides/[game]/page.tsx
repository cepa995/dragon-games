import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StarterProductCard } from '@/components/guides/starter-product-card';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { isGuideGame, starterProducts } from '@/lib/guides';
import { TCGS } from '@/lib/tcg';

// Reads recommended products from the DB, so it is rendered per request.
export const dynamic = 'force-dynamic';

type FaqItem = { q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}): Promise<Metadata> {
  const { locale, game } = await params;
  if (!isGuideGame(game)) return {};
  const t = await getTranslations({ locale, namespace: 'guides' });
  const label = TCGS.find((g) => g.key === game)?.label ?? game;
  return {
    title: `${label} — ${t('metaTitle')}`,
    description: t(`games.${game}.overview`),
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}) {
  const { locale, game } = await params;
  setRequestLocale(locale);
  if (!isGuideGame(game)) notFound();

  const t = await getTranslations('guides');
  const meta = TCGS.find((g) => g.key === game)!;
  const products = await starterProducts(game);

  const steps = t.raw(`games.${game}.steps`) as string[];
  const formats = t.raw(`games.${game}.formats`) as string[];
  const faq = t.raw(`games.${game}.faq`) as FaqItem[];
  const accent = { ['--a' as string]: meta.accent } as React.CSSProperties;

  return (
    <main id="main-content" className="relative">
      {/* Hero banner */}
      <div className="relative isolate overflow-hidden" style={accent}>
        <Image
          src={meta.banner}
          alt={meta.label}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-30"
        />
        <div className="from-background via-background/70 to-background absolute inset-0 -z-10 bg-gradient-to-b" />
        <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <Link
            href="/guides"
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t('backToGuides')}
          </Link>
          <h1 className="font-display text-4xl sm:text-6xl" style={{ color: 'var(--a)' }}>
            {meta.label}
          </h1>
          <p className="text-foreground/90 mt-3 max-w-2xl text-lg">{t(`games.${game}.tagline`)}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] space-y-16 px-4 py-16 sm:px-6 sm:py-20">
        {/* Overview */}
        <Reveal>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            {t(`games.${game}.overview`)}
          </p>
        </Reveal>

        {/* How to start */}
        <Reveal>
          <section>
            <h2 className="font-display mb-6 text-3xl">{t('startTitle')}</h2>
            <ol className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, i) => (
                <li
                  key={i}
                  className="rounded-hero border-border bg-surface flex items-start gap-3 border p-5"
                >
                  <span
                    className="font-display flex size-8 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{
                      color: 'var(--a)',
                      background: 'color-mix(in oklch, var(--a) 16%, transparent)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* Recommended starters */}
        <Reveal>
          <section>
            <h2 className="font-display mb-6 text-3xl">{t('startersTitle')}</h2>
            {products.length === 0 ? (
              <p className="text-muted-foreground">{t('startersEmpty')}</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <StarterProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    ctaLabel={t('viewProduct')}
                  />
                ))}
              </div>
            )}
          </section>
        </Reveal>

        {/* Formats */}
        <Reveal>
          <section>
            <h2 className="font-display mb-6 text-3xl">{t('formatsTitle')}</h2>
            <ul className="flex flex-wrap gap-3">
              {formats.map((format) => (
                <li
                  key={format}
                  className="rounded-full border px-4 py-2 text-sm font-medium"
                  style={{
                    borderColor: 'color-mix(in oklch, var(--a) 40%, transparent)',
                    color: 'var(--a)',
                  }}
                >
                  {format}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section>
            <h2 className="font-display mb-6 text-3xl">{t('faqTitle')}</h2>
            <div className="divide-border border-border rounded-hero divide-y border">
              {faq.map((item) => (
                <details key={item.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {item.q}
                    <span className="text-accent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-muted-foreground mt-3 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
