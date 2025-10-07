import {
  UpdatedUserResponse,
  UpdateUserPayload,
  UserOrganizationProfile,
  UserProfileError,
  UserUpdateError,
} from '@/utils/interfaces/user';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const fetchUserOrganizationProfile = async (
  userId: string
): Promise<UserOrganizationProfile> => {
  const { data } = await axios.get<UserOrganizationProfile>(
    `/api/users/${userId}/profile`
  );
  return data;
};

export const useUserOrganizationProfile = (
  userId: string,
  options?: { enabled?: boolean }
): UseQueryResult<UserOrganizationProfile, AxiosError<UserProfileError>> => {
  return useQuery<UserOrganizationProfile, AxiosError<UserProfileError>>({
    queryKey: ["userOrganizationProfile", userId], // Query key
    queryFn: () => fetchUserOrganizationProfile(userId),
    enabled: options?.enabled !== undefined ? options.enabled : true, // Only run query if IDs are present and enabled
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // cacheTime: 1000 * 60 * 30, // 30 minutes
    // retry: 1,
  });
};

interface UpdateUserVariables {
  userId: string;
  payload: UpdateUserPayload;
}

const updateUserProfile = async ({
  payload,
}: UpdateUserVariables): Promise<UpdatedUserResponse> => {
  const { data } = await axios.patch<UpdatedUserResponse>(
    `/api/users/current`,
    payload
  );
  return data;
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Success toast
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved.",
      });
    },
    onError: (error: AxiosError<UserUpdateError>) => {
      // Error toast
      toast.error("Failed to update profile", {
        description: error.response?.data?.message || error.message,
      });
    },
    // Optional: Optimistic update
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["userProfile"],
      });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<UpdatedUserResponse>([
        "userProfile",
        variables.userId,
      ]);

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData(["userProfile"], {
          ...previousUser,
          ...variables.payload,
        });
      }

      return { previousUser };
    },
    // Optional: Rollback on error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", variables.userId],
      });
    },
  });
};


export interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  address: string | null;
  role: string | null;
  departmentName: string | null;
  notificationPrefs: {
    mentions: boolean;
    taskUpdates: boolean;
    newMessages: boolean;
  } | null;
}

export const useUserProfile = () => {
  return useQuery<UserProfileData>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/current');
      return response.data;
    },
  });
};