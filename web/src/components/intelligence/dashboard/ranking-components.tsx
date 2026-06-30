"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function SupplyDemandBars({
  items,
}: {
  items: { name: string; supply: number; demand: number; verdict: string }[];
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl border border-border bg-[#fafafa] p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold">{item.name}</span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                item.verdict.includes("Excellent")
                  ? "bg-emerald-50 text-emerald-700"
                  : item.verdict.includes("Strong") || item.verdict.includes("Favorable")
                    ? "bg-blue-50 text-blue-700"
                    : item.verdict.includes("Oversupplied")
                      ? "bg-red-50 text-red-700"
                      : "bg-slate-100 text-slate-600"
              )}
            >
              {item.verdict}
            </span>
          </div>
          <div className="space-y-2">
            <BarRow label="Supply" value={item.supply} color="#94a3b8" />
            <BarRow label="Demand" value={item.demand} color="#2563eb" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BarRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function RankingList({
  title,
  items,
}: {
  title: string;
  items: { name: string; score: number; growth: number }[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <h4 className="text-[13px] font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li
            key={item.name}
            className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 transition-colors hover:bg-[#fafafa]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#eff6ff] font-mono text-[11px] font-bold text-[#2563eb]">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{item.name}</span>
            <span className="font-mono text-[13px] font-semibold tabular-nums">{item.score}</span>
            <TrendArrow value={item.growth} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendArrow({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-[#16a34a]">
        <ArrowUp className="h-3 w-3" />
        {value}%
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-[#dc2626]">
        <ArrowDown className="h-3 w-3" />
        {Math.abs(value)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground">
      <Minus className="h-3 w-3" />
      0%
    </span>
  );
}

export function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-[14px] tracking-wider text-amber-400">
      {"★".repeat(stars)}
      <span className="text-[#e5e7eb]">{"★".repeat(5 - stars)}</span>
    </span>
  );
}

export function OpportunityCards({
  items,
}: {
  items: {
    segment: string;
    demandChange: number;
    inventoryChange: number;
    projectedMargin: number;
    confidence: number;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.segment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-2xl border border-[#2563eb]/20 bg-gradient-to-br from-white to-[#eff6ff]/30 p-5 shadow-card"
        >
          <h4 className="text-[14px] font-semibold">{item.segment}</h4>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricTile label="Demand" value={`+${item.demandChange}%`} positive />
            <MetricTile
              label="Inventory"
              value={`${item.inventoryChange > 0 ? "+" : ""}${item.inventoryChange}%`}
              positive={item.inventoryChange < 0}
            />
            <MetricTile label="Projected Margin" value={`$${item.projectedMargin.toLocaleString()}`} />
            <MetricTile label="Confidence" value={`${item.confidence}%`} accent />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MetricTile({
  label,
  value,
  positive,
  accent,
}: {
  label: string;
  value: string;
  positive?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/80 px-2.5 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-mono text-[13px] font-semibold tabular-nums",
          positive && "text-[#16a34a]",
          accent && "text-[#2563eb]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
