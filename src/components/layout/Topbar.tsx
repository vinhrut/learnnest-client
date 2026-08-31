import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationBell } from '@/features/notifications/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { useLogoutMutation } from '@/hooks/queries/auth.queries';
import { useMyProfileQuery } from '@/hooks/queries/profile.queries';
import { ROLE_LABEL } from '@/types/user';

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogoutMutation();
  const profile = useMyProfileQuery();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = user?.full_name || user?.username || '';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-white px-4 md:left-60">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenNav}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink md:hidden"
          aria-label="Mở menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <span className="flex items-center gap-2 font-bold text-primary md:hidden">
          <FiCheckSquare className="h-4 w-4" />
          LearnNest
        </span>
      </div>

      <div className="flex items-center gap-1">
      <NotificationBell />
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <Avatar src={profile.data?.avatar_url} name={name} size="sm" />
          <span className="hidden text-left sm:block">
            <span className="block max-w-[12rem] truncate text-sm font-medium leading-tight text-ink">
              {name}
            </span>
            <span className="block text-xs leading-tight text-muted">
              {user?.roles.map((r) => ROLE_LABEL[r]).join(', ')}
            </span>
          </span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg"
          >
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar src={profile.data?.avatar_url} name={name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
            </div>
            <div className="my-1 border-t border-line" />
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-canvas"
              role="menuitem"
            >
              <FiUser className="h-4 w-4" />
              Hồ sơ cá nhân
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-canvas"
              role="menuitem"
            >
              <FiLogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
      </div>
    </header>
  );
}
