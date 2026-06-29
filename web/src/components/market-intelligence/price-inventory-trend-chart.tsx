"use client";

import { useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionTitle } from "@/components/shared/page-header";
import { MARKET_PRICE_HISTORY } from "@/lib/mock-data/intelligence";
import { cn } from "@/lib/utils";

type PricePoint = (typeof MARKET_PRICE_HISTORY)[number];

function pctChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function SummaryStat({
  label,
  value,
  change,
  invertChange,
}: {
  label: string;
  value: string;
  change: number;
  invertChange?: boolean;
}) {
  const positive = invertChange ? change < 0 : change > 0;
  const negative = invertChange ? change > 0 : change < 0;
  return (
    <div className="rounded-md border border-border bg-[#fafafa] px-4 py-3">
      <p className="text-label">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums tracking-tight">{value}</p>
      <p
        className={cn(
          "mt-0.5 font-mono text-[12px] tabular-nums",
          positive && "text-[#16a34a]",
          negative && "text-[#dc2626]",
          !positive && !negative && "text-muted-foreground"
        )}
      >
        {change > 0 ? "+" : ""}
        {change.toFixed(1)}% vs 12 wks ago
      </p>
    </div>
  );
}

export function PriceInventoryTrendChart() {
  const enriched = useMemo(
    () =>
      MARKET_PRICE_HISTORY.map((point, index) => {
        const prev = index > 0 ? MARKET_PRICE_HISTORY[index - 1] : null;
        return {
          ...point,
          priceWow: prev ? pctChange(point.price, prev.price) : 0,
          inventoryWow: prev ? pctChange(point.inventory, prev.inventory) : 0,
        };
      }),
    []
  );

  const first = MARKET_PRICE_HISTORY[0];
  const last = MARKET_PRICE_HISTORY[MARKET_PRICE_HISTORY.length - 1];
  const priceChange = pctChange(last.price, first.price);
  const inventoryChange = pctChange(last.inventory, first.inventory);
  const domChange = pctChange(last.daysOnMarket, first.daysOnMarket);
  const avgPrice = Math.round(
    MARKET_PRICE_HISTORY.reduce((sum, point) => sum + point.price, 0) / MARKET_PRICE_HISTORY.length
  );

  return (
    <section>
      <SectionTitle description="12-week view — price softening as listing volume climbs into peak season">
        Price & inventory trends
      </SectionTitle>

      <div className="rounded-md border border-border p-4">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryStat
            label="Avg listing price"
            value={`$${last.price.toLocaleString()}`}
            change={priceChange}
            invertChange
          />
          <SummaryStat
            label="Active inventory"
            value={last.inventory.toLocaleString()}
            change={inventoryChange}
          />
          <SummaryStat
            label="Days on market"
            value={last.daysOnMarket.toFixed(1)}
            change={domChange}
            invertChange
          />
          <SummaryStat
            label="Price reductions"
            value={String(last.priceReductions)}
            change={pctChange(last.priceReductions, first.priceReductions)}
          />
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={enriched} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="inventoryBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.55} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                tickFormatter={(value, index) => {
                  const point = enriched[index];
                  return point ? `${value}` : value;
                }}
              />

              <YAxis
                yAxisId="price"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={48}
                domain={["dataMin - 300", "dataMax + 300"]}
              />

              <YAxis
                yAxisId="inventory"
                orientation="right"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                width={48}
                domain={[4500, "dataMax + 80"]}
              />

              <YAxis
                yAxisId="listings"
                hide
                domain={[350, 430]}
              />

              <YAxis
                yAxisId="dom"
                orientation="right"
                hide
                domain={[23.5, 28]}
              />

              <ReferenceLine
                yAxisId="price"
                y={avgPrice}
                stroke="#9ca3af"
                strokeDasharray="4 4"
                label={{
                  value: `12-wk avg $${(avgPrice / 1000).toFixed(1)}k`,
                  position: "insideTopRight",
                  fill: "#9ca3af",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0].payload as PricePoint & {
                    priceWow: number;
                    inventoryWow: number;
                  };
                  return (
                    <div className="min-w-[200px] rounded-[10px] border border-border bg-white px-3 py-2.5 shadow-card">
                      <p className="text-[12px] font-medium text-foreground">
                        {point.label} · {point.date}
                      </p>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12px] text-muted-foreground">Avg price</span>
                          <span className="font-mono text-[13px] font-medium tabular-nums text-[#2563eb]">
                            ${point.price.toLocaleString()}
                            {point.priceWow !== 0 && (
                              <span className="ml-1.5 text-[11px] font-normal text-[#dc2626]">
                                {point.priceWow > 0 ? "+" : ""}
                                {point.priceWow.toFixed(1)}%
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12px] text-muted-foreground">Inventory</span>
                          <span className="font-mono text-[13px] font-medium tabular-nums">
                            {point.inventory.toLocaleString()}
                            {point.inventoryWow !== 0 && (
                              <span className="ml-1.5 text-[11px] font-normal text-[#16a34a]">
                                {point.inventoryWow > 0 ? "+" : ""}
                                {point.inventoryWow.toFixed(1)}%
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12px] text-muted-foreground">Days on market</span>
                          <span className="font-mono text-[13px] font-medium tabular-nums">
                            {point.daysOnMarket.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12px] text-muted-foreground">New listings</span>
                          <span className="font-mono text-[13px] font-medium tabular-nums text-[#d97706]">
                            {point.newListings}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12px] text-muted-foreground">Price cuts</span>
                          <span className="font-mono text-[13px] font-medium tabular-nums text-[#dc2626]">
                            {point.priceReductions}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-[12px] text-muted-foreground">{value}</span>
                )}
              />

              <Bar
                yAxisId="inventory"
                dataKey="inventory"
                name="Active inventory"
                fill="url(#inventoryBar)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                barSize={22}
              />

              <Line
                yAxisId="listings"
                type="monotone"
                dataKey="newListings"
                name="New listings"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
                activeDot={{ r: 4, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
              />

              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                name="Avg listing price"
                stroke="none"
                fill="url(#priceFill)"
                legendType="none"
              />

              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                name="Avg listing price"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
              />

              <Line
                yAxisId="dom"
                type="monotone"
                dataKey="daysOnMarket"
                name="Days on market"
                stroke="#111827"
                strokeWidth={1.75}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4, fill: "#111827" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-[12px] text-muted-foreground">
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#2563eb] mr-1.5" />
            Prices down <span className="font-mono text-foreground">{Math.abs(priceChange).toFixed(1)}%</span> since Wk 1
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#93c5fd] mr-1.5" />
            Inventory up <span className="font-mono text-foreground">{inventoryChange.toFixed(1)}%</span> over same period
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#f59e0b] mr-1.5" />
            New listings holding at <span className="font-mono text-foreground">~{last.newListings}/wk</span>
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#111827] mr-1.5" />
            Sell-through improving — DOM fell <span className="font-mono text-foreground">{Math.abs(domChange).toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </section>
  );
}
