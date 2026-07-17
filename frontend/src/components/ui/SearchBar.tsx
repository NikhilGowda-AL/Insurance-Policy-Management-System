'use client';

import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...', className = '', ...rest }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink
          placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        {...rest}
      />
    </div>
  );
}
