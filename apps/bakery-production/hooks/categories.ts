import api from '@/lib/axios';
import { useOrgStore } from '@org/store';
import { useQuery } from '@tanstack/react-query';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  parentId?: string | null;
  totalValue: number;
  createdAt: string;
  isActive?: boolean;
  requiresApproval?: boolean;
  code?: string;
  defaultBudget?: number;
}


export interface GeneratedCategory {
  name: string;
  description: string;
  code: string;
  color: string;
  defaultBudget: number;
}

// Categories
export const useListCategories = () => {
  const organizationId = useOrgStore(state => state.organizationId);
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['categories', organizationId],
    queryFn: async () => await api.get(`/${organizationId}/categories`).then(res => res.data),
    enabled: !!organizationId,
  });
  return { data: data?.data || [], isLoading, error, refetch };
};
