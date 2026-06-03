'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useState } from 'react';
import { Field } from '@/components/auth/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  addAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  type ActionState,
} from '@/lib/account/actions';

export type AddressView = {
  id: string;
  label: string | null;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export function AddressBook({ addresses }: { addresses: AddressView[] }) {
  const t = useTranslations('account.addresses');
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [, action, pending] = useActionState<ActionState, FormData>(addAddressAction, {});

  return (
    <div className="space-y-6">
      {addresses.length === 0 && <p className="text-muted-foreground text-sm">{t('empty')}</p>}

      <ul className="space-y-3">
        {addresses.map((a) => (
          <li
            key={a.id}
            className="rounded-card border-border bg-surface flex items-start justify-between gap-4 border p-4"
          >
            <div className="text-sm">
              <p className="font-medium">
                {a.label || a.street}
                {a.isDefault && (
                  <span className="bg-primary/15 text-primary ml-2 rounded-full px-2 py-0.5 text-xs">
                    {t('defaultBadge')}
                  </span>
                )}
              </p>
              <p className="text-muted-foreground">
                {a.street}, {a.postalCode} {a.city}, {a.country}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {!a.isDefault && (
                <form action={setDefaultAddressAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    {t('makeDefault')}
                  </button>
                </form>
              )}
              <form action={deleteAddressAction}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="text-destructive text-xs hover:underline">
                  {t('delete')}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {showForm ? (
        // key on the count so the form resets after a successful add.
        <form
          key={addresses.length}
          action={action}
          className="rounded-card border-border bg-surface space-y-3 border p-4"
        >
          <Field label={t('labelLabel')}>
            <Input name="label" />
          </Field>
          <Field label={t('streetLabel')}>
            <Input name="street" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('cityLabel')}>
              <Input name="city" required />
            </Field>
            <Field label={t('postalLabel')}>
              <Input name="postalCode" required />
            </Field>
          </div>
          <Field label={t('countryLabel')}>
            <Input name="country" defaultValue="RS" maxLength={2} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" /> {t('defaultBadge')}
          </label>
          <Button type="submit" disabled={pending}>
            {t('save')}
          </Button>
        </form>
      ) : (
        <Button variant="secondary" onClick={() => setShowForm(true)}>
          {t('add')}
        </Button>
      )}
    </div>
  );
}
