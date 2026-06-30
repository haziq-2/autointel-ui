"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AiInsightFeedItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IntelligenceInsightsFeed({
  insights,
  title = "AI Insights",
  className,
  live = true,
}: {
  insights: AiInsightFeedItem[];
  title?: string;
  className?: string;
  live?: boolean;
}) {
  const [items, setItems] = useState(insights);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
      setItems((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push({ ...first, id: `${first.id}-${Date.now()}`, timestamp: "Just now" });
        return next;
      });
    }, 14000);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div className={cn("rounded-2xl border border-border bg-white p-5 shadow-card", className)}>
      <div className="flex items-center gap-2">
        <Sparkles className={cn("h-4 w-4 text-[#2563eb]", pulse && "animate-pulse")} />
        <h3 className="text-[14px] font-semibold">{title}</h3>
        {live && (
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#16a34a]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#16a34a]" />
            Live
          </span>
        )}
      </div>
      <div className="mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border bg-[#fafafa] p-3.5 transition-shadow hover:shadow-sm"
            >
              <p className="text-[13px] leading-relaxed">{item.text}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {item.category}
                </span>
                <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                <span className="ml-auto font-mono text-[10px] font-semibold tabular-nums text-[#2563eb]">
                  {item.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
