"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { AlertsAiSummary } from "@/lib/types";

export function AiSummaryBanner({ summary }: { summary: AlertsAiSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Today&apos;s AI Summary
          </p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-foreground">
            <li>
              <span className="font-mono font-semibold tabular-nums">{summary.vehiclesAnalyzed}</span> new
              vehicles analyzed.
            </li>
            <li>
              <span className="font-mono font-semibold tabular-nums text-[#16a34a]">
                {summary.highValueCount}
              </span>{" "}
              high-value opportunities identified.
            </li>
            <li>
              Average projected ROI increased by{" "}
              <span className="font-mono font-semibold tabular-nums text-[#16a34a]">
                {summary.roiIncrease}%
              </span>
              .
            </li>
            <li className="text-muted-foreground">{summary.marketInsight}</li>
            <li>
              <span className="font-mono font-semibold tabular-nums">{summary.priceDropsToday}</span> sellers
              reduced prices today.
            </li>
            <li className="pt-1">
              Highest confidence recommendation:{" "}
              <Link
                href={`/vehicles/${summary.topRecommendation.vehicleId}`}
                className="font-semibold text-primary hover:underline"
              >
                {summary.topRecommendation.title}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
