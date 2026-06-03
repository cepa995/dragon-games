import { Clock, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Link } from '@/i18n/navigation';

/**
 * Site footer (SRS FR-25.3): locations, hours, social links, legal links and a
 * mirrored language switcher. The newsletter signup slot is filled in M4 (#19).
 */
export function Footer() {
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');

  return (
    <footer className="border-border bg-surface border-t">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-display text-lg font-bold">{tBrand('name')}</p>
          <p className="text-muted-foreground text-sm">{tBrand('tagline')}</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <MapPin className="text-accent size-4" /> {t('locations')}
          </p>
          <p className="text-muted-foreground">{t('shop')}</p>
          <p className="text-muted-foreground">{t('club')}</p>
          <p className="flex items-center gap-2 pt-1 font-medium">
            <Clock className="text-accent size-4" /> {t('hours')}
          </p>
          <p className="text-muted-foreground">{t('hoursValue')}</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-medium">{t('follow')}</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <li>
              <a
                href="https://facebook.com/klubdragonnovisad"
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/dragon_novi_sad"
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="viber://chat?number=%2B381063624038"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Viber
              </a>
            </li>
          </ul>
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
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
