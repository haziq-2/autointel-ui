"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionTitle } from "@/components/shared/page-header";
import { MetricsGrid } from "@/components/shared/metrics-grid";
import { PriceInventoryTrendChart } from "@/components/market-intelligence/price-inventory-trend-chart";
import {
  BODY_STYLE_MIX,
  FAST_SELLING_MODELS,
  MARKET_TRENDS,
  REGIONAL_METRICS,
  SEASONALITY_DATA,
  SLOW_SELLING_MODELS,
} from "@/lib/mock-data/intelligence";

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string | number;
  formatter?: (name: string, value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-border bg-white px-3 py-2 shadow-card">
      {label != null && <p className="mb-1 text-[12px] text-muted-foreground">{String(label)}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="font-mono text-[13px] font-medium tabular-nums" style={{ color: entry.color }}>
          {formatter ? formatter(entry.name, entry.value) : `${entry.name}: ${entry.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
}

const MODEL_VELOCITY = [
  ...FAST_SELLING_MODELS.map((m) => ({
    model: m.model,
    daysToSell: m.daysToSell,
    type: "fast" as const,
  })),
  ...SLOW_SELLING_MODELS.map((m) => ({
    model: m.model,
    daysToSell: m.daysToSell,
    type: "slow" as const,
  })),
].sort((a, b) => a.daysToSell - b.daysToSell);

const TREND_CHANGES = MARKET_TRENDS.map((t) => ({
  metric: t.metric.replace("Avg listing price", "Avg price").replace("Active inventory", "Inventory"),
  change: t.change,
}));

export function MarketCharts() {
  return (
    <div className="space-y-10">
      <MetricsGrid
        metrics={MARKET_TRENDS.map((t) => ({
          label: t.metric,
          value: t.value,
          change: t.change,
        }))}
      />

      <PriceInventoryTrendChart />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle description="Period-over-period change by metric">Trend momentum</SectionTitle>
          <div className="rounded-md border border-border p-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TREND_CHANGES}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
                >
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="metric"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={88}
                  />
                  <Tooltip
                    cursor={{ fill: "#FAFAFA" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as (typeof TREND_CHANGES)[0];
                      return (
                        <div className="rounded-[10px] border border-border bg-white px-3 py-2 shadow-card">
                          <p className="text-[12px] text-muted-foreground">{point.metric}</p>
                          <p className="font-mono text-[13px] font-medium tabular-nums">
                            {point.change > 0 ? "+" : ""}
                            {point.change}% vs prior period
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="change" radius={[0, 4, 4, 0]} maxBarSize={20}>
                    {TREND_CHANGES.map((entry) => (
                      <Cell
                        key={entry.metric}
                        fill={entry.change >= 0 ? "#2563eb" : "#dc2626"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle description="Inventory share and demand shift by body style">Segment mix</SectionTitle>
          <div className="rounded-md border border-border p-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BODY_STYLE_MIX} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="segment"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    width={36}
                  />
                  <Tooltip
                    cursor={{ fill: "#FAFAFA" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as (typeof BODY_STYLE_MIX)[0];
                      return (
                        <div className="rounded-[10px] border border-border bg-white px-3 py-2 shadow-card">
                          <p className="text-[12px] text-muted-foreground">{point.segment}</p>
                          <p className="font-mono text-[13px] font-medium tabular-nums">
                            {point.share}% of inventory
                          </p>
                          <p
                            className="font-mono text-[13px] font-medium tabular-nums"
                            style={{ color: point.demandChange >= 0 ? "#16a34a" : "#dc2626" }}
                          >
                            Demand {point.demandChange > 0 ? "+" : ""}
                            {point.demandChange}%
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="share" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      <section>
        <SectionTitle description="Lower days to sell indicate stronger demand">Model sell-through velocity</SectionTitle>
        <div className="rounded-md border border-border p-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MODEL_VELOCITY}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "Days to sell", position: "insideBottom", offset: -2, fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  type="category"
                  dataKey="model"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={108}
                />
                <Tooltip
                  cursor={{ fill: "#FAFAFA" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0].payload as (typeof MODEL_VELOCITY)[0];
                    return (
                      <div className="rounded-[10px] border border-border bg-white px-3 py-2 shadow-card">
                        <p className="text-[12px] text-muted-foreground">{point.model}</p>
                        <p className="font-mono text-[13px] font-medium tabular-nums">
                          {point.daysToSell} days to sell
                        </p>
                        <p className="text-[12px] capitalize text-muted-foreground">
                          {point.type === "fast" ? "Fast moving" : "Slow moving"}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="daysToSell" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {MODEL_VELOCITY.map((entry) => (
                    <Cell key={entry.model} fill={entry.type === "fast" ? "#16a34a" : "#dc2626"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle description="Supply vs demand index by region">Regional comparison</SectionTitle>
          <div className="rounded-md border border-border p-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REGIONAL_METRICS} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="region"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[60, 100]}
                    width={32}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const point = REGIONAL_METRICS.find((r) => r.region === label);
                      if (!point) return null;
                      return (
                        <div className="rounded-[10px] border border-border bg-white px-3 py-2 shadow-card">
                          <p className="mb-1 text-[12px] text-muted-foreground">{label}</p>
                          <p className="font-mono text-[13px] font-medium tabular-nums text-[#2563eb]">
                            Supply: {point.supply.toLocaleString()}
                          </p>
                          <p className="font-mono text-[13px] font-medium tabular-nums text-[#111827]">
                            Demand index: {point.demandIndex}
                          </p>
                          <p className="font-mono text-[13px] font-medium tabular-nums text-muted-foreground">
                            Avg price: ${point.avgPrice.toLocaleString()}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={28}
                    formatter={(value) => (
                      <span className="text-[12px] text-muted-foreground">{value}</span>
                    )}
                  />
                  <Bar yAxisId="left" dataKey="supply" name="Supply" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="demandIndex"
                    name="Demand index"
                    stroke="#111827"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#111827" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle description="Seasonal demand multiplier across the year">Seasonality index</SectionTitle>
          <div className="rounded-md border border-border p-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SEASONALITY_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="seasonFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0.8, 1.2]}
                    tickFormatter={(v) => v.toFixed(2)}
                    width={36}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <ChartTooltip
                        active={active}
                        label={label}
                        payload={payload?.map((p) => ({
                          name: "Seasonal index",
                          value: p.value as number,
                          color: "#2563eb",
                        }))}
                        formatter={(_, value) => `Index: ${value.toFixed(2)}`}
                      />
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="index"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#seasonFill)"
                    dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Spring peaks at 1.14× baseline demand. Used Toyota Tacomas in Texas are up 6.8% while inventory fell 18%,
              indicating tightening supply through peak season.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
