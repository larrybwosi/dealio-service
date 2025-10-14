import api from '@/lib/axios';
import { useOrgStore } from '@org/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Locations
export const useListLocations = () => {
  const organizationId = useOrgStore(state => state.organizationId);
  const { data, isLoading, error } = useQuery({
    queryKey: ['locations', organizationId],
    queryFn: () => api.get(`/${organizationId}/locations`).then(res => res.data),
    enabled: !!organizationId,
  });
  
  return { data:data?.warehouses || [], isLoading, error}
};
