import { ArrowLeft, Clock, Gauge, MapPin, MessageSquare, Trophy, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StarterProductCard } from '@/components/guides/starter-product-card';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { GAME_ART, isGuideGame, starterProducts } from '@/lib/guides';
import { TCGS } from '@/lib/tcg';

// Reads recommended products from the DB, so it is rendered per request.
export const dynamic = 'force-dynamic';

type Step = { title: string; detail: string };
type Format = { name: string; detail: string };
type Term = { term: string; def: string };
type FaqItem = { q: string; a: string };

const FACT_ICONS = { players: Users, time: Clock, complexity: Gauge, age: Trophy } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}): Promise<Metadata> {
  const { locale, game } = await params;
  if (!isGuideGame(game)) return {};
  const t = await getTranslations({ locale, namespace: 'guides' });
  const label = TCGS.find((g) => g.key === game)?.label ?? game;
  return { title: `${label} — ${t('metaTitle')}`, description: t(`games.${game}.overview`) };
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
  const art = GAME_ART[game];
  const products = await starterProducts(game);

  const steps = t.raw(`games.${game}.steps`) as Step[];
  const formats = t.raw(`games.${game}.formats`) as Format[];
  const glossary = t.raw(`games.${game}.glossary`) as Term[];
  const faq = t.raw(`games.${game}.faq`) as FaqItem[];
  const facts = (['players', 'time', 'complexity', 'age'] as const).map((key) => ({
    key,
    Icon: FACT_ICONS[key],
    label: t(`facts.${key}`),
    value: t(`games.${game}.facts.${key}`),
  }));
  const accent = { ['--a' as string]: meta.accent } as React.CSSProperties;

  return (
    <main id="main-content" className="relative" style={accent}>
      {/* Hero */}
      <div className="relative isolate overflow-hidden">
        <Image
          src={meta.banner}
          alt={meta.label}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
        <div className="from-background via-background/80 to-background absolute inset-0 -z-10 bg-gradient-to-b" />
        <div
          className="absolute -top-20 left-1/2 -z-10 size-[36rem] max-w-[90vw] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'color-mix(in oklch, var(--a) 16%, transparent)' }}
        />
        <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
          <Link
            href="/guides"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t('backToGuides')}
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p
                className="text-sm font-semibold tracking-[0.18em] uppercase"
                style={{ color: 'var(--a)' }}
              >
                {meta.label}
              </p>
              <h1 className="font-display mt-2 text-4xl leading-[1.05] sm:text-6xl">
                {t(`games.${game}.tagline`)}
              </h1>

              {/* Quick facts */}
              <dl className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {facts.map((f) => (
                  <div
                    key={f.key}
                    className="rounded-hero border-border bg-surface/60 border p-3 text-center backdrop-blur-sm"
                  >
                    <f.Icon className="mx-auto mb-1 size-4" style={{ color: 'var(--a)' }} />
                    <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
                      {f.label}
                    </dt>
                    <dd className="font-display text-base">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Card art */}
            <div className="relative hidden justify-center lg:flex">
              <div
                className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: 'color-mix(in oklch, var(--a) 28%, transparent)' }}
              />
              <Image
                src={art.src}
                alt={meta.label}
                width={art.w}
                height={art.h}
                priority
                className="relative h-auto w-[clamp(180px,18vw,240px)] -rotate-3 rounded-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] ring-1"
                style={
                  {
                    ['--tw-ring-color' as string]: 'color-mix(in oklch, var(--a) 55%, transparent)',
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] space-y-16 px-4 py-16 sm:px-6 sm:py-20">
        {/* Overview */}
        <Reveal>
          <section className="max-w-3xl">
            <h2 className="font-display mb-4 text-3xl">{t('overviewTitle')}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t(`games.${game}.overview`)}
            </p>
          </section>
        </Reveal>

        {/* How to start — timeline */}
        <Reveal>
          <section>
            <h2 className="font-display mb-8 text-3xl">{t('startTitle')}</h2>
            <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-px before:bg-[color-mix(in_oklch,var(--a)_30%,var(--color-border))]">
              {steps.map((step, i) => (
                <li key={i} className="relative flex gap-5">
                  <span
                    className="font-display relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{
                      color: 'var(--a)',
                      background: 'color-mix(in oklch, var(--a) 16%, var(--color-surface))',
                      boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--a) 40%, transparent)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="rounded-hero border-border bg-surface flex-1 border p-5">
                    <h3 className="font-display text-lg">{step.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* Recommended starters */}
        {products.length > 0 && (
          <Reveal>
            <section>
              <h2 className="font-display mb-6 text-3xl">{t('startersTitle')}</h2>
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
            </section>
          </Reveal>
        )}

        {/* Formats */}
        <Reveal>
          <section>
            <h2 className="font-display mb-6 text-3xl">{t('formatsTitle')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {formats.map((format) => (
                <div
                  key={format.name}
                  className="rounded-hero border-border bg-surface border p-5"
                  style={{ borderLeft: '3px solid var(--a)' }}
                >
                  <h3 className="font-display text-lg" style={{ color: 'var(--a)' }}>
                    {format.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">{format.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Glossary */}
        <Reveal>
          <section>
            <h2 className="font-display mb-6 text-3xl">{t('glossaryTitle')}</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {glossary.map((item) => (
                <div key={item.term} className="rounded-hero border-border bg-surface border p-5">
                  <dt className="font-semibold">{item.term}</dt>
                  <dd className="text-muted-foreground mt-1 text-sm">{item.def}</dd>
                </div>
              ))}
            </dl>
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
                    <span className="text-accent text-xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <section
            data-theme="dark"
            style={{ colorScheme: 'dark', ...accent }}
            className="rounded-hero border-border from-surface-elevated to-background text-foreground relative flex flex-col items-center gap-5 overflow-hidden border bg-gradient-to-br p-8 text-center sm:p-12"
          >
            <div
              className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: 'color-mix(in oklch, var(--a) 22%, transparent)' }}
            />
            <h2 className="font-display relative text-2xl sm:text-3xl">{t('ctaTitle')}</h2>
            <p className="text-muted-foreground relative max-w-lg">{t('ctaSubtitle')}</p>
            <div className="relative flex flex-wrap justify-center gap-3">
              <Link
                href="/locations"
                className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <MapPin className="size-4" />
                {t('ctaVisit')}
              </Link>
              <Link
                href="/tournaments"
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <Trophy className="size-4" />
                {t('ctaTournaments')}
              </Link>
              <Link
                href="/contact"
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <MessageSquare className="size-4" />
                {t('ctaContact')}
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
