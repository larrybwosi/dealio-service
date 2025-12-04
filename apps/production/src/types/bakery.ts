import { scheduleDaysSchema } from '@/lib/bakery-validation';
import { RecipeDifficulty } from '@/prisma/enums';
import { z } from 'better-auth';

export enum BatchStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DisposalReason {
  EXPIRED = 'EXPIRED',
  NEAR_EXPIRY_UNSOLD = 'NEAR_EXPIRY_UNSOLD',
  DAMAGED = 'DAMAGED',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  CONTAMINATION = 'CONTAMINATION',
  RECALL = 'RECALL',
  OTHER = 'OTHER',
}

export enum ExpirationStatus {
  FRESH = 'FRESH',
  NEAR_EXPIRY = 'NEAR_EXPIRY',
  EXPIRED = 'EXPIRED',
  DISPOSED = 'DISPOSED',
}

export enum UnitType {
  COUNT = 'COUNT',
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
  LENGTH = 'LENGTH',
  AREA = 'AREA',
  TIME = 'TIME',
  OTHER = 'OTHER',
}

// Core Interfaces
export interface SystemUnit {
  id: string;
  name: string;
  symbol: string;
  type: UnitType;
}

export interface BakeryCategory {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  buyingPrice: number;
  retailPrice?: number;
  baseUnitId: string;
  baseUnit: SystemUnit;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientVariantId: string;
  ingredientVariant: ProductVariant;
  quantity: number;
  unitId: string;
  preparationNotes?: string;
  currentStock?: number;
  unitPrice?: number;
  systemUnitId: string;
  orgUnitId?: string;
  buyingPrice?:string
}

export interface Recipe {
  id: string;
  name: string;
  categoryId: string;
  category: BakeryCategory;
  ingredients: RecipeIngredient[];
  producesVariantId: string;
  producesVariant: ProductVariant;
  yieldQuantity: number;
  yieldUnitId: string;
  yieldUnit: SystemUnit;
  costPrice?: number;
  description?: string;
  prepTime?: number; // in minutes
  bakeTime?: number; // in minutes
  totalTime?: number; // in minutes
  difficulty?: RecipeDifficulty;
  temperatureCelsius?: number;
  servingSize?: string;
  instructions?: string;
  notes?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  systemUnitId?: string;
  orgUnitId?: string;
}

export interface TemplateSchedule {
  id: string;
  templateId: string;
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  time: string; // "09:00" format
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  recipeId: string;
  recipe: Recipe;
  quantity: number;
  unitId: string;
  recipeMultiplier?: number;
  duration?: number; // in minutes
  procedure?: string;
  notes?: string;
  isActive: boolean;
  shelfLifeDays?: number;
  schedules?: TemplateSchedule[];
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  scheduleDays: z.infer<typeof scheduleDaysSchema>;
  scheduleTime: string;
  systemUnitId?: string;
  orgUnitId?: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  organizationId: string;
  recipeId: string;
  recipe: Recipe;
  plannedQuantity: number;
  actualQuantity?: number;
  unitId: string;
  recipeMultiplier: number;
  status: BatchStatus;
  scheduledStartAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in minutes
  bakerId?: string;
  baker?: BakeryBaker;
  procedure?: string;
  notes?: string;
  createdFromTemplateId?: string;
  createdFromTemplate?: Template;
  cancelledAt?: Date;
  canceledById?: string;
  canceledBy?: BakeryBaker;
  outputLocationId?: string;
  productionDate?: Date;
  expiresAt?: Date;
  shelfLifeDays?: number;
  expirationStatus: ExpirationStatus;
  expiryAlertSentAt?: Date;
  disposedAt?: Date;
  disposedById?: string;
  disposedBy?: BakeryBaker;
  disposalReason?: DisposalReason;
  disposalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  systemUnitId?: string;
  orgUnitId?: string;
}

export interface BakeryBaker {
  id: string;
  bakerySettingsId: string;
  memberId: string;
  specialties: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  batches?: Batch[];
  canceledBatches?: Batch[];
  disposedBatches?: Batch[];
  // For display purposes (not in schema but often joined)
  name?: string;
  email?: string;
}

export interface BakerySettings {
  id: string;
  organizationId: string;
  defaultBakerId?: string;
  defaultBaker?: BakeryBaker;
  bakers: BakeryBaker[];
  autoCreateDailyBatches: boolean;
  expiryWarningDays: number;
  createdAt: Date;
  updatedAt: Date;
}

// Type definition for the formatted batch response
export interface FormattedBatch {
  id: string;
  batchNumber: string;
  name: string;
  recipe: {
    id: string;
    name: string;
    yieldQuantity: number;
    yieldUnit: {
      id: string;
      name: string;
      symbol: string;
    };
  };
  unit: {
    id: string;
    name: string;
    symbol: string;
  };
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  plannedQuantity: number;
  actualQuantity?: number;
  status: BatchStatus;
  scheduledStartAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  duration?: number;
  baker?: string;
  procedure?: string;
  notes?: string;
  createdFromTemplate?: { id: string; name: string };
  createdAt: Date;
  updatedAt: Date;
  // Expiration fields
  productionDate?: Date;
  expiresAt?: Date;
  expirationStatus: ExpirationStatus;
  shelfLifeDays?: number;
  // Financial metrics
  productionCost?: number;
  costPerUnit?: number;
  retailPrice?: number;
  wholesalePrice?: number;
  totalRetailValue?: number;
  totalWholesaleValue?: number;
  retailProfit?: number;
  wholesaleProfit?: number;
  retailMargin?: number; // percentage
  wholesaleMargin?: number; // percentage
  calculationError?: boolean;
}

// Form interfaces for creating/editing
export interface CreateRecipeForm {
  name: string;
  categoryId: string;
  producesVariantId: string;
  ingredients: Omit<RecipeIngredient, 'id' | 'recipeId' | 'ingredientVariant'>[];
  yieldQuantity: number;
  yieldUnitId: string;
  description?: string;
  prepTime?: number;
  bakeTime?: number;
  totalTime?: number;
  difficulty?: RecipeDifficulty;
  temperatureCelsius?: number;
  servingSize?: string;
  instructions?: string;
  notes?: string;
}

export interface CreateTemplateForm {
  name: string;
  recipeId: string;
  quantity: number;
  unitId: string;
  recipeMultiplier?: number;
  duration?: number;
  procedure?: string;
  notes?: string;
  isActive?: boolean;
  shelfLifeDays?: number;
  schedules?: Omit<TemplateSchedule, 'id' | 'templateId' | 'createdAt' | 'updatedAt'>[];
}

export interface CreateBatchForm {
  recipeId: string;
  plannedQuantity: number;
  unitId: string;
  recipeMultiplier?: number;
  scheduledStartAt: Date;
  bakerId?: string;
  duration?: number;
  procedure?: string;
  notes?: string;
  createdFromTemplateId?: string;
  outputLocationId?: string;
  shelfLifeDays?: number;
}

export interface UpdateBatchForm {
  actualQuantity?: number;
  status?: BatchStatus;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  bakerId?: string;
  procedure?: string;
  notes?: string;
  productionDate?: Date;
  expiresAt?: Date;
  outputLocationId?: string;
}

export interface DisposeBatchForm {
  disposalReason: DisposalReason;
  disposalNotes?: string;
  disposedById: string;
}
