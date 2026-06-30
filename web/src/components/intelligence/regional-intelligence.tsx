"use client";

import { motion } from "framer-motion";

export { USDemandMap as RegionalUSMap } from "@/components/intelligence/dashboard/us-demand-map";

export function TrendBarChart({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <h4 className="text-[13px] font-semibold">{title}</h4>
      <div className="mt-4 space-y-3">
        {data.map((d, i) => (
          <div key={d.name}>
            <div className="mb-1 flex justify-between text-[12px]">
              <span>{d.name}</span>
              <span className="font-mono tabular-nums">{d.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#f4f4f5]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="h-full rounded-full bg-[#2563eb]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
