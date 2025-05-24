import React from 'react';
import { clsx } from 'clsx';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <div className={clsx('flex items-center', className)}>
      <div className="relative inline-block h-6 w-11 flex-shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={clsx(
            'absolute inset-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
            checked ? 'bg-blue-600' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <span
          className={clsx(
            'absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
            checked && 'translate-x-5'
          )}
        />
      </div>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            'ml-3 text-sm font-medium text-gray-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};