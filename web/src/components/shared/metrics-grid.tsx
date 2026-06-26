import { cn } from "@/lib/utils";

interface MetricsGridProps {
  metrics: { label: string; value: string | number; change?: number }[];
  className?: string;
}

export function MetricsGrid({ metrics, className }: MetricsGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {metrics.map((m) => (
        <div key={m.label} className="rounded-md border border-border p-3">
          <p className="text-label">{m.label}</p>
          <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-foreground">
            {m.value}
          </p>
          {m.change !== undefined && (
            <p
              className={cn(
                "mt-1 font-mono text-label tabular-nums",
                m.change > 0 ? "text-[#16a34a]" : m.change < 0 ? "text-[#dc2626]" : "text-muted-foreground"
              )}
            >
              {m.change > 0 ? "+" : ""}
              {m.change}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
