"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export function useMemberOperations() {
  const queryClient = useQueryClient()

  const addMemberMutation = useMutation({
    mutationFn: (data: { userId: string; department: string; role?: string; startDate?: string }) =>
      apiClient.addMemberToDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      toast.success("Member added successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add member")
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (data: { userId: string; department: string }) => apiClient.removeMemberFromDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      toast.success("Member removed successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove member")
    },
  })

  const transferMemberMutation = useMutation({
    mutationFn: (data: {
      userId: string
      fromDepartment: string
      toDepartment: string
      reason: string
      effectiveDate?: string
    }) => apiClient.transferMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      toast.success("Member transferred successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to transfer member")
    },
  })

  const bulkOperationMutation = useMutation({
    mutationFn: (data: {
      operation: "add" | "remove" | "transfer"
      selectedUsers: string[]
      targetDepartment: string
      sourceDepartment?: string
      reason: string
    }) => apiClient.bulkMemberOperation(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      toast.success(`Successfully ${variables.operation}ed ${variables.selectedUsers.length} members`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to perform bulk operation")
    },
  })

  return {
    addMemberMutation,
    removeMemberMutation,
    transferMemberMutation,
    bulkOperationMutation,
  }
}
