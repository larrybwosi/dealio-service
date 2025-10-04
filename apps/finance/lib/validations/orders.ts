import { z } from 'zod';
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from '@/prisma/client';

// Define Zod schemas for enums first
const OrderStatusSchema = z.nativeEnum(OrderStatus);

const PaymentStatusSchema = z.nativeEnum(PaymentStatus);
const PaymentMethodSchema = z.nativeEnum(PaymentMethod);

// --- Order Update Validation Schema ---
export const UpdateOrderInputSchema = z
  .object({
    status: OrderStatusSchema.optional(),
    paymentStatus: PaymentStatusSchema.optional(),
    paymentMethod: PaymentMethodSchema.optional(), 
    paymentTransactionId: z.string().optional(),
    shippingAddress: z.string().optional(),
    notes: z.string().optional(),
    orderType: z.nativeEnum(OrderType)
  })
  
  
  // --- Zod Schema Definition ---
  
  // Schema for the nested customer information object
  const CustomerInfoSchema = z.object({
    name: z.string().min(1, 'Customer name is required.'),
    email: z.string().email('A valid customer email is required.'),
    phone: z.string().optional(),
    company: z.string().optional(),
    avatar: z.string().optional(),
  });

  // Main schema for creating an order
  export const CreateOrderInputSchema = z
    .object({
      organizationId: z.string(),
      memberId: z.string(),
      items: z
        .array(
          z.object({
            variantId: z.string(),
            quantity: z.number().int().positive('Quantity must be a positive number.'),
          })
        )
        .min(1, 'An order must have at least one item.'),
      customerId: z.string().optional(),
      saveCustomer: z.boolean().default(false),
      orderData: z.object({
        orderNumber: z.string().min(1, 'Order number is required.'),
        orderDate: z.coerce.date(),
        dueDate: z.coerce.date(),
        status: z.nativeEnum(OrderStatus),
        priority: z.string().optional(),
        shippingMethod: z.string().optional(),
        paymentMethod: z.nativeEnum(PaymentMethod),
        notes: z.string().optional(),
        shippingAddress: z.any().optional(),
        billingAddress: z.any().optional(),
        discountAmount: z.number().nonnegative().optional(),
        taxAmount: z.number().nonnegative().optional(),
        shippingAmount: z.number().nonnegative().optional(),
        customerInfo: CustomerInfoSchema.optional(), // Moved here
      }),
    })
    .superRefine((data, ctx) => {
      // Rule 1: Ensure either customerId or customerInfo is provided, but not both.
      if (data.customerId && data.orderData.customerInfo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cannot provide both an existing customer ID and new customer details.',
          path: ['customerId'],
        });
      }

      // Rule 2: If the intention is to save a new customer, customerInfo must be provided.
      if (data.saveCustomer && !data.orderData.customerInfo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Customer details must be provided when 'saveCustomer' is true.",
          path: ['orderData.customerInfo'],
        });
      }
    });

  // Export the inferred TypeScript type
  export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

// Schema for a single item in the order form
export const OrderItemFormSchema = z.object({
  variantId: z.string(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  // These are for display purposes in the form, not necessarily for the final API call
  name: z.string(),
  price: z.number(),
});

// Main schema for the create order form
export const CreateOrderFormSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(OrderItemFormSchema).min(1, "Order must have at least one item."),
  orderType: z.nativeEnum(OrderType, {
    required_error: "Order type is required",
  }),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    required_error: "Payment method is required",
  }),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  notes: z.string().optional(),
  discount: z.coerce.number().min(0, "Discount cannot be negative").default(0),
  tax: z.coerce.number().min(0, "Tax cannot be negative").default(0),
  shipping: z.coerce.number().min(0, "Shipping cannot be negative").default(0),
});

export type CreateOrderFormValues = z.infer<typeof CreateOrderFormSchema>;