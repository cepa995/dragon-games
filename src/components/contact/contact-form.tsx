'use client';

import { useTranslations } from 'next-intl';
import Script from 'next/script';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type ContactState, contactSubmitAction } from '@/lib/contact-actions';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [state, action, pending] = useActionState<ContactState, FormData>(contactSubmitAction, {});

  if (state.success) {
    return (
      <div className="rounded-hero border-border bg-surface border p-6 text-center">
        <p className="text-success font-medium">{t('success')}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {/* Honeypot — hidden from users, visible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground font-medium">{t('name')}</span>
          <Input name="name" required minLength={2} autoComplete="name" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground font-medium">{t('email')}</span>
          <Input name="email" type="email" required autoComplete="email" />
        </label>
      </div>

      <label className="space-y-1.5 text-sm">
        <span className="text-muted-foreground font-medium">{t('subject')}</span>
        <Input name="subject" required minLength={2} />
      </label>

      <label className="space-y-1.5 text-sm">
        <span className="text-muted-foreground font-medium">{t('message')}</span>
        <Textarea name="message" required minLength={10} rows={6} />
      </label>

      {siteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      )}

      {state.error && (
        <p className="text-destructive text-sm" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}
