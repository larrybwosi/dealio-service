import { Prisma } from '@/prisma/client';
import { z } from 'zod';

export const CustomerIdSchema = z.object({
  id: z.cuid("Invalid customer ID format."),
});

export const CustomerFormSchema = z
  .object({
    id: z.cuid('Invalid customer ID format.').optional(), // Optional for creation
    name: z.string().min(1, 'Customer name cannot be empty.'),
    email: z.email('Please enter a valid email address.').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    customerTier: z.string().optional(),
    preferredContactMethod: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    loyaltyPoints: z.number().int().optional().default(0),
    company: z.string().optional(),
  })
  .strict();


// Type derived from schema
export type CustomerFormValues = z.infer<typeof CustomerFormSchema>;

export const LoyaltyAdjustmentSchema = z.object({
  customerId: z.cuid("Invalid customer ID."),
  pointsChange: z.coerce // Coerce input string/number to number
    .number({ error: "Points change must be a number." })
    .int("Points must be a whole number.")
    .refine((val) => val !== 0, "Points change cannot be zero."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
});


// Detailed customer type including relations
export type CustomerWithDetails = Prisma.CustomerGetPayload<{
  include: {
    sales: {
      select: {
        id: true;
        saleNumber: true;
        saleDate: true;
        finalAmount: true;
        paymentStatus: true;
      };
      orderBy: { saleDate: "desc" };
      take: 50; // Limit initial load
    };
    loyaltyTransactions: {
      include: {
        member: { select: { user: { select: { name: true; email: true } } } }; // User who processed
      };
      orderBy: { transactionDate: "desc" };
      take: 50; // Limit initial load
    };
    createdBy?: { select: { user: { select: { name: true; email: true } } } }; // User who created
    updatedBy?: { select: { user: { select: { name: true; email: true } } } }; // User who last updated
  };
}>;
