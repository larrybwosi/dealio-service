'use client';
import axios, { AxiosInstance } from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  Assistant,
  AssistantMessage,
  Budget,
  Channel,
  Customer,
  CustomRole,
  Expense,
  InventoryLocation,
  Invitation,
  MeasurementUnit,
  Member,
  MemberRole,
  Message,
  Order,
  OrganizationSettings,
  PaymentStatus,
  Product,
  ProductVariant,
  ProductVariantStock,
  Sale,
  PaymentMethod,
} from '@/prisma/client';
import { Category, GeneratedCategory } from './api/categories';
import { SalesSummary } from './api/sales';
import { InventoryAdjustment, InventoryItem, InventoryMovement } from './types/inventory';
import { Permission } from './permissions';
import { UnitOfMeasure } from './api/units';
import { CreateOrderInput } from './validations/orders';
import { ExtendedOrder } from './api/orders';
import { SupplierFormValues } from '@/components/supplier-create-modal';
import { Notification } from './api/notifications';
import { Supplier } from '@/components/suppliers/types';
import { Attendance, Employee } from './api/members';

// Zustand store for organization and member details

interface OrgState {
  organizationId: string | null;
  memberId: string | null;
  locationId: string | null;
  locationName: string | null;
  address: string | null;
  logo: string | null;
  taxRate: string | null;
  currency: string;
  orgName: string | null;
  plan: string | null;
  set: (state: Partial<OrgState>) => void;
  clear: () => void;
}

type ExtendedProduct = {
  id: string; // Unique identifier (cuid)
  name: string; // Product name
  description: string; // Detailed description of the product
  sku: string; // Unique stock-keeping unit identifier
  barcode: string; // Unique barcode for the product
  categoryId: string; // ID of the associated category
  category: Category; // Related Category object
  isActive: boolean; // Whether the product is active (default: true)
  imageUrls: string[]; // Array of image URLs for the product
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last updated timestamp

  // Physical dimensions
  width: number; // Width of the product
  height: number; // Height of the product
  length: number; // Length of the product
  dimensionUnit: MeasurementUnit; // Unit of measurement (e.g., METER, FEET)
  weight: number; // Weight of the product
  weightUnit: MeasurementUnit; // Unit of weight (e.g., WEIGHT_KG, WEIGHT_LB)
  volumetricWeight: number; // Calculated dimensional weight

  // Additional attributes
  brand: string; // Brand name of the product
  rating: number; // Product rating (e.g., 4.5)
  lowStockThreshold: number; // Threshold for low stock alerts
  isNew: boolean; // Whether the product is marked as new (default: false)
  detailedDescription: string; // Extensive description of the product
  tags: string[]; // Array of tags for categorization
  isFeatured: boolean; // Whether the product is featured (default: false)

  defaultLocationId: string; // ID of the default stocking location
  defaultLocation: InventoryLocation; // Related InventoryLocation object

  // Relations
  variants: ProductVariant[] & { stockingUnit: UnitOfMeasure }; // Array of related ProductVariant objects
  variantStock: ProductVariantStock[]; // Array of related ProductVariantStock objects
  suppliers: ProductSupplier[]; // Array of related ProductSupplier objects
};

export interface ProductSupplier {
  id: string;
  supplierId: string;
  productId: string;
  organizationId: string;
}

export interface SalesReportCriteria {
  startDate: string;
  endDate: string;
  locationId?: string;
  productId?: string;
  customerId?: string;
}

export interface SalesReportResponse {
  totalSales: number;
  totalOrders: number;
  items: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

export interface ReceiptResponse {
  id: string;
  orderId: string;
  createdAt: string;
  content: string;
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    message?: string;
    success: boolean;
  };
  error?: string;
}

export interface InvoiceResponse {
  url: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  pointsPerDollar: number;
  redemptionRate: number;
  isActive: boolean;
  organizationId: string;
  tiers: LoyaltyTier[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  pointMultiplier: number;
  benefits: string[];
  programId: string;
}

export interface PointsConfig {
  id: string;
  actionType: string;
  points: number;
  description?: string;
  isActive: boolean;
  organizationId: string;
}

export interface CreateLoyaltyProgramInput {
  organizationId: string;
  name: string;
  description?: string;
  pointsPerDollar: number;
  redemptionRate: number;
  isActive: boolean;
  tiers: Omit<LoyaltyTier, 'id' | 'programId'>[];
}

export interface UpdateLoyaltyProgramInput {
  programId: string;
  name?: string;
  description?: string;
  pointsPerDollar?: number;
  redemptionRate?: number;
  isActive?: boolean;
  tiersToCreate?: Omit<LoyaltyTier, 'id' | 'programId'>[];
  tiersToUpdate?: Partial<LoyaltyTier> & { id: string };
  tierIdsToDelete?: string[];
}

export interface SetPointsConfigInput {
  organizationId: string;
  configs: Omit<PointsConfig, 'id' | 'organizationId'>[];
}

// Axios client constructor
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      async config => {
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => {
        if (response.data.meta?.message && response.data.meta.success) {
          toast.success(response.data.meta.message);
        }
        return response;
      },
      error => {
        const message = error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred';
        console.log(message);
        // toast.error(message);
        return Promise.reject(error);
      }
    );
  }

  // Members Service
  members = {
    list: async (organizationId: string): Promise<ApiResponse<Member[]>> =>
      this.axiosInstance.get(`/${organizationId}/members`).then(res => res),
    create: async (organizationId: string, data: Partial<Member>): Promise<ApiResponse<Member>> =>
      this.axiosInstance.post(`/${organizationId}/members`, data).then(res => res.data),
    get: async (organizationId: string, memberId: string): Promise<{ employee: Employee; attendance: Attendance[] }> =>
      this.axiosInstance.get(`/${organizationId}/members/${memberId}`).then(res => res.data),
    update: async (organizationId: string, memberId: string, data: Partial<Member>): Promise<ApiResponse<Member>> =>
      this.axiosInstance.patch(`/${organizationId}/members/${memberId}`, data).then(res => res.data),
    delete: async (organizationId: string, memberId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/members/${memberId}`).then(res => res.data),
  };

  // Categories Service
  categories = {
    list: async (organizationId: string): Promise<ApiResponse<Category[]>> =>
      this.axiosInstance.get(`/${organizationId}/categories`).then(res => res),
    create: async (organizationId: string, data: Partial<Category>): Promise<ApiResponse<Category>> =>
      this.axiosInstance
        .post(`/${organizationId}/categories`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => res.data),
    get: async (organizationId: string, categoryId: string): Promise<ApiResponse<Category>> =>
      this.axiosInstance.get(`/${organizationId}/categories/${categoryId}`).then(res => res.data),
    update: async (
      organizationId: string,
      categoryId: string,
      data: Partial<Category>
    ): Promise<ApiResponse<Category>> =>
      this.axiosInstance.patch(`/${organizationId}/categories/${categoryId}`, data).then(res => res.data),
    delete: async (organizationId: string, categoryId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/categories/${categoryId}`).then(res => res.data),
    // Add these to your API client class
    generateAICategories: async (orgId: string, aiDescription: string): Promise<ApiResponse<GeneratedCategory[]>> =>
      this.axiosInstance
        .post(
          `/${orgId}/categories/ai?type=product`,
          {
            prompt: aiDescription,
            organizationId: orgId,
          },
          { timeout: 60000 }
        )
        .then(res => res.data),

    saveGeneratedCategories: async (
      orgId: string,
      generatedCategories: GeneratedCategory[]
    ): Promise<ApiResponse<Category[]>> =>
      this.axiosInstance
        .put(`/${orgId}/categories/ai?type=product`, {
          categories: generatedCategories,
          organizationId: orgId,
        })
        .then(res => res.data),
  };

  // Locations Service
  locations = {
    list: async (organizationId: string): Promise<ApiResponse<InventoryLocation[]>> =>
      this.axiosInstance.get(`/${organizationId}/locations`).then(res => res.data),
    create: async (organizationId: string, data: Partial<InventoryLocation>): Promise<ApiResponse<InventoryLocation>> =>
      this.axiosInstance.post(`/${organizationId}/locations`, data).then(res => res.data),
    get: async (organizationId: string, locationId: string): Promise<ApiResponse<InventoryLocation>> =>
      this.axiosInstance.get(`/${organizationId}/locations/${locationId}`).then(res => res),
    update: async (
      organizationId: string,
      locationId: string,
      data: Partial<InventoryLocation>
    ): Promise<ApiResponse<InventoryLocation>> =>
      this.axiosInstance.patch(`/${organizationId}/locations/${locationId}`, data).then(res => res.data),
    delete: async (organizationId: string, locationId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/locations/${locationId}`).then(res => res.data),
  };

  // Suppliers Service
  suppliers = {
    list: async (organizationId: string): Promise<ApiResponse<Supplier[]>> =>
      this.axiosInstance.get(`/${organizationId}/suppliers`).then(res => res.data),
    create: async (organizationId: string, data: SupplierFormValues): Promise<ApiResponse<Supplier>> =>
      this.axiosInstance.post(`/${organizationId}/suppliers`, data).then(res => res.data),
    get: async (organizationId: string, supplierId: string): Promise<ApiResponse<Supplier>> =>
      this.axiosInstance.get(`/${organizationId}/suppliers/${supplierId}`).then(res => res),
    update: async (
      organizationId: string,
      supplierId: string,
      data: Partial<Supplier>
    ): Promise<ApiResponse<Supplier>> =>
      this.axiosInstance.patch(`/${organizationId}/suppliers/${supplierId}`, data).then(res => res.data),
    delete: async (organizationId: string, supplierId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/suppliers/${supplierId}`).then(res => res.data),
    search: async (
      organizationId: string,
      query: string,
      //eslint-disable-next-line
      filters?: Record<string, any>
    ): Promise<ApiResponse<Supplier[]>> =>
      this.axiosInstance
        .get(`/${organizationId}/suppliers/search`, {
          params: { q: query, ...filters },
        })
        .then(res => res.data),
    products: {
      list: async (organizationId: string, supplierId: string): Promise<ApiResponse<ProductSupplier[]>> =>
        this.axiosInstance.get(`/${organizationId}/suppliers/${supplierId}/products`).then(res => res.data),
      create: async (
        organizationId: string,
        supplierId: string,
        data: Partial<ProductSupplier>
      ): Promise<ApiResponse<ProductSupplier>> =>
        this.axiosInstance.post(`/${organizationId}/suppliers/${supplierId}/products`, data).then(res => res.data),
      delete: async (organizationId: string, supplierId: string, productId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance
          .delete(`/${organizationId}/suppliers/${supplierId}/products/${productId}`)
          .then(res => res.data),
    },
  };

  // Customers Service
  customers = {
    list: async (organizationId: string): Promise<ApiResponse<Customer[]>> =>
      this.axiosInstance.get(`/${organizationId}/customers`).then(res => res.data),
    create: async (organizationId: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> =>
      this.axiosInstance.post(`/${organizationId}/customers`, data).then(res => res.data),
    get: async (organizationId: string, customerId: string): Promise<ApiResponse<Customer>> =>
      this.axiosInstance.get(`/${organizationId}/customers/${customerId}`).then(res => res.data),
    update: async (
      organizationId: string,
      customerId: string,
      data: Partial<Customer>
    ): Promise<ApiResponse<Customer>> =>
      this.axiosInstance.patch(`/${organizationId}/customers/${customerId}`, data).then(res => res.data),
    delete: async (organizationId: string, customerId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/customers/${customerId}`).then(res => res.data),
    orders: {
      list: async (organizationId: string, customerId: string): Promise<ApiResponse<Order[]>> =>
        this.axiosInstance.get(`/${organizationId}/customers/${customerId}/orders`).then(res => res.data),
      create: async (organizationId: string, customerId: string, data: Partial<Order>): Promise<ApiResponse<Order>> =>
        this.axiosInstance.post(`/${organizationId}/customers/${customerId}/orders`, data).then(res => res.data),
    },
  };
  products = {
    list: (organizationId: string, locationId?: string): Promise<ApiResponse<ExtendedProduct[]>> => {
      const params = new URLSearchParams();
      if (locationId) {
        params.append('locationId', locationId);
      }
      return this.axiosInstance.get(`/${organizationId}/products?${params.toString()}`).then(res => res.data);
    },
    create: (organizationId: string, data: Partial<Product>): Promise<ApiResponse<Product>> =>
      this.axiosInstance.post(`/${organizationId}/products`, data).then(res => res.data),
    get: (organizationId: string, productId: string): Promise<ApiResponse<Product>> =>
      this.axiosInstance.get(`/${organizationId}/products/${productId}`).then(res => res.data),
    update: (organizationId: string, productId: string, data: Partial<Product>): Promise<ApiResponse<Product>> =>
      this.axiosInstance.patch(`/${organizationId}/products/${productId}`, data).then(res => res.data),
    delete: (organizationId: string, productId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/products/${productId}`).then(res => res.data),
    variants: {
      list: (organizationId: string, productId: string): Promise<ApiResponse<ProductVariant[]>> =>
        this.axiosInstance.get(`/${organizationId}/products/${productId}/variants`).then(res => res.data),
      create: (
        organizationId: string,
        productId: string,
        data: Partial<ProductVariant>
      ): Promise<ApiResponse<ProductVariant>> =>
        this.axiosInstance.post(`/${organizationId}/products/${productId}/variants`, data).then(res => res.data),
      get: (organizationId: string, productId: string, variantId: string): Promise<ApiResponse<ProductVariant>> =>
        this.axiosInstance.get(`/${organizationId}/products/${productId}/variants/${variantId}`).then(res => res.data),
      restock: (
        organizationId: string,
        productId: string,
        variantId: string,
        data: unknown
      ): Promise<ApiResponse<ProductVariant>> =>
        this.axiosInstance
          .post(`/${organizationId}/products/${productId}/variants/${variantId}/restock`, data)
          .then(res => res.data),
      update: (
        organizationId: string,
        productId: string,
        variantId: string,
        data: Partial<ProductVariant>
      ): Promise<ApiResponse<ProductVariant>> =>
        this.axiosInstance
          .patch(`/${organizationId}/products/${productId}/variants/${variantId}`, data)
          .then(res => res.data),
      delete: (organizationId: string, productId: string, variantId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance
          .delete(`/${organizationId}/products/${productId}/variants/${variantId}`)
          .then(res => res.data),
    },
  };

  orders = {
    // CRUD Operations
    list: async (organizationId: string): Promise<ApiResponse<Order[]>> =>
      this.axiosInstance.get(`/${organizationId}/orders`).then(res => res.data),
    //
    create: async (organizationId: string, data: CreateOrderInput): Promise<ApiResponse<Order>> =>
      this.axiosInstance.post(`/${organizationId}/orders`, data).then(res => res.data),

    get: async (organizationId: string, orderId: string): Promise<ApiResponse<ExtendedOrder>> =>
      this.axiosInstance.get(`/${organizationId}/orders/${orderId}`).then(res => res),
    stats: async (organizationId: string, dateRange?: string): Promise<ApiResponse<Order>> =>
      this.axiosInstance
        .get(`/${organizationId}/orders/stats${dateRange ? `?dateRange=${dateRange}` : ''}`)
        .then(res => res.data),

    update: async (organizationId: string, orderId: string, data: Partial<Order>): Promise<ApiResponse<Order>> =>
      this.axiosInstance.patch(`/${organizationId}/orders/${orderId}`, data).then(res => res.data),

    delete: async (organizationId: string, orderId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/orders/${orderId}`).then(res => res.data),

    // Invoice Operations
    generateInvoice: async (organizationId: string, orderId: string): Promise<ApiResponse<InvoiceResponse>> =>
      this.axiosInstance.post(`/${organizationId}/orders/${orderId}/invoice`).then(res => res.data),

    getInvoice: async (organizationId: string, orderId: string): Promise<ApiResponse<InvoiceResponse>> =>
      this.axiosInstance.get(`/${organizationId}/orders/${orderId}/invoice`).then(res => res.data),

    // Order-specific operations
    cancel: async (organizationId: string, orderId: string): Promise<ApiResponse<Order>> =>
      this.axiosInstance.post(`/${organizationId}/orders/${orderId}/cancel`).then(res => res.data),
  };

  // Sales Service
  sales = {
    list: async (
      organizationId: string,
      page: number,
      pageSize: number = 10,
      filters?: {
        search?: string;
        paymentMethod?: PaymentMethod;
        paymentStatus?: PaymentStatus;
        dateRange?: string;
      }
    ): Promise<{
      sales: Sale[];
      totalCount: number;
    }> =>
      this.axiosInstance
        .get(`/${organizationId}/sales`, {
          params: {
            page,
            pageSize,
            ...filters,
          },
        })
        .then(res => res.data),

    listVoided: async (
      organizationId: string,
      page: number,
      pageSize: number = 10,
      filters?: {
        search?: string;
        paymentMethod?: PaymentMethod;
        dateRange?: string;
      }
    ): Promise<{
      sales: Sale[];
      totalCount: number;
    }> =>
      this.axiosInstance
        .get(`/${organizationId}/sales/voided`, {
          params: {
            page,
            pageSize,
            ...filters,
          },
        })
        .then(res => res.data),

    create: async (organizationId: string, data: Partial<Sale>): Promise<ApiResponse<Sale>> =>
      this.axiosInstance.post(`/${organizationId}/sales`, data).then(res => res.data),

    get: async (organizationId: string, saleId: string): Promise<ApiResponse<Sale>> =>
      this.axiosInstance.get(`/${organizationId}/sales/${saleId}`).then(res => res.data),
    summary: async (organizationId: string, params: string): Promise<ApiResponse<SalesSummary>> =>
      this.axiosInstance.get(`/${organizationId}/sales/summary?${params}`).then(res => res),

    update: async (organizationId: string, saleId: string, data: Partial<Sale>): Promise<ApiResponse<Sale>> =>
      this.axiosInstance.patch(`/${organizationId}/sales/${saleId}`, data).then(res => res.data),

    delete: async (organizationId: string, saleId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/sales/${saleId}`).then(res => res.data),

    // Receipt Operations
    generateReceipt: async (organizationId: string, saleId: string): Promise<ApiResponse<ReceiptResponse>> =>
      this.axiosInstance.post(`/${organizationId}/sales/${saleId}/receipt`).then(res => res.data),

    getReceipt: async (organizationId: string, saleId: string): Promise<ApiResponse<ReceiptResponse>> =>
      this.axiosInstance.get(`/${organizationId}/sales/${saleId}/receipt`).then(res => res.data),

    // Reporting Operations
    generateReport: async (
      organizationId: string,
      criteria: SalesReportCriteria
    ): Promise<ApiResponse<SalesReportResponse>> =>
      this.axiosInstance.post(`/${organizationId}/sales/report`, criteria).then(res => res.data),

    export: async (organizationId: string, criteria: SalesReportCriteria): Promise<ApiResponse<Blob>> =>
      this.axiosInstance
        .post(`/${organizationId}/sales/export`, criteria, {
          responseType: 'blob',
        })
        .then(res => res.data),

    // Sales-specific operations
    refund: async (organizationId: string, saleId: string): Promise<ApiResponse<Sale>> =>
      this.axiosInstance.post(`/${organizationId}/sales/${saleId}/refund`).then(res => res.data),
  };

  inventory = {
    list: (organizationId: string): Promise<ApiResponse<InventoryItem[]>> =>
      this.axiosInstance.get(`/${organizationId}/inventory`).then(res => res.data),
    create: (organizationId: string, data: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> =>
      this.axiosInstance.post(`/${organizationId}/inventory`, data).then(res => res.data),
    restock: (organizationId: string, data: Partial<InventoryAdjustment>): Promise<ApiResponse<InventoryAdjustment>> =>
      this.axiosInstance.post(`/${organizationId}/inventory/restock`, data).then(res => res.data),
    get: (organizationId: string, inventoryId: string): Promise<ApiResponse<InventoryItem>> =>
      this.axiosInstance.get(`/${organizationId}/inventory/${inventoryId}`).then(res => res.data),
    update: (
      organizationId: string,
      inventoryId: string,
      data: Partial<InventoryItem>
    ): Promise<ApiResponse<InventoryItem>> =>
      this.axiosInstance.patch(`/${organizationId}/inventory/${inventoryId}`, data).then(res => res.data),
    delete: (organizationId: string, inventoryId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/inventory/${inventoryId}`).then(res => res.data),
    movements: {
      list: (organizationId: string, inventoryId: string): Promise<ApiResponse<InventoryMovement[]>> =>
        this.axiosInstance.get(`/${organizationId}/inventory/${inventoryId}/movements`).then(res => res.data),
      create: (
        organizationId: string,
        inventoryId: string,
        data: Partial<InventoryMovement>
      ): Promise<ApiResponse<InventoryMovement>> =>
        this.axiosInstance.post(`/${organizationId}/inventory/${inventoryId}/movements`, data).then(res => res.data),
      get: (organizationId: string, inventoryId: string, movementId: string): Promise<ApiResponse<InventoryMovement>> =>
        this.axiosInstance
          .get(`/${organizationId}/inventory/${inventoryId}/movements/${movementId}`)
          .then(res => res.data),
      update: (
        organizationId: string,
        inventoryId: string,
        movementId: string,
        data: Partial<InventoryMovement>
      ): Promise<ApiResponse<InventoryMovement>> =>
        this.axiosInstance
          .patch(`/${organizationId}/inventory/${inventoryId}/movements/${movementId}`, data)
          .then(res => res.data),
      delete: (organizationId: string, inventoryId: string, movementId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance
          .delete(`/${organizationId}/inventory/${inventoryId}/movements/${movementId}`)
          .then(res => res.data),
    },
    adjustments: {
      list: (organizationId: string, inventoryId: string): Promise<ApiResponse<InventoryAdjustment[]>> =>
        this.axiosInstance.get(`/${organizationId}/inventory/${inventoryId}/adjustments`).then(res => res.data),
      create: (
        organizationId: string,
        inventoryId: string,
        data: Partial<InventoryAdjustment>
      ): Promise<ApiResponse<InventoryAdjustment>> =>
        this.axiosInstance.post(`/${organizationId}/inventory/${inventoryId}/adjustments`, data).then(res => res.data),
      get: (
        organizationId: string,
        inventoryId: string,
        adjustmentId: string
      ): Promise<ApiResponse<InventoryAdjustment>> =>
        this.axiosInstance
          .get(`/${organizationId}/inventory/${inventoryId}/adjustments/${adjustmentId}`)
          .then(res => res.data),
      approve: (
        organizationId: string,
        inventoryId: string,
        adjustmentId: string
      ): Promise<ApiResponse<InventoryAdjustment>> =>
        this.axiosInstance
          .post(`/${organizationId}/inventory/${inventoryId}/adjustments/${adjustmentId}/approve`)
          .then(res => res.data),
      restock: (
        organizationId: string,
        inventoryId: string,
        adjustmentId: string
      ): Promise<ApiResponse<InventoryAdjustment>> =>
        this.axiosInstance
          .post(`/${organizationId}/inventory/${inventoryId}/adjustments/${adjustmentId}/restock`)
          .then(res => res.data),
      reject: (
        organizationId: string,
        inventoryId: string,
        adjustmentId: string
      ): Promise<ApiResponse<InventoryAdjustment>> =>
        this.axiosInstance
          .post(`/${organizationId}/inventory/${inventoryId}/adjustments/${adjustmentId}/reject`)
          .then(res => res.data),
      delete: (organizationId: string, inventoryId: string, adjustmentId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance
          .delete(`/${organizationId}/inventory/${inventoryId}/adjustments/${adjustmentId}`)
          .then(res => res.data),
    },
  };

  // Chat Service
  chat = {
    channels: {
      list: (organizationId: string): Promise<ApiResponse<Channel[]>> =>
        this.axiosInstance.get(`/${organizationId}/channels`).then(res => res.data),
      create: (organizationId: string, data: Partial<Channel>): Promise<ApiResponse<Channel>> =>
        this.axiosInstance.post(`/${organizationId}/channels`, data).then(res => res.data),
      get: (organizationId: string, channelId: string): Promise<ApiResponse<Channel>> =>
        this.axiosInstance.get(`/${organizationId}/channels/${channelId}`).then(res => res.data),
      update: (organizationId: string, channelId: string, data: Partial<Channel>): Promise<ApiResponse<Channel>> =>
        this.axiosInstance.patch(`/${organizationId}/channels/${channelId}`, data).then(res => res.data),
      delete: (organizationId: string, channelId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance.delete(`/${organizationId}/channels/${channelId}`).then(res => res.data),
    },
    messages: {
      list: (organizationId: string, channelId: string): Promise<ApiResponse<Message[]>> =>
        this.axiosInstance.get(`/${organizationId}/channels/${channelId}/messages`).then(res => res.data),
      create: (organizationId: string, channelId: string, data: Partial<Message>): Promise<ApiResponse<Message>> =>
        this.axiosInstance.post(`/${organizationId}/channels/${channelId}/messages`, data).then(res => res.data),
      update: (
        organizationId: string,
        channelId: string,
        messageId: string,
        data: Partial<Message>
      ): Promise<ApiResponse<Message>> =>
        this.axiosInstance
          .patch(`/${organizationId}/channels/${channelId}/messages/${messageId}`, data)
          .then(res => res.data),
      delete: (organizationId: string, channelId: string, messageId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance
          .delete(`/${organizationId}/channels/${channelId}/messages/${messageId}`)
          .then(res => res.data),
    },
    assistants: {
      list: (organizationId: string): Promise<ApiResponse<Assistant[]>> =>
        this.axiosInstance.get(`/${organizationId}/assistants`).then(res => res.data),
      create: (organizationId: string, data: Partial<Assistant>): Promise<ApiResponse<Assistant>> =>
        this.axiosInstance.post(`/${organizationId}/assistants`, data).then(res => res.data),
      get: (organizationId: string, assistantId: string): Promise<ApiResponse<Assistant>> =>
        this.axiosInstance.get(`/${organizationId}/assistants/${assistantId}`).then(res => res.data),
      update: (
        organizationId: string,
        assistantId: string,
        data: Partial<Assistant>
      ): Promise<ApiResponse<Assistant>> =>
        this.axiosInstance.patch(`/${organizationId}/assistants/${assistantId}`, data).then(res => res.data),
      delete: (organizationId: string, assistantId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance.delete(`/${organizationId}/assistants/${assistantId}`).then(res => res.data),
      chats: {
        list: (organizationId: string, assistantId: string): Promise<ApiResponse<AssistantMessage[]>> =>
          this.axiosInstance.get(`/${organizationId}/assistants/${assistantId}/chats`).then(res => res.data),
        create: (
          organizationId: string,
          assistantId: string,
          data: Partial<AssistantMessage>
        ): Promise<ApiResponse<AssistantMessage>> =>
          this.axiosInstance.post(`/${organizationId}/assistants/${assistantId}/chats`, data).then(res => res.data),
      },
    },
  };

  // Reports Service
  reports = {
    sales: (organizationId: string, params: string) =>
      this.axiosInstance.post(`/${organizationId}/reports/sales?${params}`).then(res => res.data),
    //eslint-disable-next-line
    generateInventory: (organizationId: string, criteria: any): Promise<ApiResponse<any>> =>
      this.axiosInstance.post(`/${organizationId}/reports/inventory`, criteria).then(res => res.data),
  };

  // Finance Service
  finance = {
    expenses: {
      list: (organizationId: string): Promise<ApiResponse<Expense[]>> =>
        this.axiosInstance.get(`/${organizationId}/expenses`).then(res => res.data),
      create: (organizationId: string, data: Partial<Expense>): Promise<ApiResponse<Expense>> =>
        this.axiosInstance.post(`/${organizationId}/expenses`, data).then(res => res.data),
      get: (organizationId: string, expenseId: string): Promise<ApiResponse<Expense>> =>
        this.axiosInstance.get(`/${organizationId}/expenses/${expenseId}`).then(res => res.data),
      update: (organizationId: string, expenseId: string, data: Partial<Expense>): Promise<ApiResponse<Expense>> =>
        this.axiosInstance.patch(`/${organizationId}/expenses/${expenseId}`, data).then(res => res.data),
      delete: (organizationId: string, expenseId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance.delete(`/${organizationId}/expenses/${expenseId}`).then(res => res.data),
    },
    budgets: {
      list: (organizationId: string): Promise<ApiResponse<Budget[]>> =>
        this.axiosInstance.get(`/${organizationId}/budgets`).then(res => res.data),
      create: (organizationId: string, data: Partial<Budget>): Promise<ApiResponse<Budget>> =>
        this.axiosInstance.post(`/${organizationId}/budgets`, data).then(res => res.data),
      get: (organizationId: string, budgetId: string): Promise<ApiResponse<Budget>> =>
        this.axiosInstance.get(`/${organizationId}/budgets/${budgetId}`).then(res => res.data),
      update: (organizationId: string, budgetId: string, data: Partial<Budget>): Promise<ApiResponse<Budget>> =>
        this.axiosInstance.patch(`/${organizationId}/budgets/${budgetId}`, data).then(res => res.data),
      delete: (organizationId: string, budgetId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance.delete(`/${organizationId}/budgets/${budgetId}`).then(res => res.data),
    },
  };

  // Invitations Service
  invitations = {
    list: (organizationId: string): Promise<ApiResponse<Invitation[]>> =>
      this.axiosInstance.get(`/${organizationId}/invitations`).then(res => res.data),
    create: (
      organizationId: string,
      data: { email: string; role: MemberRole; channelId?: string }
    ): Promise<ApiResponse<Invitation>> =>
      this.axiosInstance.post(`/${organizationId}/invitations`, data).then(res => res.data),
    delete: (organizationId: string, invitationId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/invitations/${invitationId}`).then(res => res.data),
  };

  // Organization Service
  organization = {
    getSettings: (organizationId: string): Promise<ApiResponse<OrganizationSettings>> =>
      this.axiosInstance.get(`/${organizationId}/settings`).then(res => res.data),
    updateSettings: (
      organizationId: string,
      data: Partial<OrganizationSettings>
    ): Promise<ApiResponse<OrganizationSettings>> =>
      this.axiosInstance.patch(`/${organizationId}/settings`, data).then(res => res.data),
    roles: {
      list: (organizationId: string): Promise<ApiResponse<CustomRole[]>> =>
        this.axiosInstance.get(`/${organizationId}/roles`).then(res => res),
      create: (organizationId: string, data: Partial<CustomRole>): Promise<ApiResponse<CustomRole>> =>
        this.axiosInstance.post(`/${organizationId}/roles`, data).then(res => res.data),
      get: (organizationId: string, roleId: string): Promise<ApiResponse<CustomRole>> =>
        this.axiosInstance.get(`/${organizationId}/roles/${roleId}`).then(res => res.data),
      update: (organizationId: string, roleId: string, data: Partial<CustomRole>): Promise<ApiResponse<CustomRole>> =>
        this.axiosInstance.patch(`/${organizationId}/roles/${roleId}`, data).then(res => res.data),
      delete: (organizationId: string, roleId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance.delete(`/${organizationId}/roles/${roleId}`).then(res => res.data),
    },
    invitations: {
      list: (organizationId: string): Promise<ApiResponse<Invitation[] & { url: string }>> =>
        this.axiosInstance.get(`/${organizationId}/invitations`).then(res => res.data),
      create: (
        organizationId: string,
        data: {
          inviteeEmail: string;
          role: MemberRole;
        }
      ): Promise<ApiResponse<Invitation>> =>
        this.axiosInstance.post(`/${organizationId}/invitations/org`, data).then(res => res.data),
      delete: (organizationId: string, invitationId: string): Promise<ApiResponse<void>> =>
        this.axiosInstance.delete(`/${organizationId}/invitations/${invitationId}`).then(res => res.data),
    },
  };
  roles = {
    // List all custom roles for an organization
    list: async (organizationId: string): Promise<ApiResponse<CustomRole[]>> =>
      this.axiosInstance.get(`/${organizationId}/roles`).then(res => res.data),

    // Create a new custom role
    create: async (organizationId: string, data: Partial<CustomRole>): Promise<ApiResponse<CustomRole>> =>
      this.axiosInstance.post(`/${organizationId}/roles`, data).then(res => res.data),

    // Get a specific custom role
    get: async (organizationId: string, roleId: string): Promise<ApiResponse<CustomRole>> =>
      this.axiosInstance.get(`/${organizationId}/roles/${roleId}`).then(res => res.data),

    // Update a custom role
    update: async (
      organizationId: string,
      roleId: string,
      data: Partial<CustomRole>
    ): Promise<ApiResponse<CustomRole>> =>
      this.axiosInstance.patch(`/${organizationId}/roles/${roleId}`, data).then(res => res.data),

    // Delete a custom role
    delete: async (organizationId: string, roleId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/roles/${roleId}`).then(res => res.data),

    // Assign a custom role to a member
    assignToMember: async (organizationId: string, memberId: string, roleId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.post(`/${organizationId}/members/${memberId}/roles/${roleId}`).then(res => res.data),

    // Remove a custom role from a member
    removeFromMember: async (organizationId: string, memberId: string, roleId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/${organizationId}/members/${memberId}/roles/${roleId}`).then(res => res.data),

    // List all members with a specific custom role
    listMembersWithRole: async (organizationId: string, roleId: string): Promise<ApiResponse<Member[]>> =>
      this.axiosInstance.get(`/${organizationId}/roles/${roleId}/members`).then(res => res.data),

    // Update permissions for a custom role
    updatePermissions: async (
      organizationId: string,
      roleId: string,
      permissions: Permission[]
    ): Promise<ApiResponse<CustomRole>> =>
      this.axiosInstance.put(`/${organizationId}/roles/${roleId}/permissions`, { permissions }).then(res => res.data),

    // Toggle active status of a custom role
    toggleActiveStatus: async (
      organizationId: string,
      roleId: string,
      isActive: boolean
    ): Promise<ApiResponse<CustomRole>> =>
      this.axiosInstance.patch(`/${organizationId}/roles/${roleId}/status`, { isActive }).then(res => res.data),
    addFromTemplate: async (organizationId: string, roleTemplateName: string): Promise<ApiResponse<CustomRole>> =>
      this.axiosInstance.post(`/${organizationId}/roles/add-template`, { roleTemplateName }).then(res => res.data),

    changeMemberRole: (organizationId: string, memberId: string, newRole: string) =>
      this.axiosInstance.patch(`/${organizationId}/members/${memberId}`, {
        role: newRole,
      }),
  };
  notifications = {
    list: async (params?: { limit?: number; unreadOnly?: boolean }): Promise<ApiResponse<Notification[]>> =>
      axios.get('/api/users/current/notifications', { params }).then(res => res),

    markAsRead: async (notificationId: string): Promise<ApiResponse<Notification>> =>
      axios.patch(`/api/users/current/notifications/${notificationId}/read`).then(res => res),

    markAllAsRead: async (): Promise<ApiResponse<void>> =>
      axios.patch('/api/users/current/notifications/read-all').then(res => res),

    // Optional: Add more methods as needed
    get: async (notificationId: string): Promise<ApiResponse<Notification>> =>
      axios.get(`/api/users/current/notifications/${notificationId}`).then(res => res),

    delete: async (notificationId: string): Promise<ApiResponse<void>> =>
      axios.delete(`/api/users/current/notifications/${notificationId}`).then(res => res),

    deleteAllRead: async (): Promise<ApiResponse<void>> =>
      axios.delete('/api/users/current/notifications/read').then(res => res),

    deleteAll: async (): Promise<ApiResponse<void>> =>
      axios.delete('/api/users/current/notifications').then(res => res),
  };

  loyalty = {
    // Program management
    getProgram: async (organizationId: string): Promise<ApiResponse<LoyaltyProgram>> =>
      this.axiosInstance.get(`/api/loyalty/organizations/${organizationId}/program`).then(res => res.data),

    createProgram: async (data: CreateLoyaltyProgramInput): Promise<ApiResponse<LoyaltyProgram>> =>
      this.axiosInstance.post('/api/loyalty/programs', data).then(res => res.data),

    updateProgram: async (programId: string, data: UpdateLoyaltyProgramInput): Promise<ApiResponse<LoyaltyProgram>> =>
      this.axiosInstance.put(`/api/loyalty/programs/${programId}`, data).then(res => res.data),

    deleteProgram: async (programId: string): Promise<ApiResponse<void>> =>
      this.axiosInstance.delete(`/api/loyalty/programs/${programId}`).then(res => res.data),

    // Points configuration
    getPointsConfig: async (organizationId: string): Promise<ApiResponse<PointsConfig[]>> =>
      this.axiosInstance.get(`/api/loyalty/organizations/${organizationId}/points-config`).then(res => res.data),

    setPointsConfig: async (data: SetPointsConfigInput): Promise<ApiResponse<PointsConfig[]>> =>
      this.axiosInstance
        .post(`/api/loyalty/organizations/${data.organizationId}/points-config`, {
          configs: data.configs,
        })
        .then(res => res.data),
  };
}

// Singleton instance
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/organizations'
);


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 403 errors (unauthorized/forbidden)
        if (error?.response?.status === 403) {
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 60 * 12, // 12 hours
      staleTime: 1000 * 60 * 30, // 30 minutes
      persister(queryFn, context, query) {
        if (query.state.data) {
          localStorage.setItem(query.queryKey.toString(), JSON.stringify(query.state.data));
        }
        return queryFn(context);
      },
    },
    mutations: {
      onSuccess: (data: any) => {
        if (data.meta?.message && data.meta.success) {
          toast.success(data.meta.message);
        }
      },
      onError: (error: unknown) => {
        let errorMessage = 'An unexpected error occurred';
        let errorStatus: number | undefined;

        // Handle different error formats
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error instanceof Error && error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          const err = error as any;
          errorStatus = err.response?.status;

          // Handle 403 errors specifically
          if (errorStatus === 403) {
            errorMessage = 'Access denied. You do not have permission to perform this action.';
          }
          // Handle other error formats
          else if (err.response?.data?.error) {
            if (typeof err.response.data.error === 'string') {
              errorMessage = err.response.data.error;
            } else if (typeof err.response.data.error === 'object' && err.response.data.error?.message) {
              errorMessage = err.response.data.error.message;
            }
          } else if (err.response?.data?.message && typeof err.response.data.message === 'string') {
            errorMessage = err.response.data.message;
          } else if (err.message && typeof err.message === 'string') {
            errorMessage = err.message;
          }
        }

        // Log detailed error information for debugging
        console.log('Mutation error:', {
          error,
          status: errorStatus,
          extractedMessage: errorMessage,
        });

        // Custom toast for 403 errors
        if (errorStatus === 403) {
          toast.error('Permission Required', {
            description: errorMessage,
            duration: 5000,
            action: {
              label: 'Request Access',
              onClick: () => {
                // Add your access request logic here
                console.log('Request access clicked');
              },
            },
          });
        } else {
          // Default error toast for other errors
          toast.error(errorMessage, {
            description:
              errorMessage !== 'An unexpected error occurred' ? undefined : 'Please try again or contact support.',
          });
        }
      },
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}