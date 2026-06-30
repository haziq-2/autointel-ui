"use client";

import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/format";

interface KpiItem {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  description?: string;
  sparkline?: number[];
}

export function ExecutiveKpiGrid({ items, className }: { items: KpiItem[]; className?: string }) {
  return (
    <KpiGrid className={className}>
      {items.map((item) => (
        <KpiCard
          key={item.label}
          label={item.label}
          value={
            typeof item.value === "number" && item.label.toLowerCase().includes("price")
              ? formatCurrency(item.value)
              : typeof item.value === "number" && item.label.toLowerCase().includes("roi")
                ? `${item.value}%`
                : typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value
          }
          change={item.change}
          changeLabel={item.changeLabel ?? "vs last period"}
          description={item.description}
          sparkline={item.sparkline}
          className="rounded-2xl"
        />
      ))}
    </KpiGrid>
  );
}
