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
  /** Optional catalog total; defaults to sum of chart points */
  totalOverride?: number;
}

export function DailyScrapeChart({ data, totalOverride }: DailyScrapeChartProps) {
  const thirtyDayTotal =
    totalOverride ?? data.reduce((sum, point) => sum + point.count, 0);

  // Past-week average over days that actually had scrapes
  const pastWeek = data.slice(-7);
  const activeWeekDays = pastWeek.filter((d) => d.count > 0);
  const dailyAverage =
    activeWeekDays.length > 0
      ? Math.round(
          activeWeekDays.reduce((sum, point) => sum + point.count, 0) /
            activeWeekDays.length
        )
      : 0;

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-6 text-[13px]">
        <div>
          <span className="text-label">30-day total</span>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
            {thirtyDayTotal.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-label">Daily average</span>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
            {dailyAverage.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">past week</p>
        </div>
      </div>

      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyScrapeBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: "var(--chart-cursor)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as DailyScrapePoint;
                return (
                  <div className="rounded-xl bg-popover px-3 py-2 shadow-popover ring-1 ring-border">
                    <p className="text-[12px] text-muted-foreground">{point.date}</p>
                    <p className="font-mono text-[13px] font-medium tabular-nums text-foreground">
                      {point.count.toLocaleString()} vehicles
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill="url(#dailyScrapeBar)" radius={[5, 5, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
