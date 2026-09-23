import { cn } from "@/lib/utils";

interface MetricsGridProps {
  metrics: { label: string; value: string | number; change?: number; description?: string }[];
  className?: string;
}

export function MetricsGrid({ metrics, className }: MetricsGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {metrics.map((m) => (
        <div
          key={m.label}
          className="surface-card card-interactive p-4"
        >
          <p className="text-label">{m.label}</p>
          <p className="text-metric mt-2 text-[17px] leading-tight">{m.value}</p>
          {m.change !== undefined && (
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                m.change > 0
                  ? "bg-[var(--tint-success-bg)] text-[var(--tint-success-fg)]"
                  : m.change < 0
                    ? "bg-[var(--tint-danger-bg)] text-[var(--tint-danger-fg)]"
                    : "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)]"
              )}
            >
              {m.change > 0 ? "↑+" : m.change < 0 ? "↓" : "•"}
              {m.change}%
            </span>
          )}
          {m.description && (
            <p className="mt-1 text-helper">{m.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
