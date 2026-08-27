import { Badge } from '@/components/ui/Badge';
import { ROLE_LABEL, type RoleCode } from '@/types/user';

const TONE: Record<RoleCode, 'primary' | 'warning' | 'neutral'> = {
  ADMIN: 'primary',
  BA: 'warning',
  USER: 'neutral',
};

export function RoleTags({ roles }: { roles: RoleCode[] }) {
  if (roles.length === 0) {
    return <span className="text-xs text-muted">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <Badge key={r} tone={TONE[r]}>
          {ROLE_LABEL[r]}
        </Badge>
      ))}
    </div>
  );
}
