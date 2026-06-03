'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newsletterSignupAction, type NewsletterState } from '@/lib/newsletter-actions';

export function NewsletterForm({ source = 'home' }: { source?: string }) {
  const t = useTranslations('home.newsletter');
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    newsletterSignupAction,
    {},
  );

  if (state.success) {
    return <p className="text-success font-medium">{t('success')}</p>;
  }

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input type="hidden" name="source" value={source} />
      {/* Honeypot — hidden from users, visible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <Input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={t('placeholder')}
        className="flex-1"
      />
      <Button type="submit" disabled={pending} className="shrink-0">
        {t('submit')}
      </Button>
      {state.error && <span className="text-destructive text-sm">{t('error')}</span>}
    </form>
  );
}
