"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...USER_KEYS.lists(), filters] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
}

interface UserFilters {
  role?: string
  department?: string
  status?: string
}

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: USER_KEYS.list(filters || {}),
    queryFn: () => apiClient.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => apiClient.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateUser(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) })
      toast.success("User updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user")
    },
  })
}
