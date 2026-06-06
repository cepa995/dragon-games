import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiFacebook, SiInstagram, SiViber } from 'react-icons/si';
import { ContactForm } from '@/components/contact/contact-form';
import { AshField } from '@/components/home/ash-field';
import { Reveal } from '@/components/motion/reveal';
import { directionsUrl, getBusiness, mapEmbedUrl, telUrl, viberUrl } from '@/lib/business';

export const dynamic = 'force-dynamic';

type IconType = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tFooter = await getTranslations('footer');
  const business = await getBusiness();
  const address = business.locations[0]!.address;

  const channels = [
    business.phone && {
      Icon: Phone as IconType,
      label: business.phone,
      href: telUrl(business.phone),
      color: 'var(--color-accent)',
    },
    business.viber && {
      Icon: SiViber as IconType,
      label: 'Viber',
      href: viberUrl(business.viber),
      color: '#7360F2',
    },
    business.email && {
      Icon: Mail as IconType,
      label: business.email,
      href: `mailto:${business.email}`,
      color: 'var(--color-accent)',
    },
    business.social?.facebook && {
      Icon: SiFacebook as IconType,
      label: 'Facebook',
      href: business.social.facebook,
      color: '#1877F2',
      external: true,
    },
    business.social?.instagram && {
      Icon: SiInstagram as IconType,
      label: 'Instagram',
      href: business.social.instagram,
      color: '#E4405F',
      external: true,
    },
  ].filter(Boolean) as {
    Icon: IconType;
    label: string;
    href: string;
    color: string;
    external?: boolean;
  }[];

  return (
    <main id="main-content" className="relative">
      <AshField />
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="mb-10 max-w-2xl space-y-3">
            <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
            <p className="text-muted-foreground text-lg">{t('intro')}</p>
          </div>
        </Reveal>

        {/* Row 1 — form and channels, equal height */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="rounded-hero border-border bg-surface flex h-full flex-col border p-6 sm:p-8">
              <h2 className="font-display mb-6 text-2xl">{t('form.heading')}</h2>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal className="h-full">
            <div className="rounded-hero border-border bg-surface flex h-full flex-col gap-4 border p-6 sm:p-8">
              <h2 className="font-display text-2xl">{t('channels.heading')}</h2>
              <ul className="flex flex-col gap-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                      className="border-border bg-background/40 hover:border-accent/40 group flex items-center gap-3 rounded-2xl border p-3 text-sm font-medium transition-colors"
                    >
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `color-mix(in oklch, ${c.color} 16%, transparent)` }}
                      >
                        <c.Icon className="size-5" style={{ color: c.color }} />
                      </span>
                      <span className="group-hover:text-accent transition-colors">{c.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Row 2 — location: one row, two columns */}
        <Reveal>
          <div className="rounded-hero border-border bg-surface mt-6 grid overflow-hidden border md:grid-cols-2">
            <div className="bg-muted relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
              <iframe
                title={t('channels.address')}
                src={mapEmbedUrl(address)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
              <div className="space-y-1">
                <p className="text-accent text-xs font-semibold tracking-widest uppercase">
                  {t('channels.address')}
                </p>
                <p className="flex items-start gap-2 text-lg font-medium">
                  <MapPin className="text-accent mt-1 size-5 shrink-0" />
                  {address}
                </p>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="text-accent size-4" />
                {tFooter('hoursValue')}
              </p>
              <a
                href={directionsUrl(address)}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex w-fit items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <Navigation className="size-4" />
                {t('channels.directions')}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
