import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { submitContactMessage } from '@/lib/contact';
import { prisma } from '@/lib/prisma';

async function cleanup() {
  await prisma.contactMessage.deleteMany();
}

describe('contact message (integration)', () => {
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('persists a contact submission as an unhandled row', async () => {
    const { id } = await submitContactMessage({
      name: 'Ana Anić',
      email: 'ana@example.com',
      subject: 'Saradnja',
      message: 'Poruka koja je dovoljno duga za validaciju.',
    });

    const row = await prisma.contactMessage.findUnique({ where: { id } });
    expect(row).toMatchObject({
      name: 'Ana Anić',
      email: 'ana@example.com',
      subject: 'Saradnja',
      body: 'Poruka koja je dovoljno duga za validaciju.',
      handledAt: null,
    });
  });
});
