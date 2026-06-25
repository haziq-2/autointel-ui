import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function KpiCard({ label, value, change, changeLabel, className }: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={cn("border-b border-border pb-6", className)}>
      <p className="text-label">{label}</p>
      <p className="mt-2 font-mono text-[1.75rem] font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {change !== undefined && (
        <p className="mt-2 text-label">
          <span
            className={cn(
              "font-mono tabular-nums",
              isPositive && "text-[#16a34a]",
              isNegative && "text-[#dc2626]",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            {isPositive ? "+" : ""}{change}%
          </span>
          {changeLabel && <span className="text-muted-foreground"> {changeLabel}</span>}
        </p>
      )}
    </div>
  );
}
