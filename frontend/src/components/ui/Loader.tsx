import { Loader2 } from 'lucide-react';

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm">{label}...</p>
    </div>
  );
}

export function InlineLoader() {
  return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="h-9 w-9 animate-pulse rounded-full bg-border" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-border" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
