import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-page-title">{title}</h1>
        {description && (
          <p className="text-body text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
  description,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex min-h-[44px] items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="text-section-title">{children}</h2>
        {description && <p className="mt-1 text-helper">{description}</p>}
      </div>
      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </div>
  );
}
