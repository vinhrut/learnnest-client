import { NavLink } from 'react-router-dom';
import { FiGrid, FiFolder, FiList, FiUsers, FiUser, FiSettings, FiCheckSquare } from 'react-icons/fi';
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
  // LEAD routes
  { label: 'Dashboard', to: '/leader/dashboard', icon: FiGrid, roles: ['LEAD'] },
  { label: 'Dự án', to: '/leader/projects', icon: FiFolder, roles: ['LEAD'] },
  { label: 'Công việc', to: '/leader/tasks', icon: FiList, roles: ['LEAD'] },
  { label: 'Quản lý user', to: '/leader/users', icon: FiUsers, roles: ['LEAD'] },
  { label: 'Hồ sơ', to: '/leader/profile', icon: FiUser, roles: ['LEAD'] },

  // BA routes
  { label: 'Dashboard', to: '/ba/dashboard', icon: FiGrid, roles: ['BA'] },
  { label: 'Dự án', to: '/ba/projects', icon: FiFolder, roles: ['BA'] },
  { label: 'Hồ sơ', to: '/ba/profile', icon: FiUser, roles: ['BA'] },

  // DEV routes
  { label: 'Dashboard', to: '/dev/dashboard', icon: FiGrid, roles: ['USER'] },
  { label: 'Dự án', to: '/dev/projects', icon: FiFolder, roles: ['USER'] },
  { label: 'Hồ sơ', to: '/dev/profile', icon: FiUser, roles: ['USER'] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { hasRole } = useAuth();
  const items = NAV.filter((i) => !i.roles || hasRole(...i.roles));

  return (
    <>
      {/* Backdrop for mobile */}
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
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 px-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary">
            <FiCheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-headline-sm font-bold text-primary">TaskMaster Pro</h1>
            <p className="text-label-md text-on-surface-variant">Management Suite</p>
          </div>
        </div>

        {/* Create Task Button */}
        <div className="px-3 mb-6">
          <button className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3 px-4 rounded-lg text-label-md font-semibold hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">add</span>
            Tạo công việc
          </button>
        </div>

        {/* Navigation */}
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

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-1 px-3 pt-4 border-t border-outline-variant pb-6">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-label-md transition-colors duration-200',
                isActive
                  ? 'bg-surface-container text-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              )
            }
          >
            <FiSettings className="h-4 w-4" />
            Cài đặt
          </NavLink>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
          >
            <span className="material-symbols-outlined">help</span>
            Trợ giúp
          </a>
        </div>
      </aside>
    </>
  );
}
