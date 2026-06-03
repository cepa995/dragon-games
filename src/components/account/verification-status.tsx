'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { resendVerificationAction } from '@/lib/account/actions';

export function VerificationStatus({ verified, email }: { verified: boolean; email: string }) {
  const t = useTranslations('account.profile');
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="text-muted-foreground">{email}</span>
      {verified ? (
        <span className="text-success font-medium">● {t('verified')}</span>
      ) : (
        <>
          <span className="text-warning font-medium">● {t('unverified')}</span>
          {sent ? (
            <span className="text-success">{t('resent')}</span>
          ) : (
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await resendVerificationAction();
                  setSent(true);
                })
              }
            >
              {t('resend')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
