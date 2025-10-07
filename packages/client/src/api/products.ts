import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiResponse, useOrgStore } from '@/lib/tanstack-axios';
import { Product, ProductType, ProductVariant } from '@/prisma/client';

// Page
export const useListProducts = (inLocation: boolean = false) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const locationId = useOrgStore(state => state.locationId); 
  const { data, refetch, error } = useQuery({
    queryKey: ['products', organizationId, inLocation ? locationId : undefined],
    queryFn: async () => await apiClient.products.list(organizationId!, inLocation ? locationId! : undefined),
    enabled: !!organizationId,
  });
  return {
    data: data?.data || [],
    isLoading: !data,
    isError: !data && !!organizationId,
    error,
    refetch,
  };
};

interface UseProductVariantsOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  locationId?: string;
  productType?: ProductType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  includeLocation?: boolean;
}

export const useProductVariants = (options: UseProductVariantsOptions = {}) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const locationId = useOrgStore(state => state.locationId);

  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    productType,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isActive,
    includeLocation = false,
  } = options;

  // Use provided locationId or fall back to store locationId if includeLocation is true
  const finalLocationId = options.locationId || (includeLocation ? locationId : undefined);

  const queryKey = [
    'product-variants',
    organizationId,
    {
      page,
      limit,
      search,
      categoryId,
      locationId: finalLocationId,
      productType,
      sortBy,
      sortOrder,
      isActive,
      includeLocation,
    },
  ];

  const { data, refetch, error, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        includeLocation: includeLocation.toString(),
        ...(search && { search }),
        ...(categoryId && { categoryId }),
        ...(finalLocationId && { locationId: finalLocationId }),
        ...(productType && { productType }),
        ...(isActive !== undefined && { isActive: isActive.toString() }),
      });

      const response = await fetch(`/api/organizations/${organizationId}/products/variants?` + params.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch product variants');
      }

      return response.json();
    },
    enabled: !!organizationId,
    // Optional: Add staleTime and cacheTime for better performance
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: data?.data || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || page,
    totalPages: data?.totalPages || 0,
    limit: data?.limit || limit,
    isLoading: isLoading && !!organizationId,
    isFetching,
    isError: !!error && !!organizationId,
    error,
    refetch,
  };
};
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<Product>, Error, Partial<Product>>({
    mutationFn: async data => await apiClient.products.create(organizationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', organizationId] });
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<Product>, Error, Partial<Product>>({
    mutationFn: async data => await apiClient.products.update(organizationId!, productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['product', organizationId, productId] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async productId => await apiClient.products.delete(organizationId!, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', organizationId] });
    },
  });
};

export const useGetProduct = (productId?: string) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const { data, refetch, error } = useQuery<ApiResponse<Product>, Error>({
    queryKey: ['product', organizationId, productId],
    queryFn: async () => await apiClient.products.get(organizationId!, productId!),
    enabled: !!organizationId && !!productId,
  });
  
  return {
    data: data?.product || null,
    locations: data?.locations || [],
    isLoading: !data,
    isError: !data && !!organizationId && !!productId,
    error,
    refetch
  };
};

// Product Variants
export const useListProductVariants = (productId: string) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const { data, refetch, error } = useQuery<ApiResponse<ProductVariant[]>, Error>({
    queryKey: ['product-variants', organizationId, productId],
    queryFn: async () => await apiClient.products.variants.list(organizationId!, productId),
    enabled: !!organizationId && !!productId,
  });
  return {
    data: data?.data || [],
    isLoading: !data,
    isError: !data && !!organizationId && !!productId,
    error,
    refetch
  };
};

export const useCreateProductVariant = (productId: string) => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<ProductVariant>, Error, Partial<ProductVariant>>({
    mutationFn: async data => await apiClient.products.variants.create(organizationId!, productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', organizationId, productId] });
    },
  });
};

export const useUpdateProductVariant = (productId: string, variantId: string) => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<ProductVariant>, Error, Partial<ProductVariant>>({
    mutationFn: async data => await apiClient.products.variants.update(organizationId!, productId, variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', organizationId, productId] });
      queryClient.invalidateQueries({ queryKey: ['product-variant', organizationId, productId, variantId] });
    },
  });
};

export const useDeleteProductVariant = (productId: string) => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async variantId => await apiClient.products.variants.delete(organizationId!, productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', organizationId, productId] });
    },
  });
};

export const useGetProductVariant = (productId: string, variantId: string) => {
  const organizationId = useOrgStore(state => state.organizationId);
  return useQuery<ApiResponse<ProductVariant>, Error>({
    queryKey: ['product-variant', organizationId, productId, variantId],
    queryFn: async () => await apiClient.products.variants.get(organizationId!, productId, variantId),
    enabled: !!organizationId && !!productId && !!variantId,
  });
};
