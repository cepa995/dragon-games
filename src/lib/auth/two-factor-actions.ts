'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './session';
import { beginTwoFactorSetup, confirmTwoFactor, disableTwoFactor } from './two-factor';

export interface BeginSetupState {
  qr?: string;
  secret?: string;
  error?: string;
}

export interface ConfirmState {
  recoveryCodes?: string[];
  error?: string;
}

export async function beginSetupAction(): Promise<BeginSetupState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'unauthorized' };
  const { qr, secret } = await beginTwoFactorSetup(user.id, user.email ?? user.id);
  return { qr, secret };
}

export async function confirmSetupAction(
  _prev: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'unauthorized' };

  const code = String(formData.get('code') ?? '');
  const recoveryCodes = await confirmTwoFactor(user.id, code);
  if (!recoveryCodes) return { error: 'totp_invalid' };
  return { recoveryCodes };
}

export async function disableTwoFactorAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await disableTwoFactor(user.id);
  return { ok: true };
}

/** Whether the current user has 2FA active (for rendering the security page). */
export async function getTwoFactorStatus(): Promise<{ enabled: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { enabled: false };
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { totpEnabledAt: true },
  });
  return { enabled: Boolean(record?.totpEnabledAt) };
}
