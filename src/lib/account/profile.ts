import type { Locale } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import type { AddressInput, ProfileInput } from './schemas';

export async function updateProfile(userId: string, input: ProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: { name: input.name, phone: input.phone || null },
  });
}

/** Persist the member's language preference (FR-26.2 DB sync). */
export async function setLocalePreference(userId: string, locale: Locale) {
  return prisma.user.update({ where: { id: userId }, data: { locale } });
}

export async function listAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
  });
}

export async function addAddress(userId: string, input: AddressInput) {
  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return tx.address.create({
      data: {
        userId,
        label: input.label || null,
        street: input.street,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
        isDefault: input.isDefault ?? false,
      },
    });
  });
}

/** Update an address, scoped to its owner (returns null if not owned). */
export async function updateAddress(userId: string, addressId: string, input: AddressInput) {
  const existing = await prisma.address.findUnique({ where: { id: addressId } });
  if (!existing || existing.userId !== userId) return null;

  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return tx.address.update({
      where: { id: addressId },
      data: {
        label: input.label || null,
        street: input.street,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
        isDefault: input.isDefault ?? existing.isDefault,
      },
    });
  });
}

export async function deleteAddress(userId: string, addressId: string): Promise<boolean> {
  const existing = await prisma.address.findUnique({ where: { id: addressId } });
  if (!existing || existing.userId !== userId) return false;
  await prisma.address.delete({ where: { id: addressId } });
  return true;
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
  const existing = await prisma.address.findUnique({ where: { id: addressId } });
  if (!existing || existing.userId !== userId) return false;
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.address.update({ where: { id: addressId }, data: { isDefault: true } }),
  ]);
  return true;
}
