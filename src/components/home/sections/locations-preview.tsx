import { Clock, MapPin, Navigation } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { isOpenNow, type WeeklyHours } from '@/lib/datetime';
import { prisma } from '@/lib/prisma';
import { Section } from './section';

type BusinessInfo = { locations?: { key: string; address: string }[] };
type BusinessHours = { weekly?: WeeklyHours };

const FALLBACK_ADDRESS = 'Kralja Aleksandra 4, Novi Sad';

function directionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export async function LocationsPreview() {
  const t = await getTranslations('home.locations');
  const tFooter = await getTranslations('footer');

  const [infoSetting, hoursSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'business.info' } }),
    prisma.setting.findUnique({ where: { key: 'business.hours' } }),
  ]);
  const info = (infoSetting?.value as BusinessInfo | undefined) ?? {};
  const hours = (hoursSetting?.value as BusinessHours | undefined) ?? {};
  const byKey = new Map((info.locations ?? []).map((l) => [l.key, l.address]));
  const open = isOpenNow(hours.weekly);

  const locations = [
    {
      key: 'shop',
      label: t('shopLabel'),
      address: byKey.get('shop') ?? info.locations?.[0]?.address ?? FALLBACK_ADDRESS,
    },
  ];

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      <div className="grid gap-5">
        {locations.map((loc) => (
          <div
            key={loc.key}
            className="group rounded-hero border-border bg-surface hover:border-accent/40 relative overflow-hidden border p-6 transition-all duration-300 hover:-translate-y-1"
          >
            {/* faux-map grid + glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="bg-accent/15 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl" />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-accent text-xs font-semibold tracking-widest uppercase">
                  {loc.label}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={`size-2 rounded-full ${open ? 'bg-success shadow-success shadow-[0_0_8px]' : 'bg-muted-foreground'}`}
                  />
                  <span className={open ? 'text-success' : 'text-muted-foreground'}>
                    {open ? t('openNow') : t('closed')}
                  </span>
                </span>
              </div>

              <p className="flex items-start gap-2 text-lg font-medium">
                <MapPin className="text-accent mt-1 size-5 shrink-0" />
                {loc.address}
              </p>
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="size-4" />
                {tFooter('hoursValue')}
              </p>
              <a
                href={directionsUrl(loc.address)}
                target="_blank"
                rel="noreferrer noopener"
                className="border-border hover:border-accent/50 hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Navigation className="size-4" />
                {t('directions')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
