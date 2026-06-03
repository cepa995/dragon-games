'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { requestPasswordResetAction, type FormState } from '@/lib/auth/actions';
import { Field, FormError, FormSuccess } from './field';

export function ForgotForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(
    requestPasswordResetAction,
    {},
  );

  return (
    <div className="space-y-6">
      {state.success ? (
        <FormSuccess message={t('forgot.sent')} />
      ) : (
        <form action={action} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <Field label={t('emailLabel')}>
            <Input name="email" type="email" required autoComplete="email" />
          </Field>
          <FormError message={state.error ? t(`errors.${state.error}`) : undefined} />
          <Button type="submit" disabled={pending} className="w-full">
            {t('forgot.submit')}
          </Button>
        </form>
      )}
      <p className="text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground">
          {t('forgot.back')}
        </Link>
      </p>
    </div>
  );
}
