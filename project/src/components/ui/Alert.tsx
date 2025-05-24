import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
  onDismiss,
}) => {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const iconMap = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <div
      className={clsx(
        'rounded-md border p-4 flex',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex-shrink-0 mr-3">{iconMap[variant]}</div>
      <div className="flex-1">
        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={clsx(
            'ml-auto flex-shrink-0 -mr-1 -mt-1 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2',
            {
              'focus:ring-blue-500': variant === 'info',
              'focus:ring-green-500': variant === 'success',
              'focus:ring-yellow-500': variant === 'warning',
              'focus:ring-red-500': variant === 'error',
            }
          )}
        >
          <span className="sr-only">Dismiss</span>
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};