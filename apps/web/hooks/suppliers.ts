import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOrgStore } from "@org/store";

export const useListSuppliers = () => {
  const organizationId = useOrgStore(state => state.organizationId);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['suppliers', organizationId],
    queryFn: async () => await apiClient.suppliers.list(organizationId!),
    enabled: !!organizationId,
  });
  return { data: data?.suppliers || [], isLoading, error, refetch };
};