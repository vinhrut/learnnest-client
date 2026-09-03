import { hasRole } from '@/stores/auth.store';
import type { AuthUser } from '@/types/auth';
import type { Project } from '@/types/project';
import type { Task, TaskExtensionRequest, TaskStatus } from '@/types/task';

type MaybeUser = AuthUser | null | undefined;

export function canManageUsers(user: MaybeUser): boolean {
  return hasRole(user, 'ADMIN');
}

export function canCreateProject(user: MaybeUser): boolean {
  return hasRole(user, 'LEAD');
}

export function canManageProject(
  user: MaybeUser,
  project: Project | null | undefined,
): boolean {
  if (!user || !project) return false;
  return project.owner_id === user.id;
}

export function canCreateTask(user: MaybeUser): boolean {
  return hasRole(user, 'LEAD', 'BA', 'USER');
}

export function canAssignTask(user: MaybeUser): boolean {
  return hasRole(user, 'LEAD');
}

function isCreator(user: MaybeUser, task: Task): boolean {
  return !!user && task.creator_id === user.id;
}

function isAssignee(user: MaybeUser, task: Task): boolean {
  return !!user && task.assignee_id === user.id;
}

function isDraftLike(task: Task): boolean {
  return task.status === 'DRAFT' || task.status === 'REJECTED';
}

export function canEditTask(user: MaybeUser, task: Task): boolean {
  if (task.status === 'CLOSED') return false;
  if (hasRole(user, 'LEAD')) return true;
  return isCreator(user, task) && isDraftLike(task);
}

export function canDeleteTask(user: MaybeUser, task: Task): boolean {
  if (hasRole(user, 'LEAD')) return true;
  return isCreator(user, task) && isDraftLike(task);
}

export function canSubmitTask(user: MaybeUser, task: Task): boolean {
  return isCreator(user, task) && isDraftLike(task);
}

export function canApproveTask(user: MaybeUser, task: Task): boolean {
  return hasRole(user, 'LEAD') && task.status === 'WAITING_APPROVAL';
}

export function canCloseTask(user: MaybeUser, task: Task): boolean {
  return hasRole(user, 'LEAD') && task.status === 'DONE';
}

export function canRequestExtension(
  user: MaybeUser,
  task: Task,
  pending: TaskExtensionRequest | null | undefined,
): boolean {
  if (pending) return false;
  if (task.status !== 'NEW' && task.status !== 'DOING') return false;
  return isAssignee(user, task) && !!task.due_date;
}

export function canReviewExtension(
  user: MaybeUser,
  pending: TaskExtensionRequest | null | undefined,
): boolean {
  return hasRole(user, 'LEAD') && pending?.status === 'PENDING';
}

type TransitionOwnership = 'creator' | 'creator_or_assignee' | 'any';

interface TransitionRule {
  to: TaskStatus;
  roles: Array<'LEAD' | 'BA' | 'USER'>;
  ownership: TransitionOwnership;
}

const STATUS_TRANSITIONS: Record<TaskStatus, TransitionRule[]> = {
  DRAFT: [
    { to: 'WAITING_APPROVAL', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator' },
  ],
  WAITING_APPROVAL: [
    { to: 'NEW', roles: ['LEAD'], ownership: 'any' },
    { to: 'REJECTED', roles: ['LEAD'], ownership: 'any' },
  ],
  NEW: [
    { to: 'DOING', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator_or_assignee' },
    { to: 'WAITING_APPROVAL', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator' },
  ],
  DOING: [
    { to: 'DONE', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator_or_assignee' },
    { to: 'NEW', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator_or_assignee' },
  ],
  DONE: [
    { to: 'CLOSED', roles: ['LEAD'], ownership: 'any' },
    { to: 'DOING', roles: ['LEAD'], ownership: 'any' },
  ],
  CLOSED: [],
  REJECTED: [
    { to: 'WAITING_APPROVAL', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator' },
    { to: 'DRAFT', roles: ['BA', 'USER', 'LEAD'], ownership: 'creator' },
  ],
};

export function canMoveTask(
  user: MaybeUser,
  task: Task,
  to: TaskStatus,
): boolean {
  const rule = STATUS_TRANSITIONS[task.status]?.find((item) => item.to === to);
  if (!rule) return false;
  if (!hasRole(user, ...rule.roles)) return false;

  if (hasRole(user, 'LEAD')) return true;

  if (rule.ownership === 'creator') return isCreator(user, task);
  if (rule.ownership === 'creator_or_assignee') {
    return isCreator(user, task) || isAssignee(user, task);
  }
  return true;
}

export function nextStatusesFor(user: MaybeUser, task: Task): TaskStatus[] {
  return (STATUS_TRANSITIONS[task.status] ?? [])
    .filter((rule) => canMoveTask(user, task, rule.to))
    .map((rule) => rule.to);
}
