'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = meta;
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm text-muted">
      <p>
        Showing <span className="font-medium text-ink">{start}</span>–
        <span className="font-medium text-ink">{end}</span> of{' '}
        <span className="font-medium text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-md border border-border p-1.5 hover:bg-paper cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-1 font-mono-tab text-ink">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded-md border border-border p-1.5 hover:bg-paper cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
