'use server';

import { revalidatePath } from 'next/cache';
import type { Locale } from '@/generated/prisma';
import { createUserToken } from '@/lib/auth/tokens';
import { appUrl, normalizeLocale } from '@/lib/auth/request';
import { getCurrentUser } from '@/lib/auth/session';
import { EMAIL_VERIFICATION_TTL_MS } from '@/lib/auth/account';
import { sendEmail } from '@/lib/email/send';
import { verificationEmail } from '@/lib/email/templates';
import { prisma } from '@/lib/prisma';
import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
  setLocalePreference,
  updateAddress,
  updateProfile,
} from './profile';
import { addressSchema, profileSchema } from './schemas';

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'unauthorized' };

  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone') ?? '',
  });
  if (!parsed.success) return { error: 'invalid' };

  await updateProfile(user.id, parsed.data);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function setLocalePreferenceAction(locale: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return; // guests rely on the cookie only
  const normalized: Locale = normalizeLocale(locale) === 'en' ? 'EN' : 'SR';
  await setLocalePreference(user.id, normalized);
}

export async function resendVerificationAction(): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'unauthorized' };

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true, emailVerified: true, locale: true },
  });
  if (!record || record.emailVerified) return { success: true };

  const token = await createUserToken(user.id, 'EMAIL_VERIFICATION', EMAIL_VERIFICATION_TTL_MS);
  const locale = record.locale === 'EN' ? 'en' : 'sr';
  const url = `${appUrl()}/${locale}/verify-email?token=${token}`;
  await sendEmail(verificationEmail(record.email, url, locale));
  return { success: true };
}

function parseAddressForm(formData: FormData) {
  return addressSchema.safeParse({
    label: formData.get('label') ?? '',
    street: formData.get('street'),
    city: formData.get('city'),
    postalCode: formData.get('postalCode'),
    country: (formData.get('country') as string) || 'RS',
    isDefault: formData.get('isDefault') === 'on',
  });
}

export async function addAddressAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'unauthorized' };
  const parsed = parseAddressForm(formData);
  if (!parsed.success) return { error: 'invalid' };

  await addAddress(user.id, parsed.data);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateAddressAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'unauthorized' };
  const id = String(formData.get('id') ?? '');
  const parsed = parseAddressForm(formData);
  if (!parsed.success) return { error: 'invalid' };

  const updated = await updateAddress(user.id, id, parsed.data);
  if (!updated) return { error: 'not_found' };
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await deleteAddress(user.id, String(formData.get('id') ?? ''));
  revalidatePath('/', 'layout');
}

export async function setDefaultAddressAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await setDefaultAddress(user.id, String(formData.get('id') ?? ''));
  revalidatePath('/', 'layout');
}
