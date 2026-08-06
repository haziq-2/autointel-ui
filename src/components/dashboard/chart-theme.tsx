"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHART_AXIS_TICK = {
  fontSize: 11,
  fill: "var(--chart-axis)",
} as const;

export const CHART_GRID = {
  stroke: "var(--chart-grid)",
  strokeDasharray: "3 3",
} as const;

export const CHART_CURSOR = {
  fill: "var(--chart-cursor)",
} as const;

/** Ranked series: top N get primary, rest muted */
export function rankFill(index: number, topN = 3): string {
  if (index === 0) return "var(--primary)";
  if (index < topN) return "color-mix(in oklab, var(--primary) 72%, transparent)";
  return "color-mix(in oklab, var(--muted-foreground) 28%, transparent)";
}

export function ChartTooltipShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-popover px-3 py-2 shadow-popover",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ChartEmpty({
  message = "No data yet",
  actionHref = "/scrapers",
  actionLabel = "Run scrapers",
}: {
  message?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface text-muted-foreground">
        <BarChart3 className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <p className="text-helper">{message}</p>
      <Link
        href={actionHref}
        className="text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
      >
        {actionLabel} →
      </Link>
    </div>
  );
}

export function ChartHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-center text-[11px] text-muted-foreground/80">{children}</p>
  );
}

/** Recharts bar click payload helper */
export function barPayload<T extends object>(bar: unknown): T | undefined {
  if (!bar || typeof bar !== "object") return undefined;
  const withPayload = bar as { payload?: T };
  if (withPayload.payload && typeof withPayload.payload === "object") {
    return withPayload.payload;
  }
  return bar as T;
}

export function RangeToggle({
  value,
  options,
  onChange,
}: {
  value: number;
  options: { label: string; value: number }[];
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
            value === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
