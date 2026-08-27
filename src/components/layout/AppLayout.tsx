import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * Layout cho khu vực đã đăng nhập: sidebar cố định (desktop) / drawer (mobile),
 * topbar cố định, và vùng nội dung giới hạn bề rộng để không vỡ trên màn lớn.
 */
export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <Topbar onOpenNav={() => setNavOpen(true)} />
      <main className="px-4 pb-12 pt-[4.5rem] md:ml-60 md:px-8 md:pt-20">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
