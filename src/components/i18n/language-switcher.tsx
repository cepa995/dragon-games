'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { setLocalePreferenceAction } from '@/lib/account/actions';

/**
 * SR / EN switcher (SRS FR-26.1/26.2). Switching navigates to the same path in
 * the target locale (preserving scroll), persists the choice via the NEXT_LOCALE
 * cookie (next-intl), and — for logged-in users — to the DB (no-op for guests).
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');
  const tActions = useTranslations('actions');
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocalePreferenceAction(next);
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      role="group"
      aria-label={tActions('switchLanguage')}
      className="border-border inline-flex items-center rounded-full border p-0.5 text-xs font-medium"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            disabled={isPending}
            aria-current={active ? 'true' : undefined}
            onClick={() => switchTo(loc)}
            className={
              active
                ? 'bg-primary text-primary-foreground rounded-full px-2.5 py-1'
                : 'text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1 transition-colors'
            }
          >
            {t(loc === 'sr' ? 'srShort' : 'enShort')}
          </button>
        );
      })}
    </div>
  );
}
