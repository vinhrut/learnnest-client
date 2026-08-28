import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Input } from './Input';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightSlot={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded text-muted hover:text-ink"
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            tabIndex={-1}
          >
            {visible ? <FiEyeOff /> : <FiEye />}
          </button>
        }
        {...props}
      />
    );
  },
);
