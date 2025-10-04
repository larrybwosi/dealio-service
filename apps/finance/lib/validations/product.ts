import z from 'zod';

// Schema for a single selling unit within a variant
const sellingUnitSchema = z.object({
  id: z.string().optional(), // Used for updates
  unitOfMeasureId: z.string().min(1, 'A unit of measure is required.'),
  retailPrice: z.coerce.number().min(0).optional().nullable(),
  wholesalePrice: z.coerce.number().min(0).optional().nullable(),
});

// Schema for a single product variant with refined validation
const productVariantSchema = z.object({
  id: z.string().optional(), // Used for updates
  name: z.string().min(1, 'Variant name is required.'),
  sku: z.string().optional(),
  barcode: z.string().optional().nullable(),
  attributes: z.record(z.any()).optional().nullable(), // Keep as flexible JSON
  buyingPrice: z.coerce.number().min(0, 'Buying price must be 0 or greater.'),
  wholesalePrice: z.coerce.number().min(0).optional().nullable(),
  retailPrice: z.coerce.number().min(0, 'Retail price must be 0 or greater.'),
  promotionalPrice: z.coerce.number().min(0).optional().nullable(),
  reorderPoint: z.coerce.number().int().min(0).default(5),
  reorderQty: z.coerce.number().int().min(0).default(10),
  baseUnitId: z.string().min(1, 'Base unit is required.'),
  stockingUnitId: z.string().min(1, 'Stocking unit is required.'),
  sellingUnits: z.array(sellingUnitSchema).optional(),
  initialStock: z.coerce.number().int().min(0).optional().default(0),
});

// Main schema for creating a product
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  description: z.string().optional(),
  detailedDescription: z.string().optional(),
  sku: z.string().min(1, 'Product SKU is required.'),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required.'),
  tags: z.array(z.string()).optional(),     
  imageUrls: z.array(z.url()).optional(),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  variants: z.array(productVariantSchema).min(1, 'At least one product variant is required.'),
});

// Schema for updating an existing product
export const productUpdateSchema = productCreateSchema.extend({
  id: z.string(), // Product ID is required for updates
});

// Infer TypeScript types from the schemas for use in components
export type ProductCreateData = z.infer<typeof productCreateSchema>;
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
export type ProductVariantData = z.infer<typeof productVariantSchema>;
