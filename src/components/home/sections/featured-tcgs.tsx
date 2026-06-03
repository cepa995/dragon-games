import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SmartImage } from '@/components/ui/smart-image';
import { Link } from '@/i18n/navigation';
import { TCGS } from '@/lib/tcg';
import { Section } from './section';

export async function FeaturedTcgs() {
  const t = await getTranslations('home.featuredTcgs');

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      <div className="grid gap-5 sm:grid-cols-2">
        {TCGS.map((g) => (
          <Link
            key={g.key}
            href={`/catalog?game=${g.slug}`}
            aria-label={g.label}
            className="group rounded-hero border-border relative aspect-[16/9] overflow-hidden border"
            style={{ ['--accent' as string]: g.accent } as React.CSSProperties}
          >
            <SmartImage
              src={g.banner}
              alt={g.label}
              sizes="(max-width: 640px) 100vw, 50vw"
              accent={g.accent}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* darken bottom for the CTA + lift on hover */}
            <div className="from-background/85 via-background/15 absolute inset-0 bg-gradient-to-t to-transparent" />
            {/* accent glow ring on hover */}
            <div
              className="rounded-hero pointer-events-none absolute inset-0 opacity-0 ring-1 transition-opacity duration-300 ring-inset group-hover:opacity-100"
              style={{
                boxShadow:
                  'inset 0 0 60px -10px color-mix(in oklch, var(--accent) 70%, transparent)',
                ['--tw-ring-color' as string]:
                  'color-mix(in oklch, var(--accent) 55%, transparent)',
              }}
            />
            <div className="absolute right-5 bottom-5 left-5 flex items-center justify-end">
              <span className="bg-background/60 text-foreground group-hover:text-accent inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold backdrop-blur-md transition-colors">
                {t('explore')}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
