'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import {
  createPasswordReset,
  registerUser,
  resetPassword as resetPasswordCore,
} from '@/lib/auth/account';
import { appUrl, getClientIp, normalizeLocale } from '@/lib/auth/request';
import { AUTH_RATE_LIMIT, rateLimit } from '@/lib/auth/rate-limit';
import {
  loginSchema,
  magicLinkSchema,
  registerSchema,
  requestResetSchema,
  resetPasswordSchema,
} from '@/lib/auth/schemas';
import { passwordResetEmail, verificationEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/send';

export interface FormState {
  error?: string;
  success?: boolean;
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = normalizeLocale(formData.get('locale'));
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'invalid' };

  const ip = await getClientIp();
  if (!rateLimit(`register:${ip}`, AUTH_RATE_LIMIT.limit, AUTH_RATE_LIMIT.windowMs).ok) {
    return { error: 'rate_limited' };
  }

  const result = await registerUser({ ...parsed.data, locale: locale === 'en' ? 'EN' : 'SR' });
  if (!result.ok) return { error: 'email_taken' };

  const url = `${appUrl()}/${locale}/verify-email?token=${result.verifyToken}`;
  await sendEmail(verificationEmail(parsed.data.email, url, locale));
  return { success: true };
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = normalizeLocale(formData.get('locale'));
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'invalid' };

  const ip = await getClientIp();
  if (!rateLimit(`login:${ip}`, AUTH_RATE_LIMIT.limit, AUTH_RATE_LIMIT.windowMs).ok) {
    return { error: 'rate_limited' };
  }

  try {
    await signIn('credentials', { ...parsed.data, redirectTo: `/${locale}` });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'invalid_credentials' };
    throw error; // re-throw redirect
  }
  return {};
}

export async function magicLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = magicLinkSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { error: 'invalid' };

  const ip = await getClientIp();
  if (!rateLimit(`magic:${ip}`, AUTH_RATE_LIMIT.limit, AUTH_RATE_LIMIT.windowMs).ok) {
    return { error: 'rate_limited' };
  }

  try {
    await signIn('resend', { email: parsed.data.email, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'magic_failed' };
    throw error;
  }
  return { success: true };
}

export async function requestPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const locale = normalizeLocale(formData.get('locale'));
  const parsed = requestResetSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { error: 'invalid' };

  const ip = await getClientIp();
  if (!rateLimit(`reset:${ip}`, AUTH_RATE_LIMIT.limit, AUTH_RATE_LIMIT.windowMs).ok) {
    return { error: 'rate_limited' };
  }

  // Always report success to avoid account enumeration.
  const token = await createPasswordReset(parsed.data.email);
  if (token) {
    const url = `${appUrl()}/${locale}/reset-password?token=${token}`;
    await sendEmail(passwordResetEmail(parsed.data.email, url, locale));
  }
  return { success: true };
}

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'invalid' };

  const ok = await resetPasswordCore(parsed.data.token, parsed.data.password);
  if (!ok) return { error: 'invalid_token' };
  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
