"use client";

import { motion } from "framer-motion";
import { Handshake, Target, TrendingUp, Gauge, AlertCircle } from "lucide-react";
import type { NegotiationIntel } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { AiExplanationCard } from "./opportunity-score-card";

export function NegotiationIntelligence({ intel }: { intel: NegotiationIntel }) {
  const kpis = [
    { icon: Handshake, label: "First Offer", value: formatCurrency(intel.firstOffer) },
    { icon: Target, label: "Target Price", value: formatCurrency(intel.targetPurchasePrice) },
    { icon: TrendingUp, label: "Acceptance Probability", value: `${intel.acceptanceProbability}%` },
    { icon: Target, label: "Maximum Offer", value: formatCurrency(intel.maxOffer) },
    { icon: Gauge, label: "Seller Motivation", value: intel.sellerMotivation },
    { icon: AlertCircle, label: "Difficulty", value: intel.difficulty },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-white p-6 shadow-card"
      >
        <h3 className="text-section-title">Negotiation Intelligence</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-[#fafafa] p-4"
            >
              <k.icon className="h-4 w-4 text-[#2563eb]" />
              <p className="mt-2 text-[11px] text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums">{k.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <AiExplanationCard bullets={intel.reasoningBullets} title="AI negotiation reasoning" />
    </div>
  );
}
