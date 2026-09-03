import type { ReactNode } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type SortDir = 'asc' | 'desc';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  cellClassName?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyState?: ReactNode;
  sortKey?: string;
  sortDir?: SortDir;
  onSortChange?: (key: string) => void;
  /** Chiều cao tối thiểu (px) cho vùng nội dung — giữ bảng không co giãn khi số dòng thay đổi. */
  minBodyHeight?: number;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyState,
  sortKey,
  sortDir,
  onSortChange,
  minBodyHeight,
}: TableProps<T>) {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-xl border border-line bg-white"
      style={minBodyHeight ? { minHeight: minBodyHeight } : undefined}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
              {columns.map((c) => {
                const sortable = c.sortable && !!onSortChange;
                const active = sortable && sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    aria-sort={
                      active
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                    className={cn(
                      'px-4 py-3 font-semibold',
                      alignClass[c.align ?? 'left'],
                      c.className,
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange!(c.key)}
                        className={cn(
                          'inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-ink',
                          active && 'text-ink',
                        )}
                      >
                        {c.header}
                        {active && sortDir === 'asc' ? (
                          <FiChevronUp className="h-3.5 w-3.5" />
                        ) : active && sortDir === 'desc' ? (
                          <FiChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <FiChevronDown className="h-3.5 w-3.5 opacity-30" />
                        )}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
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
        <div className="grid flex-1 place-items-center px-4 py-12">
          {emptyState ?? (
            <p className="text-center text-sm text-muted">Không có dữ liệu</p>
          )}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
}
