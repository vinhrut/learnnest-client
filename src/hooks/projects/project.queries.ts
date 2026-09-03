import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { projectApi } from '@/api/project.api';
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  AddMemberRequest,
} from '@/types/project';

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
  members: (projectId: string) => [...projectKeys.all, 'members', projectId] as const,
  availableUsers: (projectId: string) => [...projectKeys.all, 'available', projectId] as const,
};

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectApi.getProjects(),
    placeholderData: keepPreviousData,
  });
}

export function useProjectQuery(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => projectApi.getProject(id!),
    enabled: !!id,
  });
}

export function useProjectMembersQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.members(projectId ?? ''),
    queryFn: () => projectApi.getMembers(projectId!),
    enabled: !!projectId,
  });
}

export function useAvailableUsersQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.availableUsers(projectId ?? ''),
    queryFn: () => projectApi.getAvailableUsers(projectId!),
    enabled: !!projectId,
  });
}

function useInvalidateProjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: projectKeys.all });
}

export function useCreateProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectApi.createProject(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectRequest }) =>
      projectApi.updateProject(id, payload),
    onSuccess: invalidate,
  });
}

export function useAddProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: AddMemberRequest }) =>
      projectApi.addMember(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.availableUsers(projectId) });
    },
  });
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectApi.removeMember(projectId, userId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.availableUsers(projectId) });
    },
  });
}
