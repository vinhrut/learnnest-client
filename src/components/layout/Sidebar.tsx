import { NavLink } from 'react-router-dom';
import { FiCheckSquare, FiFolder, FiGrid, FiHelpCircle, FiList, FiUser, FiUsers } from 'react-icons/fi';
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
  { label: 'Quản lý người dùng', to: '/admin/users', icon: FiUsers, roles: ['ADMIN'] },
  { label: 'Hồ sơ', to: '/admin/profile', icon: FiUsers, roles: ['ADMIN'] },

  { label: 'Tổng quan', to: '/leader/dashboard', icon: FiGrid, roles: ['LEAD'] },
  { label: 'Dự án', to: '/leader/projects', icon: FiFolder, roles: ['LEAD'] },
  { label: 'Công việc', to: '/leader/tasks', icon: FiList, roles: ['LEAD'] },
  { label: 'Hồ sơ', to: '/leader/profile', icon: FiUser, roles: ['LEAD'] },

  { label: 'Tổng quan', to: '/ba/dashboard', icon: FiGrid, roles: ['BA'] },
  { label: 'Dự án', to: '/ba/projects', icon: FiFolder, roles: ['BA'] },
  { label: 'Công việc', to: '/ba/tasks', icon: FiList, roles: ['BA'] },
  { label: 'Hồ sơ', to: '/ba/profile', icon: FiUser, roles: ['BA'] },

  { label: 'Tổng quan', to: '/dev/dashboard', icon: FiGrid, roles: ['USER'] },
  { label: 'Dự án', to: '/dev/projects', icon: FiFolder, roles: ['USER'] },
  { label: 'Công việc', to: '/dev/tasks', icon: FiList, roles: ['USER'] },
  { label: 'Hồ sơ', to: '/dev/profile', icon: FiUser, roles: ['USER'] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_PRIORITY: RoleCode[] = ['ADMIN', 'LEAD', 'BA', 'USER'];

function getPrimaryRole(userRoles: RoleCode[] | undefined): RoleCode | null {
  if (!userRoles?.length) return null;
  return ROLE_PRIORITY.find((r) => userRoles.includes(r)) ?? null;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const primaryRole = getPrimaryRole(user?.roles);
  const items = NAV.filter((i) => !i.roles || (primaryRole && i.roles.includes(primaryRole)));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/20 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-60 flex-col',
          'bg-surface-container-lowest border-r border-outline-variant',
          'transition-transform duration-200 md:z-40 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center gap-3 px-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary">
            <FiCheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-headline-sm font-bold text-primary">TaskMaster Pro</h1>
            <p className="text-label-md text-on-surface-variant">Bộ công cụ quản lý công việc</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1">
          {items.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-label-md transition-colors duration-200 active:scale-95',
                  isActive
                    ? 'bg-surface-container text-primary font-bold border-r-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 px-3 pt-4 border-t border-outline-variant pb-6">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
          >
            <FiHelpCircle />
            Trợ giúp
          </a>
        </div>
      </aside>
    </>
  );
}
