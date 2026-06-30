"use client";

import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/format";
import type { AlertsDashboardStats } from "@/lib/types";

export function AlertsKpiRow({ stats }: { stats: AlertsDashboardStats }) {
  return (
    <KpiGrid className="mb-6">
      <KpiCard
        label="High Value Opportunities"
        value={stats.highValueCount}
        change={6}
        changeLabel="today"
      />
      <KpiCard
        label="Price Drops"
        value={stats.priceDropsKpi}
        description={`${formatCurrency(stats.potentialSavings)} potential savings`}
      />
      <KpiCard
        label="Negotiation Opportunities"
        value={stats.negotiationCount}
        description={`Average acceptance ${stats.avgAcceptance}%`}
      />
      <KpiCard
        label="Market Alerts"
        value={stats.marketAlerts}
        description={`${stats.newTrends} new trends`}
      />
    </KpiGrid>
  );
}
