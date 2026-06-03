import { Clock, MapPin, Navigation } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Section } from './section';

type BusinessInfo = {
  locations?: { key: string; address: string }[];
};

const FALLBACK = {
  shop: 'Stražilovska 3, Novi Sad',
  club: 'Kralja Aleksandra 4, Novi Sad',
} as const;

function directionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export async function LocationsPreview() {
  const t = await getTranslations('home.locations');
  const tFooter = await getTranslations('footer');

  const setting = await prisma.setting.findUnique({ where: { key: 'business.info' } });
  const info = (setting?.value as BusinessInfo | undefined) ?? {};
  const byKey = new Map((info.locations ?? []).map((l) => [l.key, l.address]));

  const locations = [
    { key: 'shop', label: t('shopLabel'), address: byKey.get('shop') ?? FALLBACK.shop },
    { key: 'club', label: t('clubLabel'), address: byKey.get('club') ?? FALLBACK.club },
  ];

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((loc) => (
          <div
            key={loc.key}
            className="rounded-hero border-border bg-surface relative overflow-hidden border p-6"
          >
            {/* faux-map grid backdrop */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative space-y-3">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase">
                {loc.label}
              </p>
              <p className="flex items-start gap-2 font-medium">
                <MapPin className="text-accent mt-0.5 size-5 shrink-0" />
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
                className="text-accent hover:text-foreground inline-flex items-center gap-1.5 text-sm font-semibold"
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
