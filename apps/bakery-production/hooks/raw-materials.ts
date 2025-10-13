import api from '@/lib/axios';
import { CreateRawMaterialInput, UpdateRawMaterialInput } from '@/lib/validation';
import { useOrgStore } from '@org/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


export const useRawMaterials = () => {
  const organizationId = useOrgStore(state => state.organizationId);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['raw-materials'],
    queryFn: async () => {
      const response = await api.get(`/${organizationId}/raw-materials`);
      return response.data;
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    rawMaterials: data || [],
    isLoading: isLoading && !!organizationId,
    isFetching,
    isError: !!error && !!organizationId,
    error,
    refetch,
  };
};

export const useRawMaterial = (productId: string) => {
  const organizationId = useOrgStore(state => state.organizationId);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['raw-material', productId],
    queryFn: async () => {
      const response = await api.get(`/${organizationId}/raw-materials/${productId}`);
      return response.data;
    },
    enabled: !!organizationId && !!productId,
  });

  return {
    rawMaterial: data,
    isLoading: isLoading && !!organizationId && !!productId,
    isFetching,
    isError: !!error && !!organizationId && !!productId,
    error,
  };
};

export const useCreateRawMaterial = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async (data: CreateRawMaterialInput) => {
      const response = await api.post(`/${organizationId}/raw-materials`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch raw materials list
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create raw material');
      }
      throw error;
    },
  });
};

export const useUpdateRawMaterial = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRawMaterialInput }) => {
      const response = await api.patch(`/${organizationId}/raw-materials/raw-materials/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific raw material
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
      queryClient.invalidateQueries({ queryKey: ['raw-material', variables.id] });
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update raw material');
      }
      throw error;
    },
  });
};

export const useDeleteRawMaterial = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/${organizationId}/raw-materials/raw-materials/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate raw materials list
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete raw material');
      }
      throw error;
    },
  });
};
