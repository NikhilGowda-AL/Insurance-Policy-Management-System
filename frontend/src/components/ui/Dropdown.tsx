'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  options: DropdownOption[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, options, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-paper cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
        <ChevronDown className="h-3.5 w-3.5 text-muted" />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-20 mt-1 w-48 rounded-md border border-border bg-white py-1 shadow-lg animate-fade-in
            ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {options.map((opt) => (
            <button
              key={opt.label}
              role="menuitem"
              onClick={() => {
                opt.onSelect();
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-paper cursor-pointer ${
                opt.danger ? 'text-danger' : 'text-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
