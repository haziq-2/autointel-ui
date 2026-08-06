"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface NamedCount {
  name: string;
  count: number;
}

/** Approximate brand colors for common makes */
const BRAND_COLORS: Record<string, string> = {
  Ford: "#003478",
  Toyota: "#EB0A1E",
  Honda: "#CC0000",
  Chevrolet: "#D4A017",
  Chevy: "#D4A017",
  Ram: "#C8102E",
  Dodge: "#C8102E",
  Tesla: "#CC0000",
  BMW: "#1C69D4",
  Jeep: "#3D5B33",
  Nissan: "#C3002F",
  Hyundai: "#002C5F",
  GMC: "#C8102E",
  Subaru: "#013C74",
  Mazda: "#101010",
  Kia: "#05141F",
  "Mercedes-Benz": "#333333",
  Mercedes: "#333333",
  Audi: "#BB0A30",
  Lexus: "#1A1A1A",
  Volkswagen: "#1A1A1A",
  VW: "#1A1A1A",
  Volvo: "#1B365D",
  Cadillac: "#A3996E",
  Buick: "#C8102E",
  Chrysler: "#1A1A1A",
  Acura: "#C8102E",
  Infiniti: "#000000",
  Lincoln: "#1A1A1A",
  Mitsubishi: "#E60012",
  Porsche: "#000000",
  Jaguar: "#9E9E9E",
  "Land Rover": "#005A2B",
  Mini: "#000000",
  Fiat: "#AD172B",
  Genesis: "#1A1A1A",
  Polaris: "#003DA5",
  Yamaha: "#003399",
  Kawasaki: "#00A651",
  Suzuki: "#003399",
  "Harley-Davidson": "#F58220",
  Baja: "#E87722",
};

const FALLBACK_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#f43f5e",
  "#64748b",
  "#84cc16",
];

function colorForMake(name: string, index: number): string {
  return BRAND_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function TopMakesChart({
  data,
  yAxisWidth = 80,
}: {
  data: NamedCount[];
  yAxisWidth?: number;
}) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-helper">No make data</p>;
  }

  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={yAxisWidth}
            tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-cursor)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as NamedCount;
              const color = colorForMake(point.name, data.findIndex((d) => d.name === point.name));
              return (
                <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-popover">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <p className="text-[12px] font-medium text-foreground">{point.name}</p>
                  </div>
                  <p className="mt-0.5 font-mono text-[13px] tabular-nums text-muted-foreground">
                    {point.count.toLocaleString()} listings
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={18}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={colorForMake(entry.name, i)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
