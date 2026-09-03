import { forwardRef, type SelectHTMLAttributes } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { cn } from '@/lib/cn';
import { Field } from './Input';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  onClear?: () => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, required, options, placeholder, className, id, value, onClear, ...props },
  ref,
) {
  const hasValue = value !== '' && value !== undefined && value !== null;

  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      required={required}
      htmlFor={id}
    >
      <div className="relative">
        <select
          ref={ref}
          id={id}
          value={value}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border bg-white pl-3 text-sm text-ink outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            error ? 'border-danger' : 'border-line',
            hasValue && onClear ? 'pr-9' : 'pr-9',
            className,
          )}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="pointer-events-auto rounded-full p-0.5 text-muted hover:bg-surface-container-high hover:text-on-surface transition-colors"
              tabIndex={-1}
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          )}
          <FiChevronDown className="text-muted" />
        </div>
      </div>
    </Field>
  );
});
