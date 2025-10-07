// hooks/useLoyaltyProgram.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, useOrgStore } from '../tanstack-axios';
import { CreateLoyaltyProgramInput, UpdateLoyaltyProgramInput } from '../validations/loyalty.validators';

export const useLoyaltyProgram = () => {
  const organizationId = useOrgStore(state => state.organizationId);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['loyaltyProgram', organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required');
      return await apiClient.loyalty.getProgram(organizationId);
    },
    enabled: !!organizationId,
  });

  return {
    data: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateLoyaltyProgram = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async (input: Omit<CreateLoyaltyProgramInput, 'organizationId'>) => {
      if (!organizationId) throw new Error('Organization ID is required');
      return await apiClient.loyalty.createProgram({
        ...input,
        organizationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyProgram', organizationId] });
    },
  });
};

export const useUpdateLoyaltyProgram = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async (input: UpdateLoyaltyProgramInput) => {
      return await apiClient.loyalty.updateProgram(input.programId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyProgram', organizationId] });
    },
  });
};

export const useDeleteLoyaltyProgram = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async (programId: string) => {
      return await apiClient.loyalty.deleteProgram(programId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyProgram', organizationId] });
    },
  });
};

export const useLoyaltyPointsConfig = () => {
  const organizationId = useOrgStore(state => state.organizationId);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['loyaltyPointsConfig', organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required');
      return await apiClient.loyalty.getPointsConfig(organizationId);
    },
    enabled: !!organizationId,
  });

  return {
    data: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useSetLoyaltyPointsConfig = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation({
    mutationFn: async (configs: SetPointsConfigInput['configs']) => {
      if (!organizationId) throw new Error('Organization ID is required');
      return await apiClient.loyalty.setPointsConfig({
        organizationId,
        configs,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyPointsConfig', organizationId] });
    },
  });
};
