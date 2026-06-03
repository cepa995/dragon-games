import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

export const DELETION_GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

/** Machine-readable export of a member's personal data (NFR-3.4). */
export async function exportUserData(userId: string) {
  const [user, addresses, orders, favorites] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        locale: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
    prisma.address.findMany({ where: { userId } }),
    prisma.order.findMany({ where: { userId }, include: { items: true } }),
    prisma.favorite.findMany({ where: { userId }, select: { productId: true, createdAt: true } }),
  ]);

  return { exportedAt: new Date(), user, addresses, orders, favorites };
}

/** Soft-delete: flag the account for anonymization after the grace period. */
export async function requestAccountDeletion(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { status: 'PENDING_DELETION', deletionRequestedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'account.deletion_requested',
        entityType: 'User',
        entityId: userId,
      },
    }),
  ]);
}

/**
 * Irreversibly strip PII while retaining anonymized order records for
 * bookkeeping (FR-13.7). Deletes addresses, favorites, tokens, sessions.
 */
export async function anonymizeUser(userId: string): Promise<void> {
  const placeholder = `deleted-${userId}@anonimizovano.invalid`;
  await prisma.$transaction([
    prisma.address.deleteMany({ where: { userId } }),
    prisma.favorite.deleteMany({ where: { userId } }),
    prisma.userToken.deleteMany({ where: { userId } }),
    prisma.recoveryCode.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.order.updateMany({
      where: { userId },
      data: {
        customerName: 'Obrisani korisnik',
        email: placeholder,
        phone: '',
        deliveryAddress: Prisma.DbNull,
        notesCustomer: null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        email: placeholder,
        name: null,
        phone: null,
        image: null,
        passwordHash: null,
        totpSecret: null,
        totpEnabledAt: null,
        emailVerified: null,
        anonymizedAt: new Date(),
      },
    }),
    prisma.auditLog.create({
      data: { action: 'account.anonymized', entityType: 'User', entityId: userId },
    }),
  ]);
}

/**
 * Anonymize all accounts whose grace period has elapsed. Run by a scheduled job
 * in production (M9 / #45). Returns the number processed.
 */
export async function anonymizeExpiredAccounts(now: Date = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - DELETION_GRACE_PERIOD_MS);
  const expired = await prisma.user.findMany({
    where: {
      status: 'PENDING_DELETION',
      anonymizedAt: null,
      deletionRequestedAt: { lte: cutoff },
    },
    select: { id: true },
  });

  for (const user of expired) {
    await anonymizeUser(user.id);
  }
  return expired.length;
}
