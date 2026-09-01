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
  'w-full rounded-lg border bg-surface-container-lowest px-3 text-body-md text-on-surface outline-none transition-all ' +
  'placeholder:text-on-surface-variant/60 focus:border-primary-container focus:ring-1 focus:ring-primary-container ' +
  'disabled:bg-surface-container-low disabled:text-on-surface-variant';

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
        <label htmlFor={htmlFor} className="text-label-md text-on-surface font-semibold">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-label-md text-error">{error}</p>
      ) : hint ? (
        <p className="text-label-md text-on-surface-variant">{hint}</p>
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
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
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
            error && 'border-error focus:border-error focus:ring-error/20',
            !error && 'border-outline-variant',
            className,
          )}
          {...props}
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
    </Field>
  );
});
