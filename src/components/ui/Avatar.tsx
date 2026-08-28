import { useState } from 'react';
import { cn } from '@/lib/cn';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<Size, string> = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-2xl',
};

/**
 * Ảnh đại diện dùng chung: có `src` thì hiển thị ảnh, không (hoặc ảnh lỗi) thì
 * hiển thị chữ cái đầu của tên trên nền primary-soft.
 */
export function Avatar({
  src,
  name,
  size = 'md',
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: Size;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initial = (name?.trim()?.charAt(0) || '?').toUpperCase();
  const showImg = !!src && !broken;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-primary-soft font-semibold text-primary',
        SIZE[size],
        className,
      )}
    >
      {showImg ? (
        <img
          src={src!}
          alt={name ?? ''}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
