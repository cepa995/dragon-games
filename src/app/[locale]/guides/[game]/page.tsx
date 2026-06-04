import {
  ArrowLeft,
  CalendarDays,
  Clock,
  ExternalLink,
  Gauge,
  Layers,
  MapPin,
  MessageSquare,
  Palette,
  ShoppingBag,
  Trophy,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCardFan } from '@/components/guides/guide-card-fan';
import { StarterProductCard } from '@/components/guides/starter-product-card';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { GAME_CARDS, isGuideGame, starterProducts } from '@/lib/guides';
import { TCGS } from '@/lib/tcg';

// Reads recommended products from the DB, so it is rendered per request.
export const dynamic = 'force-dynamic';

type Step = { title: string; detail: string };
type Format = { name: string; detail: string };
type FaqItem = { q: string; a: string };
type Reference = { label: string; url: string };

const FACT_ICONS = { players: Users, time: Clock, complexity: Gauge, age: Trophy } as const;
// One icon per how-to-start step (by position).
const STEP_ICONS = [ShoppingBag, Palette, Layers, CalendarDays] as const;

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
  const cards = GAME_CARDS[game];
  const products = await starterProducts(game);

  const steps = t.raw(`games.${game}.steps`) as Step[];
  const formats = t.raw(`games.${game}.formats`) as Format[];
  const faq = t.raw(`games.${game}.faq`) as FaqItem[];
  const about = t.has(`games.${game}.about`)
    ? (t.raw(`games.${game}.about`) as string[])
    : [t(`games.${game}.overview`)];
  const hasCardsNote = t.has(`games.${game}.cardsNote`);
  const references = t.has(`games.${game}.references`)
    ? (t.raw(`games.${game}.references`) as Reference[])
    : [];
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

            {/* Card art — a fanned hand of real cards */}
            <div className="flex flex-col items-center gap-4">
              <GuideCardFan cards={cards} accent={meta.accent} />
              {hasCardsNote && (
                <p className="text-muted-foreground max-w-xs text-center text-xs">
                  {t(`games.${game}.cardsNote`)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] space-y-16 px-4 py-16 sm:px-6 sm:py-20">
        {/* Overview — full width, multi-column */}
        <Reveal>
          <section>
            <h2 className="font-display mb-5 text-3xl">{t('overviewTitle')}</h2>
            <div className="text-muted-foreground gap-x-12 text-lg leading-relaxed md:columns-2">
              {about.map((para, i) => (
                <p key={i} className="mb-4 break-inside-avoid">
                  {para}
                </p>
              ))}
            </div>
          </section>
        </Reveal>

        {/* How to start — numbered step cards */}
        <Reveal>
          <section>
            <h2 className="font-display mb-8 text-3xl">{t('startTitle')}</h2>
            <ol className="grid gap-5 sm:grid-cols-2">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i] ?? ShoppingBag;
                return (
                  <li
                    key={i}
                    className="rounded-hero border-border bg-surface group relative overflow-hidden border p-6"
                  >
                    <span
                      className="font-display pointer-events-none absolute -top-4 right-2 text-7xl opacity-[0.08] select-none"
                      style={{ color: 'var(--a)' }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="flex size-12 items-center justify-center rounded-2xl"
                      style={{
                        color: 'var(--a)',
                        background: 'color-mix(in oklch, var(--a) 16%, transparent)',
                        boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--a) 30%, transparent)',
                      }}
                    >
                      <Icon className="size-6" />
                    </span>
                    <h3 className="font-display mt-4 text-lg">
                      <span style={{ color: 'var(--a)' }}>{i + 1}.</span> {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      {step.detail}
                    </p>
                  </li>
                );
              })}
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

        {/* References */}
        {references.length > 0 && (
          <Reveal>
            <section>
              <h2 className="font-display mb-6 text-3xl">{t('referencesTitle')}</h2>
              <ul className="flex flex-wrap gap-3">
                {references.map((ref) => (
                  <li key={ref.url}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-border text-muted-foreground hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                      {ref.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}

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
