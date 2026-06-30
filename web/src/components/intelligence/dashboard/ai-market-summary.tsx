"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiMarketSummaryProps {
  title?: string;
  bullets: string[];
  confidence: number;
  timestamp: string;
  className?: string;
  collapsible?: boolean;
  previewCount?: number;
}

export function AiMarketSummary({
  title = "Today's Market Summary",
  bullets,
  confidence,
  timestamp,
  className,
  collapsible = true,
  previewCount = 3,
}: AiMarketSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleBullets = collapsible && !expanded ? bullets.slice(0, previewCount) : bullets;
  const hasMore = collapsible && bullets.length > previewCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#2563eb]/20 bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4] p-6 shadow-card transition-shadow hover:shadow-[0_4px_20px_rgba(37,99,235,0.08)]",
        className
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2563eb]/5 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2563eb] shadow-lg shadow-[#2563eb]/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[16px] font-semibold tracking-tight">{title}</h3>
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-[#2563eb]">
              {confidence}% confidence
            </span>
            <span className="text-[11px] text-muted-foreground">{timestamp}</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            <AnimatePresence mode="popLayout">
              {visibleBullets.map((b) => (
                <motion.li
                  key={b}
                  layout
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5 text-[14px] leading-relaxed text-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                  {b}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[#2563eb] transition-colors hover:text-[#1d4ed8]"
            >
              {expanded ? "Show less" : `Show ${bullets.length - previewCount} more insights`}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
