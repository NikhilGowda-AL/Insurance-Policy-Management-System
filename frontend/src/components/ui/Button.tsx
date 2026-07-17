'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-primary text-white hover:bg-primary-dark disabled:bg-primary/50',
  primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-primary/50',
  secondary: 'bg-white text-ink border border-border hover:bg-paper disabled:opacity-50',
  ghost: 'bg-transparent text-ink hover:bg-primary-light disabled:opacity-50',
  danger: 'bg-danger text-white hover:bg-danger/90 disabled:bg-danger/50'
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
