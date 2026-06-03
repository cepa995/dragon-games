import { CalendarDays, Coins } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { formatDateTime, formatRsd } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { gameMeta } from '@/lib/tcg';
import { Section } from './section';

export async function UpcomingTournaments({ locale }: { locale: string }) {
  const t = await getTranslations('home.tournaments');

  const tournaments = await prisma.tournament.findMany({
    where: { startsAt: { gte: new Date() }, status: { in: ['SCHEDULED', 'OPEN', 'FULL'] } },
    orderBy: { startsAt: 'asc' },
    take: 3,
  });

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      actionHref="/tournaments"
      actionLabel={t('viewAll')}
    >
      {tournaments.length === 0 ? (
        <p className="text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {tournaments.map((tour) => {
            const name = locale === 'en' && tour.nameEn ? tour.nameEn : tour.nameSr;
            const meta = gameMeta(tour.game);
            return (
              <Link
                key={tour.id}
                href={`/tournaments/${tour.slug}`}
                className="group rounded-hero border-border bg-surface flex flex-col gap-3 border p-5 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      color: meta.accent,
                      background: 'color-mix(in oklch, currentColor 15%, transparent)',
                    }}
                  >
                    {meta.label}
                  </span>
                  {tour.format && (
                    <span className="text-muted-foreground text-xs">{tour.format}</span>
                  )}
                </div>
                <h3 className="font-display text-xl">{name}</h3>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarDays className="text-accent size-4" />
                  {formatDateTime(tour.startsAt, locale)}
                </p>
                <p className="mt-auto flex items-center gap-2 text-sm font-medium">
                  <Coins className="text-accent size-4" />
                  {tour.entryFeeRsd > 0 ? formatRsd(tour.entryFeeRsd, locale) : t('free')}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
