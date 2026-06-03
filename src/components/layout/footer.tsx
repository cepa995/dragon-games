import { Clock, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { NAV_ITEMS } from '@/components/layout/nav-config';
import { Link } from '@/i18n/navigation';

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/klubdragonnovisad', external: true },
  { label: 'Instagram', href: 'https://instagram.com/dragon_novi_sad', external: true },
  { label: 'Viber', href: 'viber://chat?number=%2B381063624038', external: false },
];

/**
 * Site footer (SRS FR-25.3): brand, navigation, locations, hours, socials,
 * legal links and a mirrored language switcher.
 */
export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tActions = useTranslations('actions');
  const tBrand = useTranslations('brand');

  return (
    <footer className="border-border bg-surface relative border-t">
      {/* top accent glow */}
      <div className="via-accent/60 pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent to-transparent" />
      <div className="bg-accent/10 pointer-events-none absolute top-0 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/dragon_games_logo.png"
              alt=""
              width={1254}
              height={1254}
              className="h-12 w-12"
            />
            <span className="font-display text-lg font-bold">{tBrand('name')}</span>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm">{tBrand('tagline')}</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <nav aria-label={t('explore')} className="space-y-3 text-sm">
          <p className="font-semibold">{t('explore')}</p>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Locations */}
        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <MapPin className="text-accent size-4" /> {t('locations')}
          </p>
          <p className="text-muted-foreground">{t('shop')}</p>
          <p className="flex items-center gap-2 pt-1 font-semibold">
            <Clock className="text-accent size-4" /> {t('hours')}
          </p>
          <p className="text-muted-foreground">{t('hoursValue')}</p>
        </div>

        {/* Language */}
        <div className="space-y-3 text-sm">
          <p className="font-semibold">{tActions('switchLanguage')}</p>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs sm:flex-row sm:px-6">
          <p>
            © {tBrand('name')}. {t('rights')}
          </p>
          <nav aria-label={t('legal')} className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t('terms')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
