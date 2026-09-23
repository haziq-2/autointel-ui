import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function ChartCard({ title, description, children, className, action }: ChartCardProps) {
  return (
    <div className={cn("surface-card min-w-0 p-5", className)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-card-title">{title}</h3>
          {description && <p className="mt-1 text-helper">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
