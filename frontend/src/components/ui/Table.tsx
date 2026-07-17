import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ className = '', children, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-sm ${className}`} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-border bg-paper/60 text-xs uppercase tracking-wide text-muted">{children}</thead>;
}

export function Th({ className = '', children, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-5 py-3 font-medium ${className}`} {...rest}>
      {children}
    </th>
  );
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function Tr({ className = '', children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition-colors hover:bg-paper/60 ${className}`} {...rest}>
      {children}
    </tr>
  );
}

export function Td({ className = '', children, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-5 py-3.5 text-ink ${className}`} {...rest}>
      {children}
    </td>
  );
}
