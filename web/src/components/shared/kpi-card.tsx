import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";

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
        "rounded-2xl border border-border bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-label">{label}</p>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} color="#2563eb" className="h-8 w-[72px]" />
        )}
      </div>
      <p className="mt-2 font-mono text-[1.625rem] font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {change !== undefined && (
        <p className="mt-1.5 text-helper">
          <span
            className={cn(
              "font-mono text-[12px] font-medium tabular-nums",
              isPositive && "text-[#16a34a]",
              isNegative && "text-[#dc2626]",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            {isPositive ? "↑ " : isNegative ? "↓ " : ""}
            {isPositive ? "+" : ""}
            {Math.abs(change)}%
          </span>
        </p>
      )}
      {footnote && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{footnote}</p>
      )}
      {description && !change && (
        <p className="mt-1.5 text-helper">{description}</p>
      )}
    </div>
  );
}

export function KpiGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
