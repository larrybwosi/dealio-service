import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export const EXPENSE_KEYS = {
  all: ["expenses"] as const,
  lists: () => [...EXPENSE_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...EXPENSE_KEYS.lists(), filters] as const,
  details: () => [...EXPENSE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EXPENSE_KEYS.details(), id] as const,
}

export function useExpenses(filters?: {
  status?: string
  category?: string
  submitterId?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: EXPENSE_KEYS.list(filters || {}),
    queryFn: () => apiClient.getExpenses(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: EXPENSE_KEYS.detail(id),
    queryFn: () => apiClient.getExpense(id),
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data)=> apiClient.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() })
      toast.success("Expense created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create expense")
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateExpense(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() })
      queryClient.setQueryData(EXPENSE_KEYS.detail(variables.id), data)
      toast.success("Expense updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update expense")
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() })
      toast.success("Expense deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete expense")
    },
  })
}

export function useApproveExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => apiClient.approveExpense(id, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() })
      queryClient.setQueryData(EXPENSE_KEYS.detail(variables.id), data)
      toast.success("Expense approved successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve expense")
    },
  })
}

export function useRejectExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => apiClient.rejectExpense(id, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() })
      queryClient.setQueryData(EXPENSE_KEYS.detail(variables.id), data)
      toast.success("Expense rejected successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject expense")
    },
  })
}

export function useBulkApproveExpenses() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.bulkApproveExpenses,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() })
      toast.success(data.message || "Expenses approved successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve expenses")
    },
  })
}
