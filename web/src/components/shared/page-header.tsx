interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1.5">
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
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-section-title">{children}</h2>
        {description && <p className="mt-1 text-helper">{description}</p>}
      </div>
      {action}
    </div>
  );
}
