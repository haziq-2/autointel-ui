"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import { ChartPanel } from "@/components/intelligence/dashboard/intelligence-filter-bar";
import { StarRating } from "@/components/intelligence/dashboard/ranking-components";
import { USDemandMap } from "@/components/intelligence/dashboard/us-demand-map";
import { TrendBarChart } from "@/components/intelligence/regional-intelligence";
import { IntelligenceInsightsFeed } from "@/components/intelligence/dashboard/intelligence-insights-feed";
import {
  EXTENDED_STATE_INTEL,
  MARKET_OPPORTUNITY_RATINGS,
  TOP_CITIES_EXTENDED,
  STATE_PERFORMANCE_CARDS,
  BRAND_BY_REGION,
  REGIONAL_INVENTORY,
  REGIONAL_DEMAND_FORECAST,
  REGIONAL_AI_INSIGHTS,
} from "@/lib/mock-data/intelligence-dashboard";
import { formatCurrency } from "@/lib/format";

export function RegionalIntelligenceDashboard() {
  const topState = EXTENDED_STATE_INTEL[0];
  const kpis = [
    { label: "Strongest Market", value: topState.name, change: 8.2 },
    { label: "National Demand Score", value: 84, change: 6.4, sparkline: [76, 78, 80, 81, 82, 83, 84] },
    { label: "States Tracked", value: EXTENDED_STATE_INTEL.length, change: 12 },
    { label: "Top City", value: "Dallas, TX", description: "Demand score 96" },
    { label: "Avg Regional Margin", value: 4280, change: 5.8, sparkline: [3900, 4020, 4100, 4180, 4220, 4260, 4280] },
    { label: "Avg Sale Time", value: 15.2, change: -4.2, sparkline: [18, 17.5, 17, 16.5, 16, 15.5, 15.2] },
    { label: "Inventory Growth", value: `${REGIONAL_INVENTORY.inventoryGrowth}%`, change: REGIONAL_INVENTORY.inventoryGrowth },
    { label: "Supply Index", value: REGIONAL_INVENTORY.supplyIndex, change: -2.4 },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Regional Intelligence"
        description="Where should we buy vehicles?"
      />

      <ExecutiveKpiGrid items={kpis} />

      <AiMarketSummary
        title="AI Regional Summary"
        bullets={[
          "Texas remains the strongest buying market with 94 demand score",
          "Arizona inventory shrinking 6.8% — supply tightening rapidly",
          "Dallas and Phoenix rated 5-star acquisition markets",
          "Southwest pickup trucks outperform all regional categories",
          "California margins stable despite EV segment pressure",
        ]}
        confidence={95}
        timestamp="Updated 5 minutes ago"
      />

      <USDemandMap />

      <section>
        <SectionTitle>Best Acquisition Markets</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MARKET_OPPORTUNITY_RATINGS.map((m) => (
            <motion.div
              key={m.city}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-border bg-white p-4 text-center shadow-card"
            >
              <p className="text-[14px] font-semibold">{m.city}</p>
              <div className="mt-2">
                <StarRating stars={m.stars} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Top Cities</SectionTitle>
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>City</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Demand</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Inventory</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Avg Margin</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Sale Time</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Opp Score</DataTableHeaderCell>
              <DataTableHeaderCell align="right">ROI</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {TOP_CITIES_EXTENDED.map((c) => (
              <DataTableRow key={c.city}>
                <DataTableCell className="font-medium">{c.city}, {c.state}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{c.demandScore}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{c.inventory}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums text-[#16a34a]">{formatCurrency(c.avgMargin)}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{c.avgSaleTime}d</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{c.opportunityScore}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums text-[#16a34a]">{c.roi}%</DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section>
        <SectionTitle>State Performance</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATE_PERFORMANCE_CARDS.map((s) => (
            <motion.div
              key={s.code}
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl border border-border bg-white p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[15px] font-semibold">{s.name}</h4>
                <span className="rounded-md bg-[#eff6ff] px-2 py-0.5 font-mono text-[12px] font-semibold text-[#2563eb]">
                  {s.demandScore}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div><p className="text-muted-foreground">Avg Profit</p><p className="font-mono font-semibold text-[#16a34a]">{formatCurrency(s.avgMargin)}</p></div>
                <div><p className="text-muted-foreground">Inventory</p><p className="font-mono font-semibold">{s.inventory.toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Days to Sell</p><p className="font-mono font-semibold">{s.avgSaleTime}d</p></div>
                <div><p className="text-muted-foreground">ROI</p><p className="font-mono font-semibold">{s.roi}%</p></div>
              </div>
              <div className="mt-3">
                <Sparkline data={s.priceTrend} color="#2563eb" className="h-8 w-full" />
                <p className="mt-1 text-[10px] text-muted-foreground">Price trend (4 periods)</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Brand Popularity by Region</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(BRAND_BY_REGION).map(([region, data]) => (
            <div key={region} className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <h4 className="text-[13px] font-semibold">{region}</h4>
              <div className="mt-3 grid grid-cols-2 gap-4 text-[12px]">
                <div>
                  <p className="mb-1 text-muted-foreground">Top Brands</p>
                  {data.brands.map((b) => <p key={b} className="font-medium">{b}</p>)}
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Top Models</p>
                  {data.models.map((m) => <p key={m} className="font-medium">{m}</p>)}
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Categories</p>
                  {data.categories.map((c) => <p key={c}>{c}</p>)}
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground">Fuel Types</p>
                  {data.fuel.map((f) => <p key={f}>{f}</p>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Regional Inventory Dashboard</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <InvTile label="Inventory Growth" value={`+${REGIONAL_INVENTORY.inventoryGrowth}%`} />
          <InvTile label="New Listings" value={REGIONAL_INVENTORY.newListings.toLocaleString()} />
          <InvTile label="Removed Listings" value={REGIONAL_INVENTORY.removedListings.toLocaleString()} />
          <InvTile label="Avg Listing Age" value={`${REGIONAL_INVENTORY.avgListingAge}d`} />
          <InvTile label="Supply Index" value={String(REGIONAL_INVENTORY.supplyIndex)} />
        </div>
        <div className="mt-4">
          <ChartPanel title="Weekly Inventory Flow">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={REGIONAL_INVENTORY.weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="newListings" name="New" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="removed" name="Removed" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </section>

      <section>
        <SectionTitle>Regional Demand Forecast</SectionTitle>
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>State</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Projected Demand</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Expected ROI</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Avg Sale Time</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Inventory Δ</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Confidence</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {REGIONAL_DEMAND_FORECAST.map((r) => (
              <DataTableRow key={r.state}>
                <DataTableCell className="font-medium">{r.state}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{r.projectedDemand}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums text-[#16a34a]">{r.expectedRoi}%</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{r.avgSaleTime}d</DataTableCell>
                <DataTableCell align="right" className={`font-mono tabular-nums ${r.inventoryChange < 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                  {r.inventoryChange > 0 ? "+" : ""}{r.inventoryChange}%
                </DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums">{r.confidence}%</DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TrendBarChart title="National Brand Trends" data={[{ name: "Toyota", value: 92 }, { name: "Ford", value: 88 }, { name: "Honda", value: 84 }, { name: "Chevrolet", value: 79 }]} />
        <TrendBarChart title="Regional Category Index" data={[{ name: "Pickup Trucks", value: 96 }, { name: "SUVs", value: 86 }, { name: "Sedans", value: 68 }, { name: "Electric", value: 74 }]} />
      </div>

      <IntelligenceInsightsFeed insights={REGIONAL_AI_INSIGHTS} title="AI Regional Insights" />
    </div>
  );
}

function InvTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-[16px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}
