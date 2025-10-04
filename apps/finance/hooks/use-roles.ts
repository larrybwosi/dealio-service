"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export const ROLE_KEYS = {
  all: ["roles"] as const,
  lists: () => [...ROLE_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...ROLE_KEYS.lists(), filters] as const,
  details: () => [...ROLE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ROLE_KEYS.details(), id] as const,
}

export function useRoles(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ROLE_KEYS.list(filters || {}),
    queryFn: () => apiClient.getRoles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn: () => apiClient.getRole(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => apiClient.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() })
      toast.success("Role created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create role")
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateRole(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) })
      toast.success("Role updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role")
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() })
      toast.success("Role deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete role")
    },
  })
}
