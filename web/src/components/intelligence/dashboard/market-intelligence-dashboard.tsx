"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/format";
import { MARKET_AI_INSIGHTS } from "@/lib/mock-data/intelligence-dashboard";
import {
  buildAvgPriceChart,
  buildListingActivityChart,
  buildMarketSummary,
  computeMarketKpis,
  filterMarketInsights,
  filterMarketVehicles,
  getFilteredMarketplaceStats,
  getFilteredUndervalued,
  toMarketIntelFilters,
} from "@/lib/mock-data/market-intelligence";
import { AiMarketSummary } from "./ai-market-summary";
import {
  ChartPanel,
  DEFAULT_INTELLIGENCE_FILTERS,
  IntelligenceFilterBar,
  PeriodToggle,
  type IntelligenceFilters,
} from "./intelligence-filter-bar";
import { IntelligenceInsightsFeed } from "./intelligence-insights-feed";

function useCountUp(target: number, duration = 900, enabled = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 rounded-2xl bg-[#f4f4f5]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[132px] rounded-2xl bg-[#f4f4f5]" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-[#f4f4f5]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-[#f4f4f5]" />
        <div className="h-80 rounded-2xl bg-[#f4f4f5]" />
      </div>
    </div>
  );
}

const CHART_TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #e4e4e7",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

export function MarketIntelligenceDashboard() {
  const [filters, setFilters] = useState<IntelligenceFilters>(DEFAULT_INTELLIGENCE_FILTERS);
  const [activityPeriod, setActivityPeriod] = useState("30d");
  const [pricePeriod, setPricePeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  const marketFilters = useMemo(() => toMarketIntelFilters(filters), [filters]);

  const filteredVehicles = useMemo(
    () => filterMarketVehicles(marketFilters),
    [marketFilters]
  );

  const chartVehicles = useMemo(
    () => filterMarketVehicles(marketFilters, { includeDateRange: false }),
    [marketFilters]
  );

  const kpis = useMemo(() => computeMarketKpis(filteredVehicles), [filteredVehicles]);
  const summary = useMemo(() => buildMarketSummary(filteredVehicles, kpis), [filteredVehicles, kpis]);
  const undervalued = useMemo(() => getFilteredUndervalued(filteredVehicles, 5), [filteredVehicles]);
  const marketplaces = useMemo(() => {
    const stats = getFilteredMarketplaceStats(filteredVehicles);
    return marketFilters.marketplace === "All"
      ? stats
      : stats.filter((m) => m.name === marketFilters.marketplace);
  }, [filteredVehicles, marketFilters.marketplace]);

  const insights = useMemo(
    () => filterMarketInsights(MARKET_AI_INSIGHTS, marketFilters),
    [marketFilters]
  );

  const activityData = useMemo(
    () => buildListingActivityChart(chartVehicles, activityPeriod),
    [chartVehicles, activityPeriod]
  );
  const priceData = useMemo(
    () => buildAvgPriceChart(chartVehicles, pricePeriod),
    [chartVehicles, pricePeriod]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    setFiltering(true);
    const timer = setTimeout(() => setFiltering(false), 220);
    return () => clearTimeout(timer);
  }, [marketFilters, loading]);

  const activeListings = useCountUp(kpis.activeListings.value, 600, !loading && !filtering);
  const newToday = useCountUp(kpis.newListingsToday.value, 600, !loading && !filtering);
  const avgPrice = useCountUp(kpis.avgMarketPrice.value, 600, !loading && !filtering);
  const avgScore = useCountUp(kpis.avgOpportunityScore.value, 600, !loading && !filtering);
  const highValue = useCountUp(kpis.highValueOpportunities.value, 600, !loading && !filtering);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6">
        <header>
          <h1 className="text-[22px] font-semibold tracking-tight">Market Intelligence</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            What is happening in the market today, and where are the biggest buying opportunities?
          </p>
        </header>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-[22px] font-semibold tracking-tight">Market Intelligence</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          What is happening in the market today, and where are the biggest buying opportunities?
        </p>
      </header>

      <div className="space-y-2">
        <IntelligenceFilterBar filters={filters} onChange={setFilters} compact showSearch={false} />
        <p className="px-1 text-[12px] text-muted-foreground">
          <span className="font-mono font-medium tabular-nums text-foreground">
            {filteredVehicles.length.toLocaleString()}
          </span>{" "}
          listings match your filters
        </p>
      </div>

      <motion.div
        key={JSON.stringify(marketFilters)}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: filtering ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-8"
      >
        {/* 1. Market Overview */}
        <section>
          <KpiGrid className="sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="Active Listings"
              value={activeListings.toLocaleString()}
              change={kpis.activeListings.change}
              subtitle="Compared to last week"
              sparkline={kpis.activeListings.sparkline}
            />
            <KpiCard
              label="New Listings Today"
              value={newToday.toLocaleString()}
              change={kpis.newListingsToday.change}
              subtitle="Compared to last week"
              sparkline={kpis.newListingsToday.sparkline}
            />
            <KpiCard
              label="Average Market Price"
              value={formatCurrency(avgPrice)}
              change={kpis.avgMarketPrice.change}
              subtitle="Compared to last week"
              sparkline={kpis.avgMarketPrice.sparkline}
            />
            <KpiCard
              label="Average Opportunity Score"
              value={avgScore}
              change={kpis.avgOpportunityScore.change}
              subtitle="Compared to last week"
              sparkline={kpis.avgOpportunityScore.sparkline}
            />
            <KpiCard
              label="High-Value Opportunities"
              value={highValue.toLocaleString()}
              change={kpis.highValueOpportunities.change}
              subtitle="Compared to last week"
              sparkline={kpis.highValueOpportunities.sparkline}
            />
            <KpiCard
              label="Average Days to Sell"
              value={kpis.avgDaysToSell.value}
              change={kpis.avgDaysToSell.change}
              subtitle="Compared to last week"
              sparkline={kpis.avgDaysToSell.sparkline}
            />
          </KpiGrid>
        </section>

        {/* 2. AI Market Summary */}
        <section>
          <AiMarketSummary
            title="Today's Market Summary"
            bullets={summary.bullets}
            confidence={summary.confidence}
            timestamp={summary.timestamp}
          />
        </section>

        {/* 3. Market Trends */}
        <section className="grid gap-4 lg:grid-cols-2">
          <ChartPanel
            title="Listing Activity"
            description="New listings, removals, and price drops over time"
            action={<PeriodToggle value={activityPeriod} onChange={setActivityPeriod} />}
          >
            <motion.div
              key={`${activityPeriod}-${filteredVehicles.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Line type="monotone" dataKey="removedListings" name="Removed Listings" stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="priceDrops" name="Price Drops" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="newListings" name="New Listings" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </ChartPanel>

          <ChartPanel
            title="Average Market Price"
            description="Market-wide listing price trend"
            action={<PeriodToggle value={pricePeriod} onChange={setPricePeriod} />}
          >
            <motion.div
              key={`${pricePeriod}-${filteredVehicles.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={(value) => [formatCurrency(Number(value)), "Avg Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    name="Avg Price"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </ChartPanel>
        </section>

        {/* 4. Market Insights */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <h3 className="text-[14px] font-semibold">Most Undervalued Vehicles</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Top 5 buying opportunities right now</p>
            <div className="mt-4 overflow-x-auto">
              {undervalued.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-muted-foreground">
                  No undervalued vehicles match your current filters.
                </p>
              ) : (
                <table className="w-full min-w-[480px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      <th className="pb-2.5 pr-3 font-medium">Vehicle</th>
                      <th className="pb-2.5 pr-3 font-medium">Asking Price</th>
                      <th className="pb-2.5 pr-3 font-medium">Market Value</th>
                      <th className="pb-2.5 pr-3 font-medium">Discount</th>
                      <th className="pb-2.5 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {undervalued.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/60 transition-colors last:border-0 hover:bg-[#fafafa]"
                      >
                        <td className="py-3 pr-3">
                          <Link
                            href={`/vehicles/${row.id}`}
                            className="font-medium text-foreground hover:text-[#2563eb]"
                          >
                            {row.vehicle}
                          </Link>
                        </td>
                        <td className="py-3 pr-3 font-mono tabular-nums">{formatCurrency(row.currentPrice)}</td>
                        <td className="py-3 pr-3 font-mono tabular-nums text-muted-foreground">
                          {formatCurrency(row.marketValue)}
                        </td>
                        <td className="py-3 pr-3 font-mono text-[#16a34a] tabular-nums">{row.discountPct}%</td>
                        <td className="py-3">
                          <span className="inline-flex min-w-[28px] items-center justify-center rounded-md bg-[#eff6ff] px-2 py-0.5 font-mono text-[12px] font-semibold tabular-nums text-[#2563eb]">
                            {row.opportunityScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <h3 className="text-[14px] font-semibold">Marketplace Comparison</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Active sources side by side</p>
            <div className="mt-4 space-y-3">
              {marketplaces.map((m) => (
                <div
                  key={m.name}
                  className="rounded-xl border border-border bg-[#fafafa] p-4 transition-all hover:border-[#2563eb]/20 hover:bg-white hover:shadow-sm"
                >
                  <p className="text-[13px] font-semibold">{m.name}</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Listings</p>
                      <p className="mt-0.5 font-mono text-[15px] font-semibold tabular-nums">
                        {m.listings.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Avg Price</p>
                      <p className="mt-0.5 font-mono text-[15px] font-semibold tabular-nums">
                        {m.listings ? formatCurrency(m.avgPrice) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Opp. Score</p>
                      <p className="mt-0.5 font-mono text-[15px] font-semibold tabular-nums text-[#2563eb]">
                        {m.listings ? m.opportunityScore : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. AI Insights Feed */}
        <section>
          <IntelligenceInsightsFeed
            insights={insights.length > 0 ? insights : MARKET_AI_INSIGHTS}
            title="AI Insights Feed"
            live
          />
        </section>
      </motion.div>
    </div>
  );
}
