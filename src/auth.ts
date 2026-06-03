import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Resend from 'next-auth/providers/resend';
import type { Locale, UserRole } from '@/generated/prisma';
import { verifyCredentials } from '@/lib/auth/login';
import { loginSchema } from '@/lib/auth/schemas';
import { shouldExpireForInactivity } from '@/lib/auth/session-policy';
import { magicLinkEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/send';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

/**
 * Auth.js (NextAuth v5) configuration. JWT session strategy is used so the
 * Credentials (email/password) provider works alongside the Resend magic-link
 * provider; the Prisma adapter still backs users, accounts and verification
 * tokens. Cookies are HttpOnly + SameSite=Lax + Secure-in-prod by default
 * (NFR-2.3). Admin 2FA enforcement and 8h session expiry are layered on in #12.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  trustHost: true,
  pages: { signIn: '/sr/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, totp: {} },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const totp = typeof credentials?.totp === 'string' ? credentials.totp : null;
        const result = await verifyCredentials({ ...parsed.data, totp });
        if (!result.ok) return null;

        const { user } = result;
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          locale: user.locale,
          image: user.image,
        };
      },
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY ?? 'dev_placeholder',
      from: process.env.EMAIL_FROM ?? 'Dragon Games <onboarding@resend.dev>',
      maxAge: 60 * 60 * 24,
      sendVerificationRequest: async ({ identifier, url }) => {
        const res = await sendEmail(magicLinkEmail(identifier, url, 'sr'));
        if (!res.delivered) logger.info({ to: identifier, url }, 'magic link (dev)');
      },
    }),
  ],
  logger: {
    error(error) {
      // A failed credentials login is expected user input, not an app error.
      const type = (error as { type?: string }).type;
      if (error?.name === 'CredentialsSignin' || type === 'CredentialsSignin') return;
      logger.error({ err: error?.message, name: error?.name }, 'auth error');
    },
    warn(code) {
      logger.warn({ code }, 'auth warning');
    },
  },
  callbacks: {
    jwt({ token, user }) {
      const now = Date.now();
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: UserRole }).role;
        token.lastActivity = now;
        return token;
      }
      // Enforce the 8h inactivity timeout for admin/staff sessions (FR-14.5).
      const role = token.role as UserRole | undefined;
      const lastActivity = token.lastActivity as number | undefined;
      if (shouldExpireForInactivity(role, lastActivity, now)) {
        return null;
      }
      token.lastActivity = now;
      return token;
    },
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      if (token.role) session.user.role = token.role as UserRole;
      return session;
    },
  },
});

export type { Locale, UserRole };
