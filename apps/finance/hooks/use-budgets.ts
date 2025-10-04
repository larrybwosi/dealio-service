import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export const BUDGET_KEYS = {
  all: ["budgets"] as const,
  lists: () => [...BUDGET_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...BUDGET_KEYS.lists(), filters] as const,
  details: () => [...BUDGET_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BUDGET_KEYS.details(), id] as const,
  analytics: (id: string) => [...BUDGET_KEYS.all, "analytics", id] as const,
}

interface BudgetFilters {
  department?: string
  status?: string
  period?: string
}

export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: BUDGET_KEYS.list(filters || {}),
    queryFn: () => apiClient.getBudgets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: BUDGET_KEYS.detail(id),
    queryFn: () => apiClient.getBudget(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useBudgetAnalytics(id: string) {
  return useQuery({
    queryKey: BUDGET_KEYS.analytics(id),
    queryFn: () => apiClient.getBudgetAnalytics(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes for analytics
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.createBudget,
    onMutate: async (newBudget) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: BUDGET_KEYS.lists() })

      // Snapshot previous value
      const previousBudgets = queryClient.getQueryData(BUDGET_KEYS.lists())

      // Optimistically update
      queryClient.setQueryData(BUDGET_KEYS.lists(), (old: any) => {
        if (!old) return { data: [newBudget], total: 1 }
        return {
          ...old,
          data: [{ ...newBudget, id: `temp-${Date.now()}` }, ...old.data],
          total: old.total + 1,
        }
      })

      return { previousBudgets }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.lists() })
      toast.success("Budget created successfully")
    },
    onError: (error: Error, newBudget, context) => {
      // Rollback optimistic update
      if (context?.previousBudgets) {
        queryClient.setQueryData(BUDGET_KEYS.lists(), context.previousBudgets)
      }
      toast.error(error.message || "Failed to create budget")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.lists() })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateBudget(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: BUDGET_KEYS.detail(id) })

      const previousBudget = queryClient.getQueryData(BUDGET_KEYS.detail(id))

      queryClient.setQueryData(BUDGET_KEYS.detail(id), (old: any) => ({
        ...old,
        data: { ...old?.data, ...data },
      }))

      return { previousBudget }
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.detail(id) })
      toast.success("Budget updated successfully")
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousBudget) {
        queryClient.setQueryData(BUDGET_KEYS.detail(id), context.previousBudget)
      }
      toast.error(error.message || "Failed to update budget")
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.deleteBudget,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: BUDGET_KEYS.lists() })

      const previousBudgets = queryClient.getQueryData(BUDGET_KEYS.lists())

      queryClient.setQueryData(BUDGET_KEYS.lists(), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.filter((budget: any) => budget.id !== id),
          total: old.total - 1,
        }
      })

      return { previousBudgets }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.lists() })
      toast.success("Budget deleted successfully")
    },
    onError: (error: Error, id, context) => {
      if (context?.previousBudgets) {
        queryClient.setQueryData(BUDGET_KEYS.lists(), context.previousBudgets)
      }
      toast.error(error.message || "Failed to delete budget")
    },
  })
}
