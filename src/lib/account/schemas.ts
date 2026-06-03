import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
});

export const addressSchema = z.object({
  label: z.string().trim().max(60).optional().or(z.literal('')),
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(20),
  country: z.string().trim().min(2).max(2).default('RS'),
  isDefault: z.boolean().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
