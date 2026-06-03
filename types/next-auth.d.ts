import type { DefaultSession } from 'next-auth';
import type { Locale, UserRole } from '@/generated/prisma';

declare module 'next-auth' {
  interface User {
    role?: UserRole;
    locale?: Locale;
  }
  interface Session {
    user: {
      id: string;
      role?: UserRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string;
    role?: UserRole;
  }
}
