"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyScrapePoint } from "@/lib/mock-data/scrape-activity";

interface DailyScrapeChartProps {
  data: DailyScrapePoint[];
}

export function DailyScrapeChart({ data }: DailyScrapeChartProps) {
  const total = data.reduce((sum, point) => sum + point.count, 0);
  const average = data.length > 0 ? Math.round(total / data.length) : 0;

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-6 text-[13px]">
        <div>
          <span className="text-label">30-day total</span>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">{total.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-label">Daily average</span>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">{average.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: "#FAFAFA" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as DailyScrapePoint;
                return (
                  <div className="rounded-[10px] border border-border bg-white px-3 py-2 shadow-card">
                    <p className="text-[12px] text-muted-foreground">{point.date}</p>
                    <p className="font-mono text-[13px] font-medium tabular-nums">
                      {point.count.toLocaleString()} vehicles
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
