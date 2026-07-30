"use client";

import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/format";
import type { AlertsDashboardStats } from "@/lib/types";

export function AlertsKpiRow({ stats }: { stats: AlertsDashboardStats }) {
  return (
    <KpiGrid className="mb-6">
      <KpiCard
        label="Alerts today"
        value={stats.todayTotal}
        changeLabel="total"
      />
      <KpiCard
        label="Price drops"
        value={stats.priceDropsKpi}
        description={`${formatCurrency(stats.potentialSavings)} potential savings`}
      />
      <KpiCard
        label="New listings"
        value={stats.newListings}
        description="matching your filters"
      />
      <KpiCard
        label="High priority"
        value={stats.highPriority}
        description="need review"
      />
    </KpiGrid>
  );
}
