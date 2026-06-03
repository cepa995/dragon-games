'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { setLocalePreferenceAction } from '@/lib/account/actions';

export function LanguagePreference() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tLang = useTranslations('language');
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await setLocalePreferenceAction(loc);
              router.replace(pathname, { locale: loc });
            })
          }
          className={
            loc === locale
              ? 'rounded-card bg-primary text-primary-foreground px-3 py-1.5 text-sm'
              : 'rounded-card border-border text-muted-foreground hover:text-foreground border px-3 py-1.5 text-sm'
          }
        >
          {tLang(loc)}
        </button>
      ))}
    </div>
  );
}
