import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  position = 'right',
  size = 'md',
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={cn(
          'relative h-full w-full bg-surface-container-lowest shadow-[-12px_0_24px_rgba(9,30,66,0.15)] flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          position === 'right' ? 'translate-x-0' : '-translate-x-full',
          SIZE[size],
        )}
        style={{ maxWidth: size === 'xl' ? '48rem' : size === 'lg' ? '42rem' : undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-8 py-4">
          {title ? (
            <h2 className="text-headline-sm text-on-surface font-semibold">{title}</h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto drawer-scroll p-8 pb-32">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="absolute bottom-0 w-full border-t border-outline-variant bg-surface-container-lowest p-6 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
