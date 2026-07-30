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
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-card",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-card-title">{title}</h3>
          {description && (
            <p className="mt-0.5 text-helper">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
