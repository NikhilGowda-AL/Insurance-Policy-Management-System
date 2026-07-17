import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'primary' | 'accent' | 'danger';
}

const toneClasses = {
  primary: 'bg-primary-light text-primary-dark',
  accent: 'bg-accent-light text-accent',
  danger: 'bg-danger-light text-danger'
};

export function StatCard({ label, value, icon: Icon, tone = 'primary' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <div className={`rounded-md p-2 ${toneClasses[tone]}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl text-ink">{value}</p>
    </div>
  );
}
