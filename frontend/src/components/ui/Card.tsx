import { HTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-border px-5 py-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}
