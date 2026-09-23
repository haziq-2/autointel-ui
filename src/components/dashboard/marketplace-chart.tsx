"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface MarketplaceSlice {
  name: string;
  count: number;
  share: number;
}

/** Distinct colors per known marketplace */
const MARKETPLACE_COLORS: Record<string, string> = {
  Craigslist: "#5B21B6",
  "Facebook Marketplace": "#1877F2",
  CarGurus: "#3DCD58",
};

const FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-8)",
];

function colorForMarketplace(name: string, index: number): string {
  return MARKETPLACE_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function MarketplaceChart({ data }: { data: MarketplaceSlice[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-helper">No marketplace data</p>;
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
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={colorForMarketplace(entry.name, i)} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as MarketplaceSlice;
                return (
                  <div className="rounded-xl bg-popover px-3 py-2 shadow-popover ring-1 ring-border">
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
              style={{ background: colorForMarketplace(slice.name, i) }}
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
