"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface ShareSlice {
  name: string;
  count: number;
  share: number;
}

const DEFAULT_COLORS = [
  "var(--primary)",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#f43f5e",
  "#64748b",
];

export function ShareDonutChart({
  data,
  colors = DEFAULT_COLORS,
  emptyLabel = "No data",
}: {
  data: ShareSlice[];
  colors?: string[];
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-helper">{emptyLabel}</p>;
  }

  return (
    <div className="flex h-[220px] min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
      <div className="mx-auto h-[160px] w-[160px] shrink-0 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={46}
              outerRadius={70}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as ShareSlice;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-popover">
                    <p className="text-[12px] font-medium text-foreground">{point.name}</p>
                    <p className="font-mono text-[13px] tabular-nums text-muted-foreground">
                      {point.count.toLocaleString()} · {point.share}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="min-h-0 min-w-0 flex-1 space-y-2 overflow-y-auto">
        {data.map((slice, i) => (
          <li key={slice.name} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
              {slice.name}
            </span>
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {slice.count.toLocaleString()}
            </span>
            <span className="w-10 text-right font-mono text-[12px] font-medium tabular-nums text-foreground">
              {slice.share}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
