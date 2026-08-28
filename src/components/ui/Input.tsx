import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FieldProps {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const inputBaseClass =
  'w-full rounded-lg border bg-white px-3 text-sm text-ink outline-none transition-colors ' +
  'placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ' +
  'disabled:bg-canvas disabled:text-muted';

export function Field({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
}: FieldProps & { htmlFor?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, leftIcon, rightSlot, className, id, ...props },
  ref,
) {
  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      required={required}
      htmlFor={id}
    >
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            inputBaseClass,
            'h-10',
            leftIcon && 'pl-10',
            rightSlot && 'pr-10',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            !error && 'border-line',
            className,
          )}
          {...props}
        />
        {rightSlot && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
    </Field>
  );
});
