import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UnitCategory } from '@/prisma/enums';
import { UnitType } from '@/types/bakery';
import api from './axios';

const API_URL = '/units';

type UnitFilter = {
  type?: UnitType;
  categories?: UnitCategory[];
  businessType?: 'bakery' | 'restaurant' | 'retail' | 'pharmacy';
  includeStandard?: boolean;
};

async function fetchUnits(filter?: UnitFilter) {
  const params: Record<string, string> = {};

  if (filter?.type) {
    params.type = filter.type;
  }

  if (filter?.businessType) {
    params.businessType = filter.businessType;
  }

  if (filter?.includeStandard !== undefined) {
    params.includeStandard = filter.includeStandard.toString();
  }

  if (filter?.categories) {
    params.categories = filter.categories.join(',');
  }

  const response = await api.get(API_URL, { params });
  return response.data;
}

// Updated React hooks
export const useUnits = (filter?: UnitFilter) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['units', filter],
    queryFn: () => fetchUnits(filter),
  });

  return { units: data, isLoading, error };
};

export interface CreateUnitOfMeasureInput {
  name: string;
  symbol: string;
  unitType?: UnitType;
  baseUnitId?: string;
  conversionFactor?: number;
  description?: string;
}

export type UpdateUnitOfMeasureInput = Partial<CreateUnitOfMeasureInput>;

export interface UnitOfMeasure {
  id: string;
  name: string;
  symbol: string;
  unitType: UnitType;
  baseUnitId: string | null;
  conversionFactor: number | null;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Specific hooks for common use cases
export const useStandardUnits = (type?: UnitType) => {
  return useUnits({
    type,
    categories: ['STANDARD'],
  });
};

export const useBakeryUnits = (type?: UnitType) => {
  return useUnits({
    type,
    businessType: 'bakery',
    includeStandard: false,
  });
};

export const useBusinessUnits = (
  businessType: 'bakery' | 'restaurant' | 'retail' | 'pharmacy',
  type?: UnitType,
  includeStandard: boolean = true
) => {
  return useUnits({
    type,
    businessType,
    includeStandard,
  });
};

export const useUnitsByType = (type: UnitType, businessType?: string) => {
  return useUnits({
    type,
    businessType,
    includeStandard: true,
  });
};

/**
 * Hook to fetch units of measure for an organization using TanStack Query and Axios.
 * @param organizationId - The ID of the organization
 * @returns TanStack Query result with units of measure
 */
export function useUnitsOfMeasure() {
  return useQuery<UnitOfMeasure[], Error>({
    queryKey: ['unitsOfMeasure'],
    queryFn: async () => {
      const response = await api.get<UnitOfMeasure[]>(`/units-of-measure`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
}

// Hook to get all units of measure
export const useGetUnitsOfMeasure = () => {
  return useQuery<UnitOfMeasure[]>({
    queryKey: ['unitsOfMeasure'],
    queryFn: async () => {
      const response = await api.get(API_URL);
      return response.data;
    },
  });
};

// Hook to get a single unit of measure by ID
export const useGetUnitOfMeasure = (id: string) => {
  return useQuery<UnitOfMeasure>({
    queryKey: ['unitOfMeasure', id],
    queryFn: async () => {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if the id is available
  });
};
