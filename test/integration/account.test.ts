import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { registerUser } from '@/lib/auth/account';
import {
  addAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  setLocalePreference,
  updateAddress,
  updateProfile,
} from '@/lib/account/profile';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.address.deleteMany();
  await prisma.userToken.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(email: string) {
  const res = await registerUser({ name: 'A', email, password: 'password123', locale: 'SR' });
  if (!res.ok) throw new Error('register failed');
  return res.userId;
}

const baseAddress = {
  label: 'Home',
  street: 'Stražilovska 3',
  city: 'Novi Sad',
  postalCode: '21000',
  country: 'RS',
};

describe('member account (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('updates profile fields', async () => {
    const userId = await createUser('p@test.com');
    await updateProfile(userId, { name: 'Marko Marković', phone: '0641234567' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.name).toBe('Marko Marković');
    expect(user?.phone).toBe('0641234567');
  });

  it('persists the language preference', async () => {
    const userId = await createUser('l@test.com');
    await setLocalePreference(userId, 'EN');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.locale).toBe('EN');
  });

  it('keeps a single default address and lists it first', async () => {
    const userId = await createUser('a@test.com');
    await addAddress(userId, { ...baseAddress, isDefault: true });
    const second = await addAddress(userId, {
      ...baseAddress,
      street: 'Kralja Aleksandra 4',
      isDefault: true,
    });

    const addresses = await listAddresses(userId);
    expect(addresses).toHaveLength(2);
    expect(addresses.filter((a) => a.isDefault)).toHaveLength(1);
    expect(addresses[0]?.id).toBe(second.id); // default sorted first
  });

  it('moves the default with setDefaultAddress', async () => {
    const userId = await createUser('d@test.com');
    const first = await addAddress(userId, { ...baseAddress, isDefault: true });
    const second = await addAddress(userId, { ...baseAddress, street: 'Druga 2' });

    expect(await setDefaultAddress(userId, second.id)).toBe(true);
    const addresses = await listAddresses(userId);
    expect(addresses.find((a) => a.id === second.id)?.isDefault).toBe(true);
    expect(addresses.find((a) => a.id === first.id)?.isDefault).toBe(false);
  });

  it('scopes address mutations to the owner', async () => {
    const owner = await createUser('owner@test.com');
    const attacker = await createUser('attacker@test.com');
    const addr = await addAddress(owner, baseAddress);

    expect(await updateAddress(attacker, addr.id, { ...baseAddress, city: 'Hacked' })).toBeNull();
    expect(await deleteAddress(attacker, addr.id)).toBe(false);

    // Owner still can.
    expect(await deleteAddress(owner, addr.id)).toBe(true);
    expect(await listAddresses(owner)).toHaveLength(0);
  });
});
