import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MemberRole } from '@/prisma/client';
import { useOrgStore } from '@org/store';
import api from '@/lib/axios';

export interface Member {
  id: string;
  name: string;
  email: string;
  username: string;
  role: MemberRole;
  customRoles: string[];
  isActive: boolean;
  image?: string | null;
  lastActive?: string;
  status?: string;
  tags?: string[];
  createdAt: string
  isBanned?: boolean
  department: any;
}

// Members
export const useListMembers = () => {
  const organizationId = useOrgStore(state => state.organizationId);
  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ['members', organizationId],
    queryFn: () => api.get(`/${organizationId}/members`).then(res => res),
    enabled: !!organizationId,
  });

  return { data: data?.data?.members as Member[] || [], isLoading, isError: !data && !!organizationId, error, refetch };
};
