import { Globe, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/contact/contact-form';
import { Reveal } from '@/components/motion/reveal';
import { directionsUrl, getBusiness, mapEmbedUrl, telUrl, viberUrl } from '@/lib/business';

export const dynamic = 'force-dynamic';

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
  const business = await getBusiness();
  const address = business.locations[0]!.address;

  const channels = [
    business.phone && { icon: Phone, label: business.phone, href: telUrl(business.phone) },
    business.viber && { icon: MessageCircle, label: 'Viber', href: viberUrl(business.viber) },
    business.email && { icon: Mail, label: business.email, href: `mailto:${business.email}` },
    business.social?.facebook && {
      icon: Globe,
      label: 'Facebook',
      href: business.social.facebook,
      external: true,
    },
    business.social?.instagram && {
      icon: Globe,
      label: 'Instagram',
      href: business.social.instagram,
      external: true,
    },
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    href: string;
    external?: boolean;
  }[];

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('intro')}</p>
        </div>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Form */}
        <Reveal>
          <div className="rounded-hero border-border bg-surface border p-6 sm:p-8">
            <h2 className="font-display mb-6 text-2xl">{t('form.heading')}</h2>
            <ContactForm />
          </div>
        </Reveal>

        {/* Channels + map */}
        <Reveal>
          <aside className="space-y-6">
            <div className="rounded-hero border-border bg-surface space-y-4 border p-6">
              <h2 className="font-display text-xl">{t('channels.heading')}</h2>
              <ul className="space-y-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                      className="text-foreground hover:text-accent group flex items-center gap-3 text-sm font-medium transition-colors"
                    >
                      <span className="bg-accent/10 text-accent flex size-9 items-center justify-center rounded-full">
                        <c.icon className="size-4" />
                      </span>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-hero border-border bg-surface overflow-hidden border">
              <div className="bg-muted relative aspect-[16/10]">
                <iframe
                  title={t('channels.address')}
                  src={mapEmbedUrl(address)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full border-0"
                />
              </div>
              <div className="space-y-2 p-5">
                <p className="flex items-start gap-2 text-sm font-medium">
                  <MapPin className="text-accent mt-0.5 size-4 shrink-0" />
                  {address}
                </p>
                <a
                  href={directionsUrl(address)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                >
                  <Navigation className="size-4" />
                  {t('channels.address')}
                </a>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </main>
  );
}
