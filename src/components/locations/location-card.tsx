import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { type Business, directionsUrl, mapEmbedUrl, telUrl, viberUrl } from '@/lib/business';
import { isOpenNow, type WeeklyHours } from '@/lib/datetime';
import { OpenNowIndicator } from './open-now-indicator';

// Serbian week order (Mon→Sun) over the 0=Sun…6=Sat indices used in the data.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

function weekdayName(day: number, locale: string): string {
  // Jan 1 2024 is a Monday (getDay() === 1); offset to the wanted weekday.
  const ref = new Date(2024, 0, 1 + ((day - 1 + 7) % 7));
  return new Intl.DateTimeFormat(locale === 'en' ? 'en' : 'sr-Latn', { weekday: 'long' }).format(
    ref,
  );
}

function todayInBelgrade(): number {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Belgrade' })).getDay();
}

function HoursTable({
  weekly,
  locale,
  closedLabel,
}: {
  weekly: WeeklyHours;
  locale: string;
  closedLabel: string;
}) {
  const today = todayInBelgrade();
  return (
    <dl className="space-y-1.5">
      {WEEK_ORDER.map((day) => {
        const slot = weekly[String(day)];
        const isToday = day === today;
        return (
          <div
            key={day}
            className={`flex items-center justify-between gap-4 rounded-md px-2 py-1 text-sm ${
              isToday ? 'bg-accent/10 font-semibold' : ''
            }`}
          >
            <dt className={`capitalize ${isToday ? 'text-foreground' : 'text-muted-foreground'}`}>
              {weekdayName(day, locale)}
            </dt>
            <dd className={slot ? 'tabular-nums' : 'text-muted-foreground'}>
              {slot ? `${slot.open} – ${slot.close}` : closedLabel}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export async function LocationCard({ business, locale }: { business: Business; locale: string }) {
  const t = await getTranslations('locations');
  const location = business.locations[0]!;
  const { address } = location;
  const { weekly } = business.hours;

  return (
    <div className="rounded-hero border-border bg-surface overflow-hidden border">
      <div className="grid lg:grid-cols-2">
        {/* Map */}
        <div className="bg-muted relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
          <iframe
            title={t('mapTitle', { address })}
            src={mapEmbedUrl(address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase">
              {t('shopClubLabel')}
            </p>
            <OpenNowIndicator
              weekly={weekly}
              initialOpen={isOpenNow(weekly)}
              openLabel={t('openNow')}
              closedLabel={t('closedNow')}
            />
          </div>

          <p className="flex items-start gap-2.5 text-lg font-medium">
            <MapPin className="text-accent mt-1 size-5 shrink-0" />
            {address}
          </p>

          <div className="space-y-2">
            <p className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Clock className="text-accent size-4" />
              {t('hoursLabel')}
            </p>
            <HoursTable weekly={weekly} locale={locale} closedLabel={t('closedDay')} />
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={directionsUrl(address)}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            >
              <Navigation className="size-4" />
              {t('directions')}
            </a>
            {business.phone && (
              <a
                href={telUrl(business.phone)}
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Phone className="size-4" />
                {business.phone}
              </a>
            )}
            {business.viber && (
              <a
                href={viberUrl(business.viber)}
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              >
                <MessageCircle className="size-4" />
                Viber
              </a>
            )}
            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Mail className="size-4" />
                {t('email')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
