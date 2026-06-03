'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { registerAction, type FormState } from '@/lib/auth/actions';
import { Field, FormError, FormSuccess } from './field';

export function RegisterForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(registerAction, {});

  if (state.success) {
    return <FormSuccess message={t('register.success')} />;
  }

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t('nameLabel')}>
          <Input name="name" type="text" required autoComplete="name" />
        </Field>
        <Field label={t('emailLabel')}>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label={t('passwordLabel')}>
          <Input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
        <FormError message={state.error ? t(`errors.${state.error}`) : undefined} />
        <Button type="submit" disabled={pending} className="w-full">
          {t('register.submit')}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        {t('register.haveAccount')}{' '}
        <Link href="/login" className="text-accent hover:underline">
          {t('register.loginLink')}
        </Link>
      </p>
    </div>
  );
}
