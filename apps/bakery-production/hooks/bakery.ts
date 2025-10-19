import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BatchFormData, RecipeFormData } from '@/lib/validation';
import { FormattedBatch, Recipe, Template, BakeryBaker, BatchStatus, SystemUnit, BakerySettings, Batch } from '@/types';
import { bakerySettingsSchema } from '@/lib/validation';
import { useOrgStore } from '@org/store';
import api from '@/lib/axios';

// Types
export interface BakeryCategory {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  recipes?: any[];
  templates?: any[];
  batches?: any[];
  updatedAt?: Date;
}

export interface RecipeIngredient {
  quantity: number;
  ingredientVariant: {
    buyingPrice: number;
  };
}

export interface StockItem {
  id: string;
  name: string;
  current: number;
  max: number;
  reorder: number;
  unit: string;
}

export interface RestockRecord {
  id: string;
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  supplier: string;
  date: Date;
  notes?: string;
}

export interface UsageRecord {
  id: string;
  ingredientId: string;
  quantity: number;
  unitId: string;
  unit: SystemUnit;
  usedFor: string;
  date: Date;
  cost: number;
  batchId?: string;
  batchStatus?: BatchStatus;
}

export interface OverviewData {
  batches: Batch[];
  recipes: Recipe[];
  templates: Template[];
  stockData: StockItem[];
  ingredients: RecipeIngredient[];
}

interface InventoryRecordsResponse {
  restockRecords: RestockRecord[];
  usageRecords: UsageRecord[];
}

// Constants
const API_BASE = '/api';

// Generic API functions with axios and error handling
const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    try {
      const { data } = await api.get<T>(url);
      return data;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error?.response?.data?.message || 'Failed to fetch data');
    }
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    try {
      const { data: response } = await api.post<T>(url, data);
      return response;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error?.response?.data?.message || 'Failed to create data');
    }
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    try {
      const { data: response } = await api.patch<T>(url, data);
      return response;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error?.response?.data?.message || 'Failed to update data');
    }
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    try {
      const { data: response } = await api.put<T>(url, data);
      return response;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error?.response?.data?.message || 'Failed to update data');
    }
  },

  delete: async (url: string): Promise<void> => {
    try {
      await api.delete(url);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error?.response?.data?.message || 'Failed to delete data');
    }
  },
};

// Generic hook factories
const createQueryHook = <T>(key: string[], fetchFn: () => Promise<T>, enabled: boolean = true, options: any = {}) => ({
  queryKey: key,
  queryFn: fetchFn,
  enabled,
  ...options,
});

const createMutationHook = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateQueries: string[][],
  queryClient: any
) => ({
  mutationFn,
  onSuccess: () => {
    invalidateQueries.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  },
});

// Batches
export const useBatches = (filters?: { search?: string; category?: string; status?: string; sortBy?: string }) => {
  const queryKey = ['batches', filters];

  return useQuery({
    ...createQueryHook(
      queryKey,
      async () => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);

        return apiClient.get<{ data: FormattedBatch[]; metadata: any }>(
          `/bakery/batches?${params}`
        );
      },
    ),
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation(
    createMutationHook(
      (batchData: BatchFormData) => apiClient.post<Batch>(`/bakery/batches`, batchData),
      [['batches']],
      queryClient
    )
  );
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...batchData }: BatchFormData & { id: string }) =>
      apiClient.patch<Batch>(`/bakery/batches/${id}`, batchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: string) => {
      await apiClient.delete(`/bakery/batches/${batchId}`);
      return batchId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

// Batch actions
const createBatchActionHook = (action: string) => {
  return () => {
    const queryClient = useQueryClient();
    const locationId = useOrgStore(state => state.locationId);

    return useMutation({
      mutationFn: async (batchId: string) => {
        const url =
          action === 'complete'
            ? `/bakery/batches/${batchId}/${action}?locationId=${locationId}`
            : `/bakery/batches/${batchId}/${action}`;

        return apiClient.post<Batch>(url);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['batches'] });
      },
    });
  };
};

export const useStartBatch = createBatchActionHook('start');
export const useCompleteBatch = createBatchActionHook('complete');
export const useCancelBatch = createBatchActionHook('cancel');

// Recipes
export const useRecipes = () => {

  return useQuery({
    ...createQueryHook(
      ['recipes'],
      () => apiClient.get<Recipe[]>(`/bakery/recipes`),
    ),
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeData: RecipeFormData) =>
      apiClient.post<Recipe>(`/bakery/recipes`, recipeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...recipeData }: RecipeFormData & { id: string }) =>
      apiClient.patch<Recipe>(`/bakery/recipes/${id}`, recipeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/bakery/recipes/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

// Templates
export const useTemplates = () => {

  return useQuery<Template[], Error>({
    ...createQueryHook(
      ['templates'],
      () => apiClient.get<Template[]>(`/bakery/templates`),
    ),
  });
};

export const useTemplate = (templateId: string) => {

  return useQuery<Template, Error>({
    ...createQueryHook(
      ['template', templateId],
      () => apiClient.get<Template>(`/bakery/templates/${templateId}`),
    ),
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData: unknown) =>
      apiClient.post<Template>(`/bakery/templates`, templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<Template, Error, { templateId: string; data: unknown }>({
    mutationFn: async ({ templateId, data }) =>
      apiClient.patch<Template>(`/bakery/templates/${templateId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', variables.templateId] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async templateId => {
      await apiClient.delete(`/bakery/templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

// Bakery Categories
export const useBakeryCategories = () => {

  return useQuery<BakeryCategory[], Error>({
    ...createQueryHook(
      ['bakeryCategories'],
      () => apiClient.get<BakeryCategory[]>(`/bakery/categories`),
    ),
  });
};

export const useBakeryCategory = (categoryId: string) => {

  return useQuery<BakeryCategory, Error>({
    ...createQueryHook(
      ['bakeryCategory', categoryId],
      () => apiClient.get<BakeryCategory[]>(`/bakery/categories/${categoryId}`),
    ),
  });
};

export const useCreateBakeryCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<BakeryCategory, Error, Partial<BakeryCategory>>({
    mutationFn: async newCategoryData =>
      apiClient.post<BakeryCategory>(`/bakery/categories`, newCategoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakeryCategories'] });
    },
  });
};

export const useUpdateBakeryCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<BakeryCategory, Error, { id: string; data: Partial<BakeryCategory> }>({
    mutationFn: async ({ id, data: updateData }) =>
      apiClient.put<BakeryCategory>(`/bakery/categories/${id}`, updateData),
    onSuccess: updatedCategory => {
      queryClient.invalidateQueries({ queryKey: ['bakeryCategories'] });
      queryClient.invalidateQueries({ queryKey: ['bakeryCategory', updatedCategory.id] });
    },
  });
};

export const useDeleteBakeryCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async categoryId => {
      await apiClient.delete(`/bakery/categories/${categoryId}`);
    },
    onSuccess: (_, deletedCategoryId) => {
      queryClient.invalidateQueries({ queryKey: ['bakeryCategories'] });
      queryClient.removeQueries({ queryKey: ['bakeryCategory', deletedCategoryId] });
    },
  });
};

// Bakery Settings & Bakers
export const useBakerySettings = () => {

  return useQuery<BakerySettings, Error>({
    ...createQueryHook(
      ['bakerySettings'],
      () => apiClient.get<BakerySettings>(`/bakery/settings`),
    ),
  });
};

export const useUpdateBakerySettings = () => {
  const queryClient = useQueryClient();

  return useMutation<BakerySettings, Error, unknown>({
    mutationFn: async (data: unknown) => {
      const validatedData = bakerySettingsSchema.parse(data);
      return apiClient.put<BakerySettings>(`/bakery/settings`, validatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakerySettings'] });
    },
  });
};

export const useBakers = () => {

  return useQuery<BakeryBaker[], Error>({
    ...createQueryHook(
      ['bakers'],
      () => apiClient.get<BakeryBaker[]>(`/bakery/bakers`),
    ),
  });
};

export const useAddBaker = () => {
  const queryClient = useQueryClient();

  return useMutation<BakeryBaker, Error, { memberId: string; specialties: string[] }>({
    mutationFn: async ({ memberId, specialties }) =>
      apiClient.post<BakeryBaker>(`/bakery/bakers`, { memberId, specialties }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakers'] });
      queryClient.invalidateQueries({ queryKey: ['bakerySettings'] });
    },
  });
};

export const useRemoveBaker = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { memberId: string }>({
    mutationFn: async ({ memberId }) => {
      await apiClient.delete(`/bakery/bakers/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakers'] });
      queryClient.invalidateQueries({ queryKey: ['bakerySettings'] });
    },
  });
};

// Ingredients
export const useListIngredients = () => {

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    ...createQueryHook(
      ['raw-materials'],
      () => apiClient.get<RecipeIngredient>(`/bakery/ingredients`),
    ),
  });

  return {
    ingredients: data || [],
    isLoading: isLoading,
    isFetching,
    isError: !!error,
    error,
    refetch,
  };
};

export function useBakerySettingsManagement() {
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useBakerySettings();
  const { data: bakers, isLoading: bakersLoading, error: bakersError } = useBakers();

  const updateSettings = useUpdateBakerySettings();
  const addBaker = useAddBaker();
  const removeBaker = useRemoveBaker();

  return {
    settings,
    isLoading: settingsLoading || bakersLoading,
    error: settingsError || bakersError,

    updateSettings: updateSettings.mutate,
    updateSettingsAsync: updateSettings.mutateAsync,
    isUpdating: updateSettings.isPending,

    bakers,
    addBaker: addBaker.mutate,
    addBakerAsync: addBaker.mutateAsync,
    isAddingBaker: addBaker.isPending,

    removeBaker: removeBaker.mutate,
    removeBakerAsync: removeBaker.mutateAsync,
    isRemovingBaker: removeBaker.isPending,
  };
}

// Overview Data
export const useBakeryData = () => {

  return useQuery({
    ...createQueryHook(
      ['data'],
      () => apiClient.get<OverviewData>(`/bakery`),
    ),
  });
};

// Inventory Records
export const useInventoryRecords = () => {

  return useQuery<InventoryRecordsResponse, Error>({
    ...createQueryHook(
      ['inventory-records'],
      () => apiClient.get<InventoryRecordsResponse>(`/bakery/ingredients/records`),
    ),
  });
};


export const useRestockInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data:any) => await apiClient.post(`/bakery/products/${data?.productId!}/variants/${data?.variantId!}/restock`, data)
          .then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory'],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
    },
  }); 
};