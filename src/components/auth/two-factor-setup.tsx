'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  beginSetupAction,
  confirmSetupAction,
  disableTwoFactorAction,
  type BeginSetupState,
  type ConfirmState,
} from '@/lib/auth/two-factor-actions';
import { Field, FormError } from './field';

export function TwoFactorSetup({ enabled }: { enabled: boolean }) {
  const t = useTranslations('auth.twoFactor');
  const tErr = useTranslations('auth.errors');
  const router = useRouter();
  const [setup, setSetup] = useState<BeginSetupState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmState, confirm, confirmPending] = useActionState<ConfirmState, FormData>(
    confirmSetupAction,
    {},
  );

  if (enabled) {
    return (
      <div className="space-y-3">
        <p className="text-success text-sm">{t('enabledBadge')}</p>
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await disableTwoFactorAction();
              router.refresh();
            })
          }
        >
          {t('disable')}
        </Button>
      </div>
    );
  }

  if (confirmState.recoveryCodes) {
    return (
      <div className="space-y-3">
        <h3 className="font-medium">{t('recoveryTitle')}</h3>
        <p className="text-muted-foreground text-sm">{t('recoveryHint')}</p>
        <ul className="rounded-card border-border bg-background grid grid-cols-2 gap-2 border p-3 font-mono text-sm">
          {confirmState.recoveryCodes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
        <Button onClick={() => router.refresh()}>{t('done')}</Button>
      </div>
    );
  }

  if (!setup) {
    return (
      <Button
        disabled={isPending}
        onClick={() => startTransition(async () => setSetup(await beginSetupAction()))}
      >
        {t('enable')}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{t('scan')}</p>
      {setup.qr && (
        <Image
          src={setup.qr}
          alt=""
          width={180}
          height={180}
          unoptimized
          className="rounded-card bg-white p-2"
        />
      )}
      <p className="text-muted-foreground text-xs">
        {t('secretLabel')} <code className="break-all">{setup.secret}</code>
      </p>
      <form action={confirm} className="space-y-3">
        <Field label={t('codeLabel')}>
          <Input name="code" inputMode="numeric" autoComplete="one-time-code" required />
        </Field>
        <FormError message={confirmState.error ? tErr(confirmState.error) : undefined} />
        <Button type="submit" disabled={confirmPending}>
          {t('confirm')}
        </Button>
      </form>
    </div>
  );
}
