'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Field, FormError, FormSuccess } from '@/components/auth/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfileAction, type ActionState } from '@/lib/account/actions';

export function ProfileForm({ name, phone }: { name: string; phone: string }) {
  const t = useTranslations('account.profile');
  const [state, action, pending] = useActionState<ActionState, FormData>(updateProfileAction, {});

  return (
    <form action={action} className="space-y-4">
      <Field label={t('nameLabel')}>
        <Input name="name" defaultValue={name} required autoComplete="name" />
      </Field>
      <Field label={t('phoneLabel')}>
        <Input name="phone" defaultValue={phone} type="tel" autoComplete="tel" />
      </Field>
      {state.success && <FormSuccess message={t('saved')} />}
      {state.error && <FormError message={t('save')} />}
      <Button type="submit" disabled={pending}>
        {t('save')}
      </Button>
    </form>
  );
}
