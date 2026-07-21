"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  INTELLIGENCE_ALERTS,
  ALERTS_AI_SUMMARY,
  ALERTS_DASHBOARD_STATS,
} from "@/lib/mock-data/alerts";
import type { AlertCategory, IntelligenceAlert } from "@/lib/types";
import { AlertsKpiRow } from "./alerts-kpi-row";
import { AiSummaryBanner } from "./ai-summary-banner";
import { AlertCategoriesSidebar } from "./alert-categories-sidebar";
import { AlertsToolbar, DEFAULT_FILTERS, type AlertFilters } from "./alerts-toolbar";
import { AlertCard } from "./alert-card";
import { AlertsInsightsSidebar } from "./alerts-insights-sidebar";
import { AlertDetailDrawer } from "./alert-detail-drawer";
import { AlertsEmptyState } from "./alerts-empty-state";

function filterAlerts(
  alerts: IntelligenceAlert[],
  category: AlertCategory,
  filters: AlertFilters
): IntelligenceAlert[] {
  return alerts.filter((a) => {
    if (category !== "all" && a.category !== category) return false;
    if (filters.unreadOnly && a.read) return false;
    if (filters.savedOnly && !a.saved) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [a.title, a.aiSummary, a.location, a.marketplace]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.marketplace !== "all" && a.marketplace !== filters.marketplace) return false;
    if (filters.city !== "all" && !a.location?.includes(filters.city)) return false;
    if (filters.make !== "all" && !a.title.includes(filters.make)) return false;
    if (filters.minScore !== "all" && (a.opportunityScore ?? 0) < Number(filters.minScore)) return false;
    if (filters.priority !== "all" && a.priority !== filters.priority) return false;
    if (filters.alertType !== "all" && a.type !== filters.alertType) return false;
    if (filters.dateRange === "today" && a.minutesAgo > 24 * 60) return false;
    if (filters.dateRange === "24h" && a.minutesAgo > 24 * 60) return false;
    if (filters.dateRange === "7d" && a.minutesAgo > 7 * 24 * 60) return false;
    if (filters.dateRange === "30d" && a.minutesAgo > 30 * 24 * 60) return false;
    return true;
  });
}

function countByCategory(alerts: IntelligenceAlert[]): Record<AlertCategory, number> {
  const counts: Record<string, number> = {
    all: alerts.filter((a) => !a.read).length,
    high_value: 0,
    price_drop: 0,
    new_listing: 0,
    negotiation: 0,
    market_intel: 0,
    risk: 0,
    watchlist: 0,
    system: 0,
  };
  for (const a of alerts) {
    if (!a.read) counts[a.category]++;
  }
  return counts as Record<AlertCategory, number>;
}

export function AlertsCommandCenter() {
  const [alerts, setAlerts] = useState(INTELLIGENCE_ALERTS);
  const [category, setCategory] = useState<AlertCategory>("all");
  const [filters, setFilters] = useState<AlertFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<IntelligenceAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () => filterAlerts(alerts, category, filters),
    [alerts, category, filters]
  );

  const unread = alerts.filter((a) => !a.read).length;
  const categoryCounts = useMemo(() => countByCategory(alerts), [alerts]);

  const handleOpen = (alert: IntelligenceAlert) => {
    setSelected(alert);
    setDrawerOpen(true);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a))
    );
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, saved: !a.saved } : a))
    );
  };

  const simulateRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Alerts"
        description={`${unread} unread · AI-powered acquisition command center`}
      >
        <Link
          href="/alerts/rules"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-surface"
        >
          <Settings className="h-3.5 w-3.5" />
          Alert rules
        </Link>
      </PageHeader>

      <AlertsKpiRow stats={ALERTS_DASHBOARD_STATS} />

      <div className="mb-6">
        <AiSummaryBanner summary={ALERTS_AI_SUMMARY} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[220px_1fr_280px]">
        <aside className="hidden xl:block">
          <div className="sticky top-6 rounded-xl border border-border bg-white p-3">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <AlertCategoriesSidebar
              active={category}
              counts={categoryCounts}
              onSelect={(c) => {
                setCategory(c);
                simulateRefresh();
              }}
            />
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-4 xl:hidden">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AlertCategory)}
              className="h-9 w-full rounded-lg border border-border bg-white px-3 text-[13px]"
            >
              <option value="all">All Alerts</option>
              <option value="high_value">High Value</option>
              <option value="price_drop">Price Drops</option>
              <option value="new_listing">New Listings</option>
              <option value="negotiation">Negotiation</option>
              <option value="market_intel">Market Intel</option>
              <option value="risk">Risk</option>
              <option value="watchlist">Watchlist</option>
              <option value="system">System</option>
            </select>
          </div>

          <AlertsToolbar
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl border border-border bg-surface"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <AlertsEmptyState onReset={() => setFilters(DEFAULT_FILTERS)} />
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((alert, i) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    index={i}
                    onOpen={handleOpen}
                    onDismiss={handleDismiss}
                    onSave={handleSave}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <AlertsInsightsSidebar stats={ALERTS_DASHBOARD_STATS} />
          </div>
        </aside>
      </div>

      <AlertDetailDrawer
        alert={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
