"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Gauge,
  LineChart as LineChartIcon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
  Truck,
  Clock,
  Package,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BuyRecommendationStatus, ComparableListing, PricingOpportunityDriver, PricingWorkspace } from "@/lib/types";
import { formatCurrency, formatMileage } from "@/lib/format";
import { KpiCard, KpiGrid } from "@/components/shared/kpi-card";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { IntelligenceInsightsFeed } from "@/components/intelligence/dashboard/intelligence-insights-feed";

const DONUT_COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#cbd5e1"];

const REC_STYLES: Record<
  BuyRecommendationStatus,
  { label: string; emoji: string; border: string; bg: string; text: string }
> = {
  buy: { label: "Buy Recommended", emoji: "🟢", border: "border-[#16a34a]/30", bg: "from-[#f0fdf4] via-white to-[#eff6ff]", text: "text-[#15803d]" },
  review: { label: "Review Recommended", emoji: "🟡", border: "border-[#d97706]/30", bg: "from-[#fffbeb] via-white to-[#eff6ff]", text: "text-[#b45309]" },
  avoid: { label: "Avoid", emoji: "🔴", border: "border-[#dc2626]/30", bg: "from-[#fef2f2] via-white to-[#fafafa]", text: "text-[#dc2626]" },
};

const DRIVER_ICONS: Record<PricingOpportunityDriver["icon"], typeof TrendingUp> = {
  trending: TrendingDown,
  demand: Users,
  mileage: Gauge,
  resale: TrendingUp,
  inventory: Package,
  repair: Wrench,
  seasonal: Calendar,
  transport: Truck,
  age: Clock,
};

function useCountUp(target: number, enabled = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 800, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);
  return value;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function PriceRangeViz({ data, currentPrice }: { data: PricingWorkspace["priceComparison"]; currentPrice: number }) {
  const range = data.highestComparable - data.lowestComparable || 1;
  const pos = ((currentPrice - data.lowestComparable) / range) * 100;

  return (
    <div className="mt-6">
      <div className="relative h-3 rounded-full bg-gradient-to-r from-[#16a34a] via-[#fbbf24] to-[#dc2626] opacity-80" />
      <div className="relative mt-1 h-8">
        <div className="absolute top-0 text-[10px] text-muted-foreground" style={{ left: "0%" }}>
          Low
          <p className="font-mono text-[11px] font-medium text-foreground">{formatCurrency(data.lowestComparable)}</p>
        </div>
        <div className="absolute top-0 -translate-x-1/2 text-center text-[10px] text-muted-foreground" style={{ left: "50%" }}>
          Avg
          <p className="font-mono text-[11px] font-medium text-foreground">{formatCurrency(data.marketAverage)}</p>
        </div>
        <div className="absolute top-0 right-0 text-right text-[10px] text-muted-foreground">
          High
          <p className="font-mono text-[11px] font-medium text-foreground">{formatCurrency(data.highestComparable)}</p>
        </div>
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${Math.min(96, Math.max(4, pos))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-6 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-[#2563eb] shadow-md"
          title="Current vehicle"
        />
      </div>
      <p className="mt-8 text-center text-[12px] text-muted-foreground">
        Current listing at <span className="font-mono font-medium text-[#2563eb]">{formatCurrency(currentPrice)}</span>
      </p>
    </div>
  );
}

function RiskBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? "bg-[#16a34a]" : score >= 50 ? "bg-[#f59e0b]" : "bg-[#dc2626]";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium tabular-nums">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f4f4f5]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

type SortKey = "price" | "mileage" | "daysListed";

export function PricingIntelligenceView({ workspace }: { workspace: PricingWorkspace }) {
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRec, setExpandedRec] = useState(false);

  const rec = REC_STYLES[workspace.recommendation.status];
  const asking = useCountUp(workspace.askingPrice);
  const market = useCountUp(workspace.marketValue);
  const profit = useCountUp(workspace.expectedNetProfit);

  const sortedComparables = useMemo(() => {
    const rows = [...workspace.comparables];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return rows;
  }, [workspace.comparables, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const pctBelow = workspace.priceComparison.differencePct;
  const isBelow = pctBelow < 0;

  return (
    <motion.div
      key={workspace.vehicleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      {/* 1. Pricing Overview */}
      <Section title="Pricing Overview" description={workspace.vehicleTitle}>
        <KpiGrid className="lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Asking Price" value={formatCurrency(asking)} subtitle="Current seller price" />
          <KpiCard label="AI Estimated Market Value" value={formatCurrency(market)} subtitle="AI valuation" />
          <KpiCard label="Recommended Purchase Price" value={formatCurrency(workspace.recommendedPurchase)} subtitle="Target acquisition" />
          <KpiCard label="Maximum Purchase Price" value={formatCurrency(workspace.maxPurchase)} subtitle="Walk-away ceiling" />
          <KpiCard label="Expected Resale Price" value={formatCurrency(workspace.expectedResale)} subtitle="Projected exit" />
          <KpiCard
            label="Expected Net Profit"
            value={formatCurrency(profit)}
            subtitle={`Projected ROI ${workspace.projectedRoi}%`}
          />
        </KpiGrid>
      </Section>

      {/* 2. AI Buy Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl border bg-gradient-to-br p-6 shadow-card",
          rec.border,
          rec.bg
        )}
      >
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2563eb] shadow-lg shadow-[#2563eb]/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className={cn("text-[18px] font-semibold tracking-tight", rec.text)}>
                {rec.emoji} {rec.label}
              </h3>
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#2563eb]">
                {workspace.recommendation.confidence}% confidence
              </span>
              <span className="text-[11px] text-muted-foreground">{workspace.recommendation.timestamp}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {(expandedRec ? workspace.recommendation.bullets : workspace.recommendation.bullets.slice(0, 3)).map((b) => (
                <li key={b} className="flex gap-2.5 text-[14px] leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                  {b}
                </li>
              ))}
            </ul>
            {workspace.recommendation.bullets.length > 3 && (
              <button
                type="button"
                onClick={() => setExpandedRec((v) => !v)}
                className="mt-2 text-[12px] font-medium text-[#2563eb] hover:underline"
              >
                {expandedRec ? "Show less" : `Show ${workspace.recommendation.bullets.length - 3} more insights`}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3. Price Comparison */}
      <Section title="Price Comparison" description="Asking price vs market and comparable range">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Asking Price", value: workspace.askingPrice },
              { label: "Market Value", value: workspace.marketValue },
              { label: "Difference", value: Math.abs(workspace.priceComparison.difference), highlight: isBelow },
              { label: isBelow ? "Below Market" : "Above Market", value: `${Math.abs(pctBelow)}%`, pct: true },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#fafafa] p-4">
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
                <p className={cn("mt-1 font-mono text-xl font-semibold tabular-nums", item.highlight && "text-[#16a34a]")}>
                  {item.pct ? item.value : formatCurrency(item.value as number)}
                </p>
              </div>
            ))}
          </div>
          <PriceRangeViz data={workspace.priceComparison} currentPrice={workspace.askingPrice} />
        </div>
      </Section>

      {/* 4. Comparable Vehicles */}
      <Section title="Comparable Vehicles" description="Active and recent sales in your market">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <DataTable>
            <DataTableHead>
              <tr>
                <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
                <DataTableHeaderCell>Year</DataTableHeaderCell>
                <DataTableHeaderCell align="right">
                  <button type="button" onClick={() => toggleSort("mileage")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Mileage {sortKey === "mileage" && (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </button>
                </DataTableHeaderCell>
                <DataTableHeaderCell align="right">
                  <button type="button" onClick={() => toggleSort("price")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Asking Price {sortKey === "price" && (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </button>
                </DataTableHeaderCell>
                <DataTableHeaderCell align="right">
                  <button type="button" onClick={() => toggleSort("daysListed")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Days Listed {sortKey === "daysListed" && (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>Marketplace</DataTableHeaderCell>
                <DataTableHeaderCell align="right">Distance</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
              </tr>
            </DataTableHead>
            <tbody>
              {sortedComparables.map((c) => (
                <ComparableRow key={c.id} row={c} />
              ))}
            </tbody>
          </DataTable>
        </div>
      </Section>

      {/* 5. Negotiation Intelligence */}
      <Section title="Negotiation Intelligence">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "Recommended First Offer", value: formatCurrency(workspace.negotiation.firstOffer) },
              { label: "Target Purchase Price", value: formatCurrency(workspace.negotiation.targetPurchasePrice) },
              { label: "Maximum Purchase Price", value: formatCurrency(workspace.negotiation.maxOffer) },
              { label: "Acceptance Probability", value: `${workspace.negotiation.acceptanceProbability}%` },
              { label: "Seller Motivation", value: workspace.negotiation.sellerMotivation },
              { label: "Negotiation Difficulty", value: workspace.negotiation.difficulty },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-[#fafafa] p-4 transition-colors hover:bg-white">
                <p className="text-[11px] text-muted-foreground">{k.label}</p>
                <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums">{k.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-xl bg-[#fafafa] p-4 text-[13px] leading-relaxed text-muted-foreground">
            {workspace.negotiation.explanation}
          </p>
        </div>
      </Section>

      {/* 6. Profit Analysis */}
      <Section title="Profit Analysis">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { label: "Purchase Price", value: workspace.profit.purchasePrice },
              { label: "Transportation", value: workspace.profit.transportation },
              { label: "Reconditioning", value: workspace.profit.reconditioning },
              { label: "Auction/Fees", value: workspace.profit.auctionFees },
              { label: "Holding Cost", value: workspace.profit.holdingCost },
              { label: "Total Acquisition", value: workspace.profit.totalAcquisitionCost },
              { label: "Expected Selling", value: workspace.profit.expectedSellingPrice },
              { label: "Expected Net Profit", value: workspace.profit.netProfit, green: true },
              { label: "Projected ROI", value: `${workspace.profit.roi}%`, green: true },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-[#fafafa] p-3">
                <p className="text-[11px] text-muted-foreground">{k.label}</p>
                <p className={cn("mt-1 font-mono text-[14px] font-semibold tabular-nums", k.green && "text-[#16a34a]")}>
                  {typeof k.value === "number" ? formatCurrency(k.value) : k.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[13px] font-medium">
                <BarChart3 className="h-4 w-4 text-[#2563eb]" />
                Cost waterfall
              </p>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workspace.profit.waterfall.filter((w) => w.label !== "Sale")} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(Math.abs(v) / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatCurrency(Math.abs(Number(v)))} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
                      {workspace.profit.waterfall.filter((w) => w.label !== "Sale").map((entry) => (
                        <Cell key={entry.label} fill={entry.type === "total" ? "#16a34a" : "#94a3b8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="mb-3 flex items-center gap-2 text-[13px] font-medium">
                <LineChartIcon className="h-4 w-4 text-[#2563eb]" />
                Cost allocation
              </p>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={workspace.profit.costBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3}>
                      {workspace.profit.costBreakdown.map((_, i) => (
                        <Cell key={_.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Price History */}
      <Section title="Price History">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-[#fafafa] p-4">
              <p className="text-[11px] text-muted-foreground">Total Price Reduction</p>
              <p className="mt-1 font-mono text-lg font-semibold text-[#16a34a]">{formatCurrency(workspace.priceHistory.totalReduction)}</p>
            </div>
            <div className="rounded-xl bg-[#fafafa] p-4">
              <p className="text-[11px] text-muted-foreground">Number of Reductions</p>
              <p className="mt-1 font-mono text-lg font-semibold">{workspace.priceHistory.reductionCount}</p>
            </div>
            <div className="rounded-xl bg-[#fafafa] p-4">
              <p className="text-[11px] text-muted-foreground">Days Since Last Reduction</p>
              <p className="mt-1 font-mono text-lg font-semibold">{workspace.priceHistory.daysSinceLastReduction}</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workspace.priceHistory.points}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Price"]} />
                <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* 8. Market Snapshot */}
      <Section title="Market Snapshot">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Avg Local Market Price", value: formatCurrency(workspace.marketSnapshot.avgLocalPrice) },
              { label: "Avg Days to Sell", value: `${workspace.marketSnapshot.avgDaysToSell} days` },
              { label: "Demand Score", value: workspace.marketSnapshot.demandScore },
              { label: "Inventory Level", value: workspace.marketSnapshot.inventoryLevel },
              { label: "Similar Active Listings", value: workspace.marketSnapshot.similarActiveListings },
              { label: "Recent Sales", value: workspace.marketSnapshot.recentSales },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-white p-4 shadow-card">
                <p className="text-[11px] text-muted-foreground">{k.label}</p>
                <p className="mt-1 font-mono text-[16px] font-semibold tabular-nums">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="text-[12px] font-medium text-muted-foreground">Demand trend</p>
            <div className="mt-3 h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workspace.marketSnapshot.demandTrend.map((v, i) => ({ w: `W${i + 1}`, score: v }))}>
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>

      {/* 9. Risk Assessment */}
      <Section title="Risk Assessment">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="space-y-4">
            <RiskBar label="Pricing Risk" score={workspace.risk.pricing} />
            <RiskBar label="Repair Risk" score={workspace.risk.repair} />
            <RiskBar label="Demand Risk" score={workspace.risk.demand} />
            <RiskBar label="Holding Risk" score={workspace.risk.holding} />
            <RiskBar label="Market Risk" score={workspace.risk.market} />
          </div>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-[#fafafa] px-4 py-3">
            <span className="text-[13px] font-medium">Overall Risk Rating</span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[12px] font-semibold",
                workspace.risk.overall === "Low Risk" && "bg-[#dcfce7] text-[#15803d]",
                workspace.risk.overall === "Moderate Risk" && "bg-[#fef3c7] text-[#b45309]",
                workspace.risk.overall === "High Risk" && "bg-[#fee2e2] text-[#dc2626]"
              )}
            >
              {workspace.risk.overall}
            </span>
          </div>
        </div>
      </Section>

      {/* 10. Opportunity Drivers */}
      <section className="grid gap-4 lg:grid-cols-2">
        <DriverCard title="Positive Drivers" drivers={workspace.positiveDrivers} positive />
        <DriverCard title="Negative Drivers" drivers={workspace.negativeDrivers} />
      </section>

      {/* 11. AI Pricing Insights */}
      <Section title="AI Pricing Insights">
        <IntelligenceInsightsFeed insights={workspace.insights} title="Pricing insights feed" live={false} />
      </Section>
    </motion.div>
  );
}

function ComparableRow({ row }: { row: ComparableListing }) {
  const statusStyle =
    row.status === "Sold"
      ? "bg-[#f4f4f5] text-muted-foreground"
      : row.status === "Pending"
        ? "bg-[#fffbeb] text-[#b45309]"
        : "bg-[#eff6ff] text-[#2563eb]";

  return (
    <DataTableRow>
      <DataTableCell>
        <Link href={`/vehicles/${row.id}`} className="font-medium hover:text-[#2563eb]">
          {row.vehicle}
        </Link>
      </DataTableCell>
      <DataTableCell className="font-mono text-muted-foreground">{row.year}</DataTableCell>
      <DataTableCell align="right" className="font-mono tabular-nums">{formatMileage(row.mileage)}</DataTableCell>
      <DataTableCell align="right" className="font-mono font-medium tabular-nums">{formatCurrency(row.price)}</DataTableCell>
      <DataTableCell align="right" className="font-mono tabular-nums">{row.daysListed}</DataTableCell>
      <DataTableCell className="text-muted-foreground">{row.source}</DataTableCell>
      <DataTableCell align="right" className="text-muted-foreground">{row.distance}</DataTableCell>
      <DataTableCell>
        <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium", statusStyle)}>{row.status ?? "Active"}</span>
      </DataTableCell>
    </DataTableRow>
  );
}

function DriverCard({
  title,
  drivers,
  positive,
}: {
  title: string;
  drivers: PricingOpportunityDriver[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <h3 className="text-[14px] font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {drivers.map((d) => {
          const Icon = DRIVER_ICONS[d.icon];
          return (
            <li key={d.title} className="flex gap-3 rounded-xl border border-border bg-[#fafafa] p-3 transition-colors hover:bg-white">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", positive ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fef3c7] text-[#b45309]")}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[13px] font-medium">{d.title}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{d.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
