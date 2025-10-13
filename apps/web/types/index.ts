export enum BatchStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
};

export enum DisposalReason {
  EXPIRED = "EXPIRED",
  NEAR_EXPIRY_UNSOLD = "NEAR_EXPIRY_UNSOLD",
  DAMAGED = "DAMAGED",
  QUALITY_ISSUE = "QUALITY_ISSUE",
  CONTAMINATION = "CONTAMINATION",
  RECALL = "RECALL",
  OTHER = "OTHER",
};

export enum ExpirationStatus {
    FRESH = "FRESH",
    NEAR_EXPIRY = "NEAR_EXPIRY",
    EXPIRED = "EXPIRED",
    DISPOSED = "DISPOSED",
}

export interface SystemUnit {
  id: string;
  name: string;
  symbol: string;
  type: UnitType;
}

export interface BakerySettings {
  id: string;
  bakers: BakeryBaker[];
  batchNumberFormat: string;
  defaultUnit: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UnitType {
  COUNT = "COUNT",
  WEIGHT = "WEIGHT",
  VOLUME = "VOLUME",
  LENGTH = "LENGTH",
  AREA = "AREA",
  TIME = "TIME",
  OTHER = "OTHER",
}

// Core Interfaces
export interface BakeryCategory {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemUnit {
  id: string;
  name: string;
  symbol: string;
  type: UnitType;
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
  ingredientVariantId: string;
  ingredientVariant: ProductVariant;
  quantity: number;
  unitId: string;
  unit: SystemUnit;
}

export interface Recipe {
  id: string;
  name: string;
  categoryId: string;
  category: BakeryCategory;
  ingredients: RecipeIngredient[];
  producesVariantId?: string;
  producesVariant?: ProductVariant;
  costPrice?: number;
  yield: string;
  description?: string;
  prepTime?: string;
  bakeTime?: string;
  totalTime?: string;
  difficulty?: string;
  temperature?: string;
  servingSize?: string;
  instructions?: string;
  notes?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  recipeId: string;
  recipe: Recipe;
  categoryId: string;
  category: BakeryCategory;
  quantity: number;
  unit: string;
  unitId: string;
  duration?: string;
  procedure?: string;
  notes?: string;
  isActive: boolean;
  scheduleTime?: string;
  scheduleDays?: Array<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
    | number
  >;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Batch {
  id: string;
  batchNumber: string;
  name: string;
  recipeId: string;
  recipe: Recipe;
  categoryId: string;
  category: BakeryCategory;
  quantity: number;
  unit: string;
  status: BatchStatus;
  date: Date;
  time: string;
  duration?: string;
  baker: { id: string; name: string };
  procedure?: string;
  notes?: string;
  createdFromTemplateId?: string;
  createdFromTemplate?: Template;
  totalCost?: number;
  totalPrice?: number;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  bakerId: string;
  unitId: string;
  producedVariantId: string;
}

export interface BakeryBaker {
  id: string;
  memberId: string;
  name: string;
  email: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  specialties: string[];
  batches?: { id: string; name: string; status: BatchStatus }[];
}

// Type definition for the formatted batch response
export interface FormattedBatch {
  id: string;
  batchNumber: string;
  name: string;
  recipe: {
    id: string;
    name: string;
    yield: string;
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
  quantity: number;
  status: BatchStatus;
  date: Date;
  time: string;
  duration: string | null;
  baker: string;
  procedure: string | null;
  notes: string | null;
  createdFromTemplate: { id: string; name: string } | null;
  createdAt: Date;
  completedAt: Date | null;
  cancelledAt: Date | null;
  updatedAt: Date;
  // Financial metrics
  productionCost: number;
  costPerUnit: number;
  retailPrice: number;
  wholesalePrice: number;
  totalRetailValue: number;
  totalWholesaleValue: number;
  retailProfit: number;
  wholesaleProfit: number;
  retailMargin: number; // percentage
  wholesaleMargin: number; // percentage
  calculationError?: boolean;
}

export interface BakerySettings {
  id: string;
  bakers: BakeryBaker[];
  batchNumberFormat: string;
  defaultUnit: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form interfaces for creating/editing
export interface CreateRecipeForm {
  name: string;
  categoryId: string;
  ingredients: Omit<RecipeIngredient, "id">[];
  yield: string;
  description?: string;
  prepTime?: string;
  bakeTime?: string;
  difficulty?: string;
  temperature?: string;
  instructions?: string;
  notes?: string;
}

export interface CreateTemplateForm {
  name: string;
  recipeId: string;
  categoryId: string;
  quantity: number;
  unit: string;
  duration?: string;
  procedure?: string;
  notes?: string;
}

export interface CreateBatchForm {
  name: string;
  recipeId?: string;
  templateId?: string;
  categoryId: string;
  quantity: number;
  unit: string;
  date: Date;
  time: string;
  baker: string;
  duration?: string;
  procedure?: string;
  notes?: string;
}
