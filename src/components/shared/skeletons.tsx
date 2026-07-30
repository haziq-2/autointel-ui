import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="flex gap-3 border-b border-border bg-surface px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3 border-b border-border px-4 py-3.5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn("h-3 flex-1", c === 0 && "max-w-[40%]")} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-24" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-6 h-[220px] w-full rounded-md" />
    </div>
  );
}
