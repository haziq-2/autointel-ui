"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { MetricsGrid } from "@/components/shared/metrics-grid";
import { getDemandForecast, getPageInsights } from "@/lib/mock-data/intelligence";

const SEGMENTS = ["Pickup Trucks", "Mid-size SUVs", "Sedans", "EVs"];

export default function DemandPage() {
  const forecast = getDemandForecast("Pickup Trucks");

  return (
    <div>
      <PageHeader title="Demand Forecast" description="Predictive demand by segment and region" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <MetricsGrid
            metrics={SEGMENTS.map((s) => ({
              label: s,
              value: `${getDemandForecast(s)[2].demand} index`,
              change: s.includes("Pickup") ? 18 : s.includes("SUV") ? 8 : s.includes("EV") ? 12 : -6,
            }))}
          />

          <section>
            <SectionTitle>Pickup truck forecast — Southwest</SectionTitle>
            <div className="h-[240px] rounded-md border border-border p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip />
                  <Line type="monotone" dataKey="high" stroke="#E5E7EB" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="demand" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="low" stroke="#E5E7EB" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-[13px] text-muted-foreground">
              90-day outlook shows pickup demand index rising to 90 with confidence band 80–98. Inventory shortage expected in Q3.
            </p>
          </section>

          <section>
            <SectionTitle>Forecast signals</SectionTitle>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              <li>· Expected inventory shortage: Pickup trucks, Southwest, 90 days</li>
              <li>· Expected price increase: EVs, +4.2% over 6 months</li>
              <li>· Expected slowdown: Sedans, Southeast, Q4 seasonal dip</li>
            </ul>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("demand")} />
      </div>
    </div>
  );
}
