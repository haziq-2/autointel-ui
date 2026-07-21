import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function DataTable({ children, className, maxHeight }: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-auto rounded-xl border border-border bg-white",
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full caption-bottom text-table">{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur-sm [&_tr]:border-0">
      {children}
    </thead>
  );
}

export function DataTableHeaderCell({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground whitespace-nowrap",
        align === "right" && "text-right",
        className
      )}
    >
      {children}
    </th>
  );
}

export function DataTableRow({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors duration-150 last:border-0 hover:bg-surface",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <td
      className={cn(
        "px-4 py-2.5 align-middle text-table",
        align === "right" && "text-right",
        className
      )}
    >
      {children}
    </td>
  );
}
