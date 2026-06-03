import { Award, MapPin, MessageSquare, Sparkles, Trophy, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';

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
  { key: 'wpn', icon: Award },
  { key: 'ots', icon: Trophy },
  { key: 'community', icon: Users },
  { key: 'events', icon: Sparkles },
] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const stats = ['since', 'wpn', 'ots', 'community'] as const;

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20">
      {/* Intro */}
      <Reveal>
        <div className="max-w-3xl space-y-4">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('lead')}</p>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((key) => (
            <div key={key} className="rounded-hero border-border bg-surface border p-5 text-center">
              <dt className="text-accent font-display text-3xl">{t(`stats.${key}.value`)}</dt>
              <dd className="text-muted-foreground mt-1 text-sm">{t(`stats.${key}.label`)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Story */}
      <Reveal>
        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl">{t('story.title')}</h2>
            <p className="text-muted-foreground">{t('story.p1')}</p>
            <p className="text-muted-foreground">{t('story.p2')}</p>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl">{t('mission.title')}</h2>
            <p className="text-muted-foreground">{t('mission.p1')}</p>
            <p className="text-muted-foreground">{t('mission.p2')}</p>
          </div>
        </section>
      </Reveal>

      {/* What makes us unique */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display mb-8 text-2xl sm:text-3xl">{t('highlights.title')}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="rounded-hero border-border bg-surface hover:border-accent/40 group border p-6 transition-colors"
              >
                <span className="bg-accent/10 text-accent ring-accent/20 inline-flex size-11 items-center justify-center rounded-full ring-1">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display mt-4 text-lg">{t(`highlights.${key}.title`)}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{t(`highlights.${key}.body`)}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="rounded-hero border-border from-surface-elevated to-background mt-16 flex flex-col items-center gap-5 border bg-gradient-to-br p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl sm:text-3xl">{t('cta.title')}</h2>
          <p className="text-muted-foreground max-w-lg">{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-3">
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
    </main>
  );
}
