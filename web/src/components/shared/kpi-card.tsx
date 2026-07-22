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
        "card-interactive rounded-xl border border-border bg-card p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-label">{label}</p>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} color="var(--primary)" className="h-8 w-[72px]" />
        )}
      </div>
      <p className="mt-3 font-mono text-[1.625rem] font-semibold leading-none tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums",
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
          <span className="text-[11px] text-muted-foreground">{footnote}</span>
        )}
      </div>
      {description && change === undefined && (
        <p className="mt-2 text-helper">{description}</p>
      )}
    </div>
  );
}

export function KpiGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <StaggerGrid className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </StaggerGrid>
  );
}
