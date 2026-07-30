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
          className="card-interactive rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <p className="text-label">{m.label}</p>
          <p className="mt-1.5 font-mono text-[15px] font-semibold tabular-nums text-foreground">
            {m.value}
          </p>
          {m.change !== undefined && (
            <span
              className={cn(
                "mt-1.5 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums",
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
