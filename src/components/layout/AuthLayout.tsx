import type { ReactNode } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <FiCheckSquare className="h-7 w-7" />
          <span className="text-xl font-bold">LearnNest</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold leading-snug">
            Hệ thống quản lý công việc cho nhóm hiệu suất cao.
          </h1>
          <p className="mt-4 text-white/80">
            Theo dõi tiến độ, quản lý phân quyền và giao việc một cách có cấu
            trúc.
          </p>
        </div>

        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} LearnNest
        </p>
      </aside>

      <main className="flex w-full items-center justify-center bg-white p-6 lg:w-1/2">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
