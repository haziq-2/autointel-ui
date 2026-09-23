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

export interface AgeBucket {
  label: string;
  count: number;
}

export function ListingAgeChart({ data }: { data: AgeBucket[] }) {
  const total = data.reduce((sum, b) => sum + b.count, 0);

  if (total === 0) {
    return <p className="py-8 text-center text-helper">No listing-age data</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-6 text-[13px]">
        <div>
          <span className="text-label">Active listings</span>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="listingAgeBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              axisLine={false}
              tickLine={false}
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
                const point = payload[0].payload as AgeBucket;
                const share = total > 0 ? Math.round((point.count / total) * 100) : 0;
                return (
                  <div className="rounded-xl bg-popover px-3 py-2 shadow-popover ring-1 ring-border">
                    <p className="text-[12px] font-medium text-foreground">{point.label}</p>
                    <p className="font-mono text-[13px] tabular-nums text-muted-foreground">
                      {point.count.toLocaleString()} listings · {share}%
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="count"
              fill="url(#listingAgeBar)"
              radius={[5, 5, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
