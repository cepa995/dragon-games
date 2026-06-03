'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { loginAction, magicLinkAction, type FormState } from '@/lib/auth/actions';
import { Field, FormError, FormSuccess } from './field';

export function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  const [magicState, magicAction, magicPending] = useActionState<FormState, FormData>(
    magicLinkAction,
    {},
  );

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t('emailLabel')}>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label={t('passwordLabel')}>
          <Input name="password" type="password" required autoComplete="current-password" />
        </Field>
        <FormError message={state.error ? t(`errors.${state.error}`) : undefined} />
        <Button type="submit" disabled={pending} className="w-full">
          {t('login.submit')}
        </Button>
      </form>

      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        <span className="bg-border h-px flex-1" />
        {t('login.orDivider')}
        <span className="bg-border h-px flex-1" />
      </div>

      <form action={magicAction} className="space-y-3">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t('emailLabel')}>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <FormError message={magicState.error ? t(`errors.${magicState.error}`) : undefined} />
        {magicState.success ? (
          <FormSuccess message={t('login.magicSent')} />
        ) : (
          <Button type="submit" variant="secondary" disabled={magicPending} className="w-full">
            {t('login.magicSubmit')}
          </Button>
        )}
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">
          {t('login.forgot')}
        </Link>
        <span className="text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link href="/register" className="text-accent hover:underline">
            {t('login.registerLink')}
          </Link>
        </span>
      </div>
    </div>
  );
}
