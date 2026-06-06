import { Coins, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { relativeDays } from '@/lib/datetime';
import { dateParts, formatRsd } from '@/lib/format';
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
        <div className="grid gap-5 md:grid-cols-2">
          {tournaments.map((tour) => {
            const name = locale === 'en' && tour.nameEn ? tour.nameEn : tour.nameSr;
            const meta = gameMeta(tour.game);
            const dp = dateParts(tour.startsAt, locale);
            return (
              <Link
                key={tour.id}
                href={`/tournaments/${tour.slug}`}
                className="group rounded-hero border-border bg-surface hover:border-accent/40 relative flex overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_color-mix(in_oklch,var(--accent)_55%,transparent)]"
                style={{ ['--accent' as string]: meta.accent } as React.CSSProperties}
              >
                {/* Date block */}
                <div
                  className="border-border flex w-24 shrink-0 flex-col items-center justify-center gap-1 border-r text-center"
                  style={{
                    background:
                      'linear-gradient(180deg, color-mix(in oklch, var(--accent) 22%, var(--color-surface)), var(--color-surface))',
                  }}
                >
                  <span
                    className="font-display text-4xl leading-none"
                    style={{ color: 'var(--accent)' }}
                  >
                    {dp.day}
                  </span>
                  <span className="text-foreground/70 text-xs font-semibold tracking-widest uppercase">
                    {dp.month}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-5">
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

                  <h3 className="font-display text-lg leading-tight">{name}</h3>
                  <p className="text-muted-foreground text-sm capitalize">
                    {dp.weekday}, {dp.time}
                    {tour.format ? ` · ${tour.format}` : ''}
                    <span className="text-accent ml-1">
                      · {relativeDays(tour.startsAt, locale)}
                    </span>
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 text-sm">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Coins className="text-accent size-4" />
                      {tour.entryFeeRsd > 0 ? formatRsd(tour.entryFeeRsd, locale) : t('free')}
                    </span>
                    {tour.capacity != null && (
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="size-4" />
                        {t('spots', { count: tour.capacity })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
