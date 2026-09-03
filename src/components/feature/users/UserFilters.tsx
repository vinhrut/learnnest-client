import { FiRefreshCw, FiSearch, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import {
  ROLE_CODES,
  ROLE_LABEL,
  USER_STATUS_LABEL,
  type RoleCode,
  type UserStatus,
} from '@/types/user';

interface UserFiltersProps {
  search: string;
  status: UserStatus | '';
  role: RoleCode | '';
  searching?: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: UserStatus | '') => void;
  onRoleChange: (value: RoleCode | '') => void;
  onReset: () => void;
}

const STATUS_OPTIONS = (
  Object.keys(USER_STATUS_LABEL) as UserStatus[]
).map((s) => ({ value: s, label: USER_STATUS_LABEL[s] }));

const ROLE_OPTIONS = ROLE_CODES.map((r) => ({ value: r, label: ROLE_LABEL[r] }));

export function UserFilters({
  search,
  status,
  role,
  searching = false,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="sm:w-72">
        <Input
          placeholder="Tìm theo tên, username, email..."
          leftIcon={<FiSearch />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          rightSlot={
            searching ? (
              <Spinner className="h-4 w-4 text-muted" />
            ) : search ? (
              <button
                type="button"
                aria-label="Xoá tìm kiếm"
                onClick={() => onSearchChange('')}
                className="pointer-events-auto text-muted hover:text-ink"
              >
                <FiX />
              </button>
            ) : undefined
          }
        />
      </div>
      <div className="sm:w-48">
        <Select
          placeholder="Tất cả vai trò"
          options={ROLE_OPTIONS}
          value={role}
          onChange={(e) => onRoleChange(e.target.value as RoleCode | '')}
        />
      </div>
      <div className="sm:w-48">
        <Select
          placeholder="Tất cả trạng thái"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as UserStatus | '')}
        />
      </div>
      <Button
        variant="secondary"
        leftIcon={<FiRefreshCw />}
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="sm:ml-auto"
      >
        Làm mới
      </Button>
    </div>
  );
}
