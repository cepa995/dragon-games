import { z } from 'zod';
import { sendEmail } from '@/lib/email/send';
import { contactNotificationEmail } from '@/lib/email/templates';
import { prisma } from '@/lib/prisma';

/** Contact form payload (SRS FR-7.2), validated server-side (NFR-2.6). */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Where contact submissions are emailed. */
function inbox(): string {
  return process.env.CONTACT_INBOX ?? 'info@dragon.rs';
}

/** Persist a contact message and notify the admin inbox (SRS FR-7.2). */
export async function submitContactMessage(input: ContactInput): Promise<{ id: string }> {
  const row = await prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject,
      body: input.message,
    },
  });

  await sendEmail(
    contactNotificationEmail(inbox(), {
      name: input.name,
      email: input.email,
      subject: input.subject,
      body: input.message,
    }),
  );

  return { id: row.id };
}
