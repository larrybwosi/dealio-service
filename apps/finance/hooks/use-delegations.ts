import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export const DELEGATION_KEYS = {
  all: ["delegations"] as const,
  lists: () => [...DELEGATION_KEYS.all, "list"] as const,
}

export function useDelegations() {
  return useQuery({
    queryKey: DELEGATION_KEYS.lists(),
    queryFn: apiClient.getDelegations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateDelegation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.createDelegation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DELEGATION_KEYS.lists() })
      toast.success("Delegation created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create delegation")
    },
  })
}
