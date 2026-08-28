import type { ButtonHTMLAttributes } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted sm:flex-row">
      <span>
        Hiển thị <span className="font-medium text-ink">{from}</span>–
        <span className="font-medium text-ink">{to}</span> trong{' '}
        <span className="font-medium text-ink">{total}</span>
      </span>

      <div className="flex items-center gap-1">
        <PageButton
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Trang trước"
        >
          <FiChevronLeft />
        </PageButton>
        <span className="px-2">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <PageButton
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Trang sau"
        >
          <FiChevronRight />
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink',
        'hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
}
