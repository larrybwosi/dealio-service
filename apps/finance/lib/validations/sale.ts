import { PaymentMethod, PaymentStatus } from '@/prisma/client';
import { z } from 'zod';

// Updated Schema to include updateStock option

export const ProcessSaleInputSchema = z.object({
  cartItems: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional().nullable(), // Variant might be optional depending on product setup
      quantity: z.number().int().positive(),
    })
  ),
  locationId: z.string(),
  customerId: z.string().optional().nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  discountAmount: z.number().nonnegative().default(0).optional(), // Optional, defaults to 0
  cashDrawerId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  enableStockTracking: z.boolean(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional().default(PaymentStatus.COMPLETED), // Optional, defaults to COMPLETED
});

export type ProcessSaleInput = z.infer<typeof ProcessSaleInputSchema>;

// Type returned after successful sale (keeping original structure)
export type ProcessSaleResult = {
  success: boolean;
  message: string;
  saleId?: string;
  receiptUrl?: string | null;
  data?: SaleWithDetails | null; // Sale with details for receipt generation
  error?: string | object; // Return structured error or message string
};

// Type for Sale with necessary relations for receipt generation
// Adjust includes based on what generateAndSaveReceiptPdf actually needs
export type SaleWithDetails = Sale & {
  items: (SaleItem & {
    product: Product & { category?: { name: string } };
    variant: ProductVariant | null;
  })[];
  customer: Customer | null;
  member: Member & { user: { name: string | null } }; // [cite: 11]
  organization: { name: string /*, other fields */ };
};

