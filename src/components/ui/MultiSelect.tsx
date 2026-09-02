import { cn } from '@/lib/cn';
import { Field } from './Input';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectProps<T extends string> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Option<T>[];
  value: T[];
  onChange: (next: T[]) => void;
}

export function MultiSelect<T extends string>({
  label,
  error,
  hint,
  required,
  options,
  value,
  onChange,
}: MultiSelectProps<T>) {
  const toggle = (v: T) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <Field label={label} error={error} hint={hint} required={required}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-line bg-white text-muted hover:border-primary/40',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
