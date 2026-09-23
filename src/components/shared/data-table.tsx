import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  /** `auto` lets one column absorb leftover space while the others hug their content. */
  layout?: "fixed" | "auto";
}

export function DataTable({ children, className, maxHeight, layout = "fixed" }: DataTableProps) {
  return (
    <div
      className={cn(
        "surface-card w-full min-w-0 max-w-full overflow-x-hidden",
        className
      )}
      style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
    >
      <table
        className={cn(
          "w-full caption-bottom text-table",
          layout === "fixed" ? "table-fixed" : "table-auto"
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-card/90 backdrop-blur-md [&_tr]:border-0">
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
        "h-11 border-b border-border px-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground sm:px-4",
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
        "border-b border-border/70 transition-colors duration-150 last:border-0 hover:bg-surface",
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
        "overflow-hidden px-3 py-3 align-middle text-table sm:px-4",
        align === "right" && "text-right",
        className
      )}
    >
      {children}
    </td>
  );
}
