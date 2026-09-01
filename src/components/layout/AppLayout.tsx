import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * Main authenticated layout with sidebar navigation and topbar
 */
export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <Topbar onOpenNav={() => setNavOpen(true)} />
      <main className="pt-[calc(56px+24px)] px-6 pb-6 md:ml-60 transition-all duration-300">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
