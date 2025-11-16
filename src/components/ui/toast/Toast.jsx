import { forwardRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const toastVariants = {
  default: 'bg-card border-white/10',
  success: 'bg-success/10 border-success/20',
  error: 'bg-error/10 border-error/20',
  warning: 'bg-warning/10 border-warning/20',
  info: 'bg-brand-secondary/10 border-brand-secondary/20',
};

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const Toast = forwardRef(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      onClose,
      duration = 5000,
      ...props
    },
    ref
  ) => {
    const Icon = icons[variant];

    useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto relative flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg',
          'animate-in slide-in-from-right-full',
          toastVariants[variant],
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              'h-5 w-5 flex-shrink-0',
              variant === 'success' && 'text-success',
              variant === 'error' && 'text-error',
              variant === 'warning' && 'text-warning',
              variant === 'info' && 'text-brand-secondary'
            )}
          />
        )}
        <div className="flex-1 space-y-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
