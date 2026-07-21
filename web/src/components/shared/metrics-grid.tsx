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
          className="rounded-xl border border-border bg-white p-4 transition-colors hover:border-[#dcdcdc]"
        >
          <p className="text-label">{m.label}</p>
          <p className="mt-1.5 font-mono text-[15px] font-semibold tabular-nums text-foreground">
            {m.value}
          </p>
          {m.change !== undefined && (
            <p
              className={cn(
                "mt-1 font-mono text-[12px] tabular-nums",
                m.change > 0 ? "text-[#16a34a]" : m.change < 0 ? "text-[#dc2626]" : "text-muted-foreground"
              )}
            >
              {m.change > 0 ? "+" : ""}
              {m.change}%
            </p>
          )}
          {m.description && (
            <p className="mt-1 text-helper">{m.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
