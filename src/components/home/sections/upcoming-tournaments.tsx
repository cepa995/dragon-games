import { CalendarDays, Coins } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { relativeDays } from '@/lib/datetime';
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
        <div className="rounded-hero border-border text-muted-foreground border border-dashed p-10 text-center">
          {t('empty')}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {tournaments.map((tour) => {
            const name = locale === 'en' && tour.nameEn ? tour.nameEn : tour.nameSr;
            const meta = gameMeta(tour.game);
            return (
              <Link
                key={tour.id}
                href={`/tournaments/${tour.slug}`}
                className="group rounded-hero border-border bg-surface relative flex flex-col gap-4 overflow-hidden border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_color-mix(in_oklch,var(--accent)_55%,transparent)]"
                style={{ ['--accent' as string]: meta.accent } as React.CSSProperties}
              >
                {/* accent edge */}
                <span
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ background: 'var(--accent)' }}
                />

                <div className="flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      color: 'var(--accent)',
                      background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                    }}
                  >
                    {meta.label}
                  </span>
                  {tour.status === 'OPEN' && (
                    <span className="bg-success/15 text-success rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {t('statusOpen')}
                    </span>
                  )}
                  {tour.status === 'FULL' && (
                    <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {t('statusFull')}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-accent text-sm font-semibold capitalize">
                    {relativeDays(tour.startsAt, locale)}
                  </p>
                  <h3 className="font-display text-xl">{name}</h3>
                  {tour.format && (
                    <p className="text-muted-foreground mt-1 text-sm">{tour.format}</p>
                  )}
                </div>

                <div className="border-border mt-auto space-y-2 border-t pt-4 text-sm">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <CalendarDays className="text-accent size-4" />
                    {formatDateTime(tour.startsAt, locale)}
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Coins className="text-accent size-4" />
                    {tour.entryFeeRsd > 0 ? formatRsd(tour.entryFeeRsd, locale) : t('free')}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
