import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useLogoutMutation } from '@/hooks/auth/auth.queries';
import { useMyProfileQuery } from '@/hooks/profile/profile.queries';
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
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-lowest px-4 md:left-60">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenNav}
          className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-transform duration-150 active:scale-90 md:hidden"
          aria-label="Mở menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input
            className="w-full h-8 pl-10 pr-4 rounded-full bg-surface border border-outline-variant text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Tìm kiếm công việc..."
            type="text"
          />
        </div>

        <h1 className="md:hidden text-headline-sm font-bold text-primary">TaskMaster</h1>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-transform duration-150 active:scale-90 relative">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface-container-lowest"></span>
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-surface-container-high transition-transform duration-150 active:scale-90"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <Avatar src={profile.data?.avatar_url} name={name} size="sm" />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest py-1 shadow-lg"
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-outline-variant">
                <Avatar src={profile.data?.avatar_url} name={name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-semibold text-on-surface">{name}</p>
                  <p className="truncate text-label-md text-on-surface-variant">{user?.email}</p>
                  <p className="truncate text-label-md text-primary mt-0.5">
                    {user?.roles.map((r) => ROLE_LABEL[r]).join(', ')}
                  </p>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-body-md text-on-surface hover:bg-surface-container transition-colors"
                role="menuitem"
              >
                <span className="material-symbols-outlined text-xl">account_circle</span>
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-body-md text-error hover:bg-surface-container transition-colors"
                role="menuitem"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
