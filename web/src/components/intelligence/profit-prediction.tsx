"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProfitAnalysis } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const COST_COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];
const DONUT_COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#e5e7eb"];

export function ProfitPredictionCard({ analysis }: { analysis: ProfitAnalysis }) {
  const costs = analysis.costBreakdown ?? [
    { name: "Transport", value: analysis.transportation },
    { name: "Recon", value: analysis.reconditioning },
    { name: "Holding", value: analysis.holdingCost },
  ];

  const waterfallDisplay = analysis.waterfall.filter((w) => w.label !== "Sale");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-white p-6 shadow-card"
    >
      <h3 className="text-section-title">AI Profit Analysis</h3>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: "Purchase", value: analysis.purchasePrice },
          { label: "Transport", value: analysis.transportation },
          { label: "Recon", value: analysis.reconditioning },
          { label: "Holding", value: analysis.holdingCost },
          { label: "Sell Price", value: analysis.expectedSellingPrice },
          { label: "Net Profit", value: analysis.netProfit, highlight: true },
          { label: "ROI", value: `${analysis.roi}%`, highlight: true },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-[#fafafa] p-3">
            <p className="text-[11px] text-muted-foreground">{k.label}</p>
            <p
              className={`mt-1 font-mono text-[14px] font-semibold tabular-nums ${
                k.highlight ? "text-[#16a34a]" : ""
              }`}
            >
              {typeof k.value === "number" ? formatCurrency(k.value) : k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[13px] font-medium">Profit waterfall</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallDisplay} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(Math.abs(Number(v)))} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {waterfallDisplay.map((entry) => (
                    <Cell
                      key={entry.label}
                      fill={entry.type === "total" ? "#16a34a" : entry.type === "revenue" ? "#2563eb" : "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[13px] font-medium">Cost breakdown</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costs} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {costs.map((_, i) => (
                    <Cell key={_.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
