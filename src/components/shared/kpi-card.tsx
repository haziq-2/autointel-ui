import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";
import { StaggerGrid } from "./motion";

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  description?: string;
  sparkline?: number[];
  className?: string;
}

export function KpiCard({
  label,
  value,
  change,
  changeLabel,
  subtitle,
  description,
  sparkline,
  className,
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const footnote = subtitle ?? changeLabel;

  return (
    <div
      className={cn(
        "surface-card card-interactive flex h-full min-h-[132px] min-w-0 flex-col overflow-hidden p-5",
        className
      )}
    >
      <div className="flex min-h-8 items-start justify-between gap-3">
        <p className="text-label leading-5">{label}</p>
        {sparkline && sparkline.length > 1 ? (
          <Sparkline data={sparkline} color="var(--primary)" className="h-8 w-[72px] shrink-0" />
        ) : (
          <span className="h-8 w-[72px] shrink-0" aria-hidden />
        )}
      </div>
      <p className="text-metric mt-3 truncate text-[1.75rem] leading-none">{value}</p>
      <div className="mt-auto flex min-h-5 flex-wrap items-center gap-2 pt-3">
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
              isPositive && "bg-[var(--tint-success-bg)] text-[var(--tint-success-fg)]",
              isNegative && "bg-[var(--tint-danger-bg)] text-[var(--tint-danger-fg)]",
              !isPositive && !isNegative && "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)]"
            )}
          >
            {isPositive ? "↑" : isNegative ? "↓" : "•"}
            {isPositive ? "+" : ""}
            {Math.abs(change)}%
          </span>
        )}
        {footnote && (
          <span className="truncate text-[11.5px] leading-5 text-muted-foreground">{footnote}</span>
        )}
        {description && change === undefined && !footnote && (
          <span className="truncate text-helper">{description}</span>
        )}
      </div>
    </div>
  );
}

export function KpiGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <StaggerGrid
      className={cn(
        "grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </StaggerGrid>
  );
}
