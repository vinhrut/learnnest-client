import { NavLink } from 'react-router-dom';
import {
  FiCheckSquare,
  FiGrid,
  FiInbox,
  FiSend,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';
import type { RoleCode } from '@/types/user';

interface NavItem {
  label: string;
  to: string;
  icon: IconType;
  roles?: RoleCode[];
}

const NAV: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
  { label: 'Quản lý user', to: '/users', icon: FiUsers, roles: ['ADMIN'] },
  { label: 'Giao việc', to: '/tasks/assign', icon: FiSend, roles: ['ADMIN'] },
  { label: 'Việc của tôi', to: '/my-tasks', icon: FiInbox },
  { label: 'Hồ sơ', to: '/profile', icon: FiUser },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { hasRole } = useAuth();
  const items = NAV.filter((i) => !i.roles || hasRole(...i.roles));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r border-line bg-white px-3 py-5',
          'transition-transform duration-200 md:z-40 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <FiCheckSquare className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-primary">LearnNest</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink md:hidden"
            aria-label="Đóng menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-muted hover:bg-canvas hover:text-ink',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
