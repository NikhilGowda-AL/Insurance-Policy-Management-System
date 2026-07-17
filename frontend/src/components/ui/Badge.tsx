type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-primary-light text-primary-dark',
  warning: 'bg-accent-light text-accent',
  danger: 'bg-danger-light text-danger',
  neutral: 'bg-paper text-muted border border-border',
  primary: 'bg-primary text-white'
};

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
