"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { Sparkline } from "@/components/shared/sparkline";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import { ExecutiveKpiGrid } from "@/components/intelligence/dashboard/executive-kpi-grid";
import { AiMarketSummary } from "@/components/intelligence/dashboard/ai-market-summary";
import {
  IntelligenceFilterBar,
  PeriodToggle,
  ChartPanel,
  DEFAULT_INTELLIGENCE_FILTERS,
  type IntelligenceFilters,
} from "@/components/intelligence/dashboard/intelligence-filter-bar";
import {
  RankingList,
  TrendArrow,
  OpportunityCards,
} from "@/components/intelligence/dashboard/ranking-components";
import { IntelligenceInsightsFeed } from "@/components/intelligence/dashboard/intelligence-insights-feed";
import {
  DEMAND_HERO_KPIS,
  DEMAND_RANKINGS,
  FASTEST_SELLING_LEADERBOARD,
  DEMAND_FORECAST,
  SEASONAL_DEMAND,
  SEASONAL_HEATMAP,
  CATEGORY_PERFORMANCE,
  EMERGING_OPPORTUNITIES,
  BUYER_ACTIVITY,
  DEMAND_AI_INSIGHTS,
} from "@/lib/mock-data/intelligence-dashboard";

export function DemandIntelligenceDashboard() {
  const [filters, setFilters] = useState<IntelligenceFilters>(DEFAULT_INTELLIGENCE_FILTERS);
  const [forecastPeriod, setForecastPeriod] = useState<"30d" | "60d" | "90d">("30d");

  const forecastData = DEMAND_FORECAST[forecastPeriod];

  const kpis = [
    { label: "Highest Demand Segment", value: DEMAND_HERO_KPIS.highestDemandSegment.value, change: DEMAND_HERO_KPIS.highestDemandSegment.change },
    { label: "Highest Demand Brand", value: DEMAND_HERO_KPIS.highestDemandBrand.value, change: DEMAND_HERO_KPIS.highestDemandBrand.change },
    { label: "Average Demand Score", ...DEMAND_HERO_KPIS.avgDemandScore },
    { label: "Fastest Selling Vehicle", value: DEMAND_HERO_KPIS.fastestSelling.value, description: `${DEMAND_HERO_KPIS.fastestSelling.days} days avg` },
    { label: "Average Sale Time", ...DEMAND_HERO_KPIS.avgSaleTime },
    { label: "Inventory Supply", value: DEMAND_HERO_KPIS.inventorySupply.value, change: DEMAND_HERO_KPIS.inventorySupply.change },
    { label: "Projected ROI", ...DEMAND_HERO_KPIS.projectedRoi },
    { label: "Forecast Accuracy", value: `${DEMAND_HERO_KPIS.forecastAccuracy.value}%`, change: DEMAND_HERO_KPIS.forecastAccuracy.change },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Demand Intelligence"
        description="What vehicles should we be buying?"
      />

      <ExecutiveKpiGrid items={kpis} />

      <AiMarketSummary
        title="AI Demand Summary"
        bullets={[
          "Pickup trucks lead demand index at 96 — 18% above segment average",
          "Hybrid SUVs showing fastest growth at +24% projected demand",
          "Average sale time compressed to 14.2 days nationally",
          "Buyer competition index at 78 — elevated in Texas metros",
          "Forecast accuracy holding at 93% across 30-day predictions",
        ]}
        confidence={93}
        timestamp="Updated 6 minutes ago"
      />

      <IntelligenceFilterBar filters={filters} onChange={setFilters} showDemandScore />

      <section>
        <SectionTitle>Top Demand Rankings</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RankingList title="Top Makes" items={DEMAND_RANKINGS.makes} />
          <RankingList title="Top Models" items={DEMAND_RANKINGS.models} />
          <RankingList title="Top Categories" items={DEMAND_RANKINGS.categories} />
          <RankingList title="Top Fuel Types" items={DEMAND_RANKINGS.fuelTypes} />
          <RankingList title="Top Price Segments" items={DEMAND_RANKINGS.priceSegments} />
        </div>
      </section>

      <section>
        <SectionTitle>Fastest Selling Vehicles</SectionTitle>
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Demand Score</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Days to Sell</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Expected ROI</DataTableHeaderCell>
              <DataTableHeaderCell>Trend</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Confidence</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {FASTEST_SELLING_LEADERBOARD.map((v) => (
              <DataTableRow key={v.vehicle}>
                <DataTableCell className="font-medium">{v.vehicle}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{v.demandScore}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{v.daysToSell}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums text-[#16a34a]">{v.expectedRoi}%</DataTableCell>
                <DataTableCell>
                  <TrendArrow value={v.trend === "up" ? 8 : v.trend === "down" ? -4 : 0} />
                </DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{v.confidence}%</DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </section>

      <ChartPanel
        title="Demand Forecast"
        description="Projected demand, supply, profit, and sale velocity"
        action={
          <PeriodToggle
            value={forecastPeriod}
            onChange={(v) => setForecastPeriod(v as "30d" | "60d" | "90d")}
            options={["30d", "60d", "90d"]}
            labels={{ "30d": "30 Days", "60d": "60 Days", "90d": "90 Days" }}
          />
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="demandGrowth" name="Demand Growth" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="supply" name="Supply" stroke="#94a3b8" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="expectedProfit" name="Expected Profit" stroke="#16a34a" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="avgDaysToSell" name="Days to Sell" stroke="#7c3aed" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel title="Seasonal Demand">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SEASONAL_DEMAND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="season" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0.8, 1.25]} />
              <Tooltip formatter={(v) => `${(Number(v) * 100 - 100).toFixed(0)}% vs avg`} />
              <Legend />
              <Bar dataKey="demand" name="Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Seasonal Heatmap" description="Demand index by segment and month">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th className="p-1 text-left text-muted-foreground">Month</th>
                  {["Trucks", "SUVs", "Sedans", "EV"].map((h) => (
                    <th key={h} className="p-1 text-center text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEASONAL_HEATMAP.map((row) => (
                  <tr key={row.month}>
                    <td className="p-1 font-medium">{row.month}</td>
                    {(["trucks", "suvs", "sedans", "ev"] as const).map((k) => {
                      const val = row[k] ?? 0.9;
                      const intensity = Math.round((val - 0.8) * 500);
                      return (
                        <td key={k} className="p-1">
                          <div
                            className="rounded-md py-1.5 text-center font-mono tabular-nums"
                            style={{ backgroundColor: `rgba(37, 99, 235, ${Math.min(0.85, intensity / 100)})`, color: intensity > 40 ? "#fff" : "#111" }}
                          >
                            {val.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartPanel>
      </div>

      <section>
        <SectionTitle>Category Performance</SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={CATEGORY_PERFORMANCE}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="category" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="demand" name="Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="opportunityScore" name="Opp Score" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="daysToSell" name="Days to Sell" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <SectionTitle>Emerging Opportunities</SectionTitle>
        <OpportunityCards items={EMERGING_OPPORTUNITIES} />
      </section>

      <section>
        <SectionTitle>Buyer Activity Dashboard</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <ActivityTile label="Demand Index" value={String(BUYER_ACTIVITY.demandIndex)} />
          <ActivityTile label="Buyer Competition" value={`${BUYER_ACTIVITY.buyerCompetition}%`} />
          <ActivityTile label="Vehicle Saves" value={BUYER_ACTIVITY.vehicleSaves.toLocaleString()} />
          <ActivityTile label="Contacts" value={BUYER_ACTIVITY.vehicleContacts.toLocaleString()} />
          <ActivityTile label="Listing Views" value={`${(BUYER_ACTIVITY.listingViews / 1000).toFixed(1)}k`} />
          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="text-[11px] text-muted-foreground">Weekly Trend</p>
            <Sparkline data={BUYER_ACTIVITY.weeklyTrend} color="#2563eb" className="mt-2 h-10 w-full" />
          </div>
        </div>
        <div className="mt-4">
          <ChartPanel title="Search Activity">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={BUYER_ACTIVITY.searchActivity}>
                <defs>
                  <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#searchGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </section>

      <IntelligenceInsightsFeed insights={DEMAND_AI_INSIGHTS} title="AI Demand Insights" />
    </div>
  );
}

function ActivityTile({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-border bg-white p-4 shadow-card"
    >
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-[18px] font-semibold tabular-nums">{value}</p>
    </motion.div>
  );
}
