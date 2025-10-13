// hooks/use-update-organization-settings.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner'; // or your toast library
import { useOrgStore } from '../tanstack-axios';

interface OrganizationSettings {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  // Add other settings fields as needed
}

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface UpdateOrganizationSettingsOptions {
  onSuccess?: (data: OrganizationSettings, variables: OrganizationSettings) => void;
  onError?: (error: ApiErrorResponse, variables: OrganizationSettings) => void;
  // Callbacks for file handling
  onFileUpdate?: (type: 'logo' | 'banner', file: File | null) => void;
  onPreviewUpdate?: (type: 'logo' | 'banner', preview: string | null) => void;
}

interface UseUpdateOrganizationSettingsProps {
  options?: UpdateOrganizationSettingsOptions;
}


export function useUpdateOrganizationSettings({ options = {} }: UseUpdateOrganizationSettingsProps) {
  const queryClient = useQueryClient();
  const orgId = useOrgStore(state => state.organizationId);

  const mutation = useMutation({
    mutationFn: async (data: OrganizationSettings): Promise<OrganizationSettings> => {
      const response = await fetch(`/api/organizations/${orgId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw errorData;
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Call file update callbacks
      if (options.onFileUpdate) {
        options.onFileUpdate('logo', null);
        options.onFileUpdate('banner', null);
      }

      if (options.onPreviewUpdate) {
        if (variables.logo) options.onPreviewUpdate('logo', variables.logo);
        if (variables.banner) options.onPreviewUpdate('banner', variables.banner);
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['organization-settings', orgId] });

      // Show success toast
      toast.success('Success!', {
        description: 'Settings updated successfully',
      });

      // Call custom success callback
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error: ApiErrorResponse, variables) => {
      // Call custom error callback
      if (options.onError) {
        options.onError(error, variables);
      }

      // Show error toast
      toast.error('Uh oh! Something went wrong.', {
        description: error.message || 'An error occurred while saving.',
      });
    },
  });

  return mutation;
}


interface OrganizationSettings {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  // Add other settings fields as needed
}

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface UseOrganizationSettingsOptions {
  onSuccess?: (data: OrganizationSettings) => void;
  onError?: (error: ApiErrorResponse) => void;
}

export function useOrganizationSettings(options: UseOrganizationSettingsOptions = {}) {
  const orgId = useOrgStore(state => state.organizationId);
  const query = useQuery({
    queryKey: ['organization-settings', orgId],
    queryFn: async (): Promise<OrganizationSettings> => {
      if (!orgId) {
        throw new Error('Organization ID is required');
      }

      const response = await fetch(`/api/organizations/${orgId}/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings.');
      }
      return response.json();
    },
    enabled: !!orgId,
  });

  // Call success callback when data is loaded
  useEffect(() => {
    if (query.data && options.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, options.onSuccess]);

  // Call error callback when error occurs
  useEffect(() => {
    if (query.error && options.onError) {
      options.onError(query.error as ApiErrorResponse);
    }
  }, [query.error, options.onError]);

  return query;
}