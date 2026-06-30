"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Tag,
  Wrench,
  Sparkles,
} from "lucide-react";
import { ScoreRing } from "./score-ring";
import { OpportunityLabelBadge } from "./opportunity-label-badge";
import type { VehicleOpportunityIntel } from "@/lib/types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const METRIC_ICONS = {
  profit: DollarSign,
  demand: TrendingUp,
  days: Clock,
  popularity: Star,
  price: Tag,
  repair: Wrench,
};

interface OpportunityScoreCardProps {
  intel: VehicleOpportunityIntel;
}

export function OpportunityScoreCard({ intel }: OpportunityScoreCardProps) {
  const radarData = [
    { metric: "Profit", value: intel.breakdown.estimatedProfit },
    { metric: "Demand", value: intel.breakdown.marketDemand },
    { metric: "Popularity", value: intel.breakdown.popularity },
    { metric: "Price", value: intel.breakdown.priceAttractiveness },
    { metric: "Repair", value: intel.breakdown.repairRiskScore },
  ];

  const metrics = [
    { key: "profit", label: "Estimated Profit", value: `${intel.breakdown.estimatedProfit}%`, desc: "Projected resale margin" },
    { key: "demand", label: "Market Demand", value: `${intel.breakdown.marketDemand}%`, desc: "Regional buyer interest" },
    { key: "days", label: "Days to Sell", value: String(intel.breakdown.daysToSell), desc: "Expected time on market" },
    { key: "popularity", label: "Vehicle Popularity", value: `${intel.breakdown.popularity}%`, desc: "Search & listing volume" },
    { key: "price", label: "Price Attractiveness", value: `${intel.breakdown.priceAttractiveness}%`, desc: "Vs comparable listings" },
    { key: "repair", label: "Repair Risk", value: intel.breakdown.repairRisk, desc: "Predicted maintenance exposure" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-white p-6 shadow-card"
    >
      <div className="flex items-center gap-2 text-label">
        <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" />
        Opportunity Score
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
        <ScoreRing score={intel.score} size={140} />
        <div className="text-center sm:text-left">
          <OpportunityLabelBadge label={intel.label} />
          <p className="mt-3 font-mono text-[13px] text-muted-foreground">
            {intel.confidence}% confidence
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {metrics.map((m, i) => {
            const Icon = METRIC_ICONS[m.key];
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-[#fafafa] p-3"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-[#2563eb]" />
                  <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
                </div>
                <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums">{m.value}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export function AiExplanationCard({ bullets, title = "Why this vehicle ranks highly" }: { bullets: string[]; title?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-[#fafafa] to-white p-6 shadow-card"
    >
      <h3 className="text-card-title">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-[13px] leading-relaxed text-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#2563eb]" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
