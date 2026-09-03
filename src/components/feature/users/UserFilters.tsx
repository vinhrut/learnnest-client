import { FiSearch } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { USER_STATUS_LABEL, type UserStatus } from '@/types/user';

interface UserFiltersProps {
  search: string;
  status: UserStatus | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: UserStatus | '') => void;
}

const STATUS_OPTIONS = (
  Object.keys(USER_STATUS_LABEL) as UserStatus[]
).map((s) => ({ value: s, label: USER_STATUS_LABEL[s] }));

export function UserFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="sm:w-72">
        <Input
          placeholder="Tìm theo tên, username, email..."
          leftIcon={<FiSearch />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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
    </div>
  );
}
