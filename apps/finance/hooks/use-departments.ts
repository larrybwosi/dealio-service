"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export const DEPARTMENT_KEYS = {
  all: ["departments"] as const,
  lists: () => [...DEPARTMENT_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...DEPARTMENT_KEYS.lists(), filters] as const,
  details: () => [...DEPARTMENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DEPARTMENT_KEYS.details(), id] as const,
}

interface DepartmentFilters {
  status?: string
}

export function useDepartments(filters?: DepartmentFilters) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.list(filters || {}),
    queryFn: () => apiClient.getDepartments(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.detail(id),
    queryFn: () => apiClient.getDepartment(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => apiClient.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.lists() })
      toast.success("Department created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create department")
    },
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateDepartment(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.detail(id) })
      toast.success("Department updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update department")
    },
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_KEYS.lists() })
      toast.success("Department deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete department")
    },
  })
}
