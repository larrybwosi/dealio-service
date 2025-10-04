import { PaymentMethod } from '@/prisma/client';
import { z } from 'zod';

export const orderSchema = z
  .object({
    organizationId: z.string(),
    customerId: z.string().optional(),
    memberId: z.string(), locationId: z.string(), paymentMethod: z.enum(Object.values(PaymentMethod)),
    customer: z
      .object({
        name: z.string(),
        email: z.email().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    items: z
      .array(
        z.object({
          variantId: z.string(),
          quantity: z.number().min(1),
        })
      )
      .min(1),
    shippingAddress: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
      })
      .optional(),
    partialPaymentAmount: z.number().optional(),
  })
  .refine(data => data.customerId || data.customer, {
    message: 'Either customerId or customer object must be provided',
    path: ['customer'],
  });
export type TOrderSchema = z.infer<typeof orderSchema>;