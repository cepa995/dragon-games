'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { resetPasswordAction, type FormState } from '@/lib/auth/actions';
import { Field, FormError, FormSuccess } from './field';

export function ResetForm({ token }: { token: string }) {
  const t = useTranslations('auth');
  const [state, action, pending] = useActionState<FormState, FormData>(resetPasswordAction, {});

  if (state.success) {
    return (
      <div className="space-y-4">
        <FormSuccess message={t('reset.success')} />
        <Link href="/login" className="text-accent text-sm hover:underline">
          {t('reset.loginLink')}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field label={t('passwordLabel')}>
        <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </Field>
      <FormError message={state.error ? t(`errors.${state.error}`) : undefined} />
      <Button type="submit" disabled={pending} className="w-full">
        {t('reset.submit')}
      </Button>
    </form>
  );
}
