'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Field, FormError } from '@/components/auth/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestDeletionAction, type DeletionState } from '@/lib/account/gdpr-actions';

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const t = useTranslations('account.privacy');
  const tErr = useTranslations('auth.errors');
  const [state, action, pending] = useActionState<DeletionState, FormData>(
    requestDeletionAction,
    {},
  );

  return (
    <form action={action} className="space-y-3">
      {hasPassword && (
        <Field label={t('passwordLabel')}>
          <Input name="password" type="password" required autoComplete="current-password" />
        </Field>
      )}
      <FormError message={state.error ? tErr(state.error) : undefined} />
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="border-destructive text-destructive border"
      >
        {t('deleteButton')}
      </Button>
    </form>
  );
}
