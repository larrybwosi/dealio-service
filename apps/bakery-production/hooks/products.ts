import api from '@/lib/axios';
import { useOrgStore } from '@org/store';
import { useQuery } from '@tanstack/react-query';

// Page
export const useListProducts = (inLocation: boolean = false) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const locationId = useOrgStore(state => state.locationId); 
  const { data, refetch, error } = useQuery({
    queryKey: ['products', organizationId, inLocation ? locationId : undefined],
    queryFn: async () => await api.get(`/${organizationId}/products`).then(res => res.data),
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
  console.log(organizationId)

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
