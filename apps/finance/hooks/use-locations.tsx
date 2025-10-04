"use client"

import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"

interface Location {
  id: string
  name: string
  code: string
  type: "branch" | "warehouse" | "distribution_center" | "retail_store"
  status: "active" | "inactive" | "maintenance"
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    manager: string
  }
  capacity: {
    maxItems: number
    currentItems: number
    maxValue: number
    currentValue: number
  }
  settings: {
    autoReorder: boolean
    qualityCheck: boolean
    approvalRequired: boolean
    operatingHours: string
    timezone: string
  }
  createdAt: string
  lastUpdated: string
}

export function useLocation(id: string) {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const fetchLocation = async () => {
      try {
        const response = await fetch(`/locations/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLocation(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
  }, [id])

  return { location, isLoading, error }
}

export function useLocationsList() {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await api.get<Location[]>('/locations');
      return data;
    },
  });
}



/* ------------- CREATE ------------- */
export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Location>) => {
      const { data } = await api.post<Location>('/locations', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

/* ------------- UPDATE ------------- */
export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string } & Partial<Location>) => {
      const { id, ...payload } = input;
      const { data } = await api.patch<Location>(`/locations/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      // Optimistically update the cache or just refetch
      qc.invalidateQueries({ queryKey: ['locations'] });
      qc.invalidateQueries({ queryKey: ['location', variables.id] });
    },
  });
}

/* ------------- DELETE ------------- */
export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/locations/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}
