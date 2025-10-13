import { BatchStatus, DisposalReason, ExpirationStatus } from '@/types';
import { z } from 'zod/v4';


export const ingredientSchema = z.object({
  id: z.cuid().optional(),
  ingredientVariantId: z.cuid('A valid product variant must be selected'),
  quantity: z.coerce.number().positive('Quantity must be a positive number'),
  unitId: z.cuid('A valid unit must be selected'),
});

// Zod schema for creating a recipe
export const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  categoryId: z.cuid('A valid category must be selected'),
  yield: z.string().min(1, 'Yield is required'),
  ingredients: z.array(ingredientSchema).optional().default([]),
  description: z.string().optional().nullable(),
  prepTime: z.string().optional().nullable(),
  bakeTime: z.string().optional().nullable(), 
  totalTime: z.string().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(), 
  servingSize: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  producesVariantId: z.cuid().optional().nullable(),
});

export const updateRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').optional(),
  categoryId: z.cuid('A valid category must be selected').optional(),
  yield: z.string().min(1, 'Yield is required').optional(),
  // The 'ingredients' array represents the desired final state of the ingredients list.
  ingredients: z.array(ingredientSchema).optional(),
  description: z.string().nullable().optional(),
  prepTime: z.string().nullable().optional(),
  bakeTime: z.string().nullable().optional(),
  totalTime: z.string().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  temperature: z.string().nullable().optional(),
  servingSize: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  producesVariantId: z.cuid().nullable().optional(),
});


const scheduleDaysSchema = z
  .array(
    z.union([
      z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      z.number().int().min(0).max(6),
    ])
  )
  .min(1, 'At least one day must be selected')
  .optional()
  .nullable();

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  recipeId: z.cuid('A valid recipe must be selected'),
  categoryId: z.cuid('A valid category must be selected'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitId: z.cuid('A valid unit must be selected'),
  duration: z.string().optional().nullable(),
  procedure: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  scheduleTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format (e.g., 08:00, 14:30)')
    .optional()
    .nullable(),
  scheduleDays: scheduleDaysSchema,
  shelfLifeDays: z.coerce.number().int().positive('Shelf life must be a positive number').optional().nullable(),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').optional(),
  recipeId: z.cuid('A valid recipe must be selected').optional(),
  categoryId: z.cuid('A valid category must be selected').optional(),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').optional(),
  unitId: z.cuid('A valid unit must be selected').optional(),
  duration: z.string().optional().nullable(),
  procedure: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  scheduleTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format (e.g., 08:00, 14:30)')
    .optional()
    .nullable(),
  scheduleDays: scheduleDaysSchema.optional(),
  shelfLifeDays: z.coerce.number().int().positive('Shelf life must be a positive number').optional().nullable(),
});



export const batchDisposalSchema = z.object({
  batchId: z.cuid(),
  disposalReason: z.enum(DisposalReason),
  disposalNotes: z.string().optional().nullable(),
  disposedById: z.cuid(),
});


export const batchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  recipeId: z.cuid('A valid recipe must be selected'),
  categoryId: z.cuid('A valid category must be selected'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitId: z.cuid('A valid unit must be selected'),
  producedVariantId: z.cuid('A valid product variant must be selected'),
  status: z.enum(BatchStatus).default(BatchStatus.PLANNED),
  date: z.coerce.date(),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().optional().nullable(),
  bakerId: z.cuid('A valid baker must be selected').optional().nullable(),
  procedure: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdFromTemplateId: z.cuid().optional().nullable(),
  outputLocationId: z.cuid('A valid output location must be selected').optional().nullable(),

  // Expiration tracking fields
  productionDate: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  shelfLifeDays: z.coerce.number().int().min(1, 'Shelf life must be at least 1 day').optional().nullable(),
  expirationStatus: z.enum(ExpirationStatus).default(ExpirationStatus.FRESH),
});

export type BatchInput = z.infer<typeof batchSchema>;

export const updateBatchSchema = z.object({
  batchNumber: z.string().min(1, 'Batch number is required').optional(),
  name: z.string().min(1, 'Batch name is required').optional(),
  recipeId: z.cuid('A valid recipe must be selected').optional(),
  categoryId: z.cuid('A valid category must be selected').optional(),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').optional(),
  unitId: z.cuid('A valid unit must be selected'),
  status: z.enum(BatchStatus).optional(),
  date: z.coerce.date().optional(),
  time: z.string().min(1, 'Time is required').optional(),
  duration: z.string().optional().nullable(),
  bakerId: z.cuid('A valid baker must be selected').optional().nullable(),
  procedure: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdFromTemplateId: z.cuid().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  canceledById: z.cuid().optional().nullable(),
});

/**
 * Validation schema for Bakery Settings. (No changes needed based on schema)
 */
export const bakerySettingsSchema = z.object({
  id: z.cuid().optional(), // Optional for creation, required for updates
  bakers: z.array(z.cuid()).default([]),
  batchNumberFormat: z.string().min(1, 'Batch number format cannot be empty').default('B{YY}{MM}{DD}-{NNN}'),
  defaultUnit: z.string().min(1, 'Default unit cannot be empty').default('pieces'),
  organizationId: z.cuid(),
  createdAt: z.date().optional(), // Auto-generated by Prisma
  updatedAt: z.date().optional(), // Auto-managed by Prisma
});


// Schema for creating new bakery settings (excludes auto-generated fields)
export const createBakerySettingsSchema = bakerySettingsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating existing bakery settings
export const updateBakerySettingsSchema = bakerySettingsSchema.partial().omit({
  createdAt: true,
  updatedAt: true,
});

// Schema for the BakeryBaker join table
export const bakeryBakerSchema = z.object({
  id: z.cuid().optional(),
  bakerySettingsId: z.cuid(),
  memberId: z.cuid(),
});

export const createBakeryBakerSchema = bakeryBakerSchema.omit({
  id: true,
});

/**
 * Validation schema for creating a new BakeryCategory.
 * Matches the BakeryCategory model in schema.prisma.
 */
export const bakeryCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
  organizationId: z.cuid('A valid organization ID is required'),
});

/**
 * Validation schema for updating an existing BakeryCategory.
 * All fields are optional for updates.
 */
export const updateBakeryCategorySchema = bakeryCategorySchema.partial();


// --- Exported Types (Inferred from Zod Schemas) ---
export type BakeryCategoryFormData = z.infer<typeof bakeryCategorySchema>;

// --- Schema Variants for Updates (using .partial()) ---
export const createRecipeSchema = recipeSchema.extend({
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
});

// Schema for creating a new raw material product with minimum input
export const CreateRawMaterialSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long."),
  // The category this raw material belongs to (e.g., "Flour", "Dairy")
  categoryId: z.cuid("Invalid category ID."),
  // The fundamental unit for this material (e.g., ID for "Kilogram", "Liter") [cite: 61]
  baseUnitId: z.cuid("Invalid base unit ID."),
  // The initial purchase price per base unit
  buyingPrice: z.number().positive("Buying price must be a positive number."),
  description: z.string().optional().nullable(),
});

// Schema for updating an existing raw material product
export const UpdateRawMaterialSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long.").optional(),
  categoryId: z.cuid("Invalid category ID.").optional(),
  isActive: z.boolean().optional(),
  // You can also update the default variant's price
  buyingPrice: z.number().positive("Buying price must be a positive number.").optional(),
});

// Type definitions inferred from schemas
export type CreateRawMaterialInput = z.infer<typeof CreateRawMaterialSchema>;
export type UpdateRawMaterialInput = z.infer<typeof UpdateRawMaterialSchema>;

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;
export type BatchFormData = z.infer<typeof batchSchema>;
export type BakerySettingsFormData = z.infer<typeof bakerySettingsSchema>;
export type IngredientFormData = z.infer<typeof ingredientSchema>;
export type UpdateTemplateData = z.infer<typeof updateTemplateSchema>;
