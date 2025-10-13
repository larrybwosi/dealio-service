"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UnitCategory, UnitType, SystemUnit } from "@prisma/client";

// --- Type Definitions (matching the API) ---

interface ProductConversionInput {
  productId: string;
  fromSymbol: string;
  toSymbol: string;
  factor: number;
  offset?: number;
}

interface UnitFilter {
  categories?: UnitCategory[];
  businessType?: string;
  includeStandard?: boolean;
  type?: UnitType;
}

export interface ConversionData {
  fromUnit: { symbol: string; type: string };
  toUnit: { symbol: string; type: string };
  factor: number;
}

// --- Axios Instance ---

const apiClient = axios.create({
  baseURL: "/api",
});

// Helper function to build query string from filter
const buildQueryString = (filter?: UnitFilter): string => {
  if (!filter) return "";

  return Object.entries(filter)
    .filter(([, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {});
};

// --- Client Hooks ---

/**
 * Hook to fetch all system-wide unit conversion data.
 * @example const { data: conversionData, isLoading } = useConversionData();
 */
export function useConversionData() {
  return useQuery({
    queryKey: ["conversion-data"],
    queryFn: async (): Promise<ConversionData[]> => {
      const response = await apiClient.get("/units/conversions");
      return response.data;
    },
  });
}

/**
 * Hook to perform a unit conversion via an API call.
 * @param value - The numerical value to convert.
 * @param from - The symbol of the source unit (e.g., 'kg').
 * @param to - The symbol of the target unit (e.g., 'g').
 * @example const { data: convertedValue, isLoading } = useUnitConversion(1, 'kg', 'g');
 */
export function useUnitConversion(value?: number, from?: string, to?: string) {
  const canConvert = value !== undefined && from && to && from !== to;

  return useQuery({
    queryKey: ["unit-conversion", value, from, to],
    queryFn: async (): Promise<{ convertedValue: number }> => {
      const response = await apiClient.get("/units/convert", {
        params: { value, from, to },
      });
      return response.data;
    },
    enabled: !!canConvert,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since conversions don't change often
  });
}

/**
 * Hook to set a product-specific unit conversion.
 * @example
 * const { mutate: setConversion, isPending } = useSetProductConversion();
 * const handleSave = async () => {
 *   setConversion({ productId: '123', fromSymbol: 'loaf', toSymbol: 'g', factor: 500 });
 * }
 */
export function useSetProductConversion() {
  return useMutation({
    mutationFn: async (
      conversionData: ProductConversionInput
    ): Promise<any> => {
      const response = await apiClient.post(
        "/units/conversions/product",
        conversionData
      );
      return response.data;
    },
    // Optional: Add optimistic updates or side effects
    onSuccess: (data, variables) => {
      console.log("Conversion set successfully:", data);
    },
    onError: (error, variables) => {
      console.error("Failed to set conversion:", error);
    },
  });
}

// --- Additional utility hooks that might be useful ---

/**
 * Hook to invalidate units-related queries
 * Useful for refreshing data after mutations
 */
export function useUnitsInvalidator() {
  const queryClient = useQueryClient();

  return {
    invalidateUnits: () =>
      queryClient.invalidateQueries({ queryKey: ["units"] }),
    invalidateConversionData: () =>
      queryClient.invalidateQueries({ queryKey: ["conversion-data"] }),
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["conversion-data"] });
    },
  };
}

/**
 * Hook to prefetch units data
 */
export function usePrefetchUnits(filter?: UnitFilter) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ["units", filter],
      queryFn: async (): Promise<SystemUnit[]> => {
        const response = await apiClient.get("/units", {
          params: buildQueryString(filter),
        });
        return response.data;
      },
    });
  };
}
