'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-xl animate-fade-in"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="modal-title" className="font-display text-lg text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-muted hover:bg-paper hover:text-ink cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
