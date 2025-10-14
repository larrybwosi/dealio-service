import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MemberRole } from '@/prisma/client';
import axios from 'axios';
import { useOrgStore } from '@org/store';

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
    queryFn: () => axios.get(`/api/organizations/${organizationId}/members`).then(res => res),
    enabled: !!organizationId,
  });

  return { data: data?.data?.members as Member[] || [], isLoading, isError: !data && !!organizationId, error, refetch };
};
