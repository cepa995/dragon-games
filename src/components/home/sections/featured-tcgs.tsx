import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { TCGS } from '@/lib/tcg';
import { GameLogo } from './game-logo';
import { Section } from './section';

export async function FeaturedTcgs() {
  const t = await getTranslations('home.featuredTcgs');

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TCGS.map((g) => (
          <Link
            key={g.key}
            href={`/catalog?game=${g.slug}`}
            className="group rounded-hero border-border bg-surface relative overflow-hidden border p-6 transition-transform hover:-translate-y-1"
            style={{ ['--accent' as string]: g.accent } as React.CSSProperties}
          >
            <div
              className="absolute -top-8 -right-8 size-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-80"
              style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
            />
            <div className="flex h-14 items-center">
              <GameLogo src={g.logo} alt={g.label} glyph={g.glyph} accent={g.accent} />
            </div>
            <p className="mt-6 font-semibold">{g.label}</p>
            <p className="text-muted-foreground group-hover:text-foreground mt-1 text-sm transition-colors">
              {t('explore')} →
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
