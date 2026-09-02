import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  cellClassName?: string;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyState?: ReactNode;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyState,
}: TableProps<T>) {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    'px-4 py-3 font-semibold',
                    alignClass[c.align ?? 'left'],
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-canvas/50">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      'px-4 py-3 text-ink',
                      alignClass[c.align ?? 'left'],
                      c.className,
                      c.cellClassName,
                    )}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && rows.length === 0 && (
        <div className="px-4 py-12">{emptyState ?? <p className="text-center text-sm text-muted">Không có dữ liệu</p>}</div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
}
