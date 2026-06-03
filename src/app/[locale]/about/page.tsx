import { Award, MapPin, MessageSquare, Sparkles, Trophy, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AboutGallery } from '@/components/about/about-gallery';
import { AboutHero } from '@/components/about/about-hero';
import { AshField } from '@/components/home/ash-field';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { TCGS } from '@/lib/tcg';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

const HIGHLIGHTS = [
  { key: 'wpn', icon: Award, accent: 'var(--color-tcg-mtg)' },
  { key: 'ots', icon: Trophy, accent: 'var(--color-tcg-yugioh)' },
  { key: 'community', icon: Users, accent: 'var(--color-accent)' },
  { key: 'events', icon: Sparkles, accent: 'var(--color-tcg-riftbound)' },
] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <main id="main-content" className="relative">
      <AshField />
      <AboutHero />

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        {/* Story + mission, beside a fanned card-art collage */}
        <section className="grid items-center gap-10 py-16 sm:py-20 md:grid-cols-2">
          <Reveal>
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="font-display text-3xl sm:text-4xl">{t('story.title')}</h2>
                <p className="text-muted-foreground">{t('story.p1')}</p>
                <p className="text-muted-foreground">{t('story.p2')}</p>
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-2xl sm:text-3xl">{t('mission.title')}</h2>
                <p className="text-muted-foreground">{t('mission.p1')}</p>
                <p className="text-muted-foreground">{t('mission.p2')}</p>
              </div>
            </div>
          </Reveal>
          <AboutGallery alt={t('galleryAlt')} />
        </section>

        {/* What sets us apart */}
        <section className="py-8 sm:py-12">
          <Reveal>
            <h2 className="font-display mb-8 text-3xl sm:text-4xl">{t('highlights.title')}</h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {HIGHLIGHTS.map(({ key, icon: Icon, accent }, i) => (
              <StaggerItem
                key={key}
                className="group rounded-hero border-border bg-surface relative h-full overflow-hidden border p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div style={{ ['--a' as string]: accent } as React.CSSProperties}>
                  {/* corner accent glow */}
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
                    style={{ background: 'color-mix(in oklch, var(--a) 40%, transparent)' }}
                  />
                  {/* hover ring */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 ring-1 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      ['--tw-ring-color' as string]:
                        'color-mix(in oklch, var(--a) 45%, transparent)',
                    }}
                  />
                  <div className="relative flex items-start gap-5">
                    <span
                      className="flex size-14 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        color: 'var(--a)',
                        background: 'color-mix(in oklch, var(--a) 16%, transparent)',
                        boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--a) 30%, transparent)',
                      }}
                    >
                      <Icon className="size-6" />
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-display text-sm tabular-nums"
                          style={{
                            color: 'color-mix(in oklch, var(--a) 70%, var(--color-foreground))',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-xl">{t(`highlights.${key}.title`)}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{t(`highlights.${key}.body`)}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Games we nurture — gallery band */}
        <section className="py-16 sm:py-20">
          <Reveal>
            <div className="mb-8 space-y-2">
              <h2 className="font-display text-3xl sm:text-4xl">{t('games.title')}</h2>
              <p className="text-muted-foreground max-w-2xl">{t('games.subtitle')}</p>
            </div>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TCGS.map((game) => (
              <StaggerItem key={game.key} className="h-full">
                <div
                  className="group rounded-hero border-border bg-surface relative aspect-[4/5] overflow-hidden border transition-all duration-300 hover:-translate-y-1.5"
                  style={{ ['--a' as string]: game.accent } as React.CSSProperties}
                >
                  <Image
                    src={game.banner}
                    alt={game.label}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="from-background via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: 'var(--a)', boxShadow: '0 0 8px var(--a)' }}
                    />
                    <span className="font-display text-lg">{game.label}</span>
                  </div>
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 ring-1 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      ['--tw-ring-color' as string]:
                        'color-mix(in oklch, var(--a) 55%, transparent)',
                    }}
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* CTA */}
        <Reveal>
          <section
            data-theme="dark"
            style={{ colorScheme: 'dark' }}
            className="rounded-hero border-border from-surface-elevated to-background text-foreground relative mb-20 flex flex-col items-center gap-5 overflow-hidden border bg-gradient-to-br p-8 text-center sm:p-12"
          >
            <div className="bg-accent/15 pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full blur-3xl" />
            <h2 className="font-display relative text-2xl sm:text-3xl">{t('cta.title')}</h2>
            <p className="text-muted-foreground relative max-w-lg">{t('cta.subtitle')}</p>
            <div className="relative flex flex-wrap justify-center gap-3">
              <Link
                href="/locations"
                className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <MapPin className="size-4" />
                {t('cta.locations')}
              </Link>
              <Link
                href="/contact"
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <MessageSquare className="size-4" />
                {t('cta.contact')}
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
