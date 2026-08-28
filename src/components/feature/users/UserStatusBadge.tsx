import { Badge } from '@/components/ui/Badge';
import { USER_STATUS_LABEL, type UserStatus } from '@/types/user';

const TONE: Record<UserStatus, 'success' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  LOCKED: 'danger',
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={TONE[status]}>{USER_STATUS_LABEL[status]}</Badge>;
}
