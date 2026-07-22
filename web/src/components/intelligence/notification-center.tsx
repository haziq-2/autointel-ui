"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PURCHASE_ALERTS } from "@/lib/mock-data/ai-intelligence";
import { formatCurrency } from "@/lib/format";

export function NotificationCenter() {
  const unread = PURCHASE_ALERTS.filter((a) => !a.read).length;

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative h-8 w-8 text-muted-foreground"
        )}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-medium text-white">
            {unread}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[15px]">
            <Sparkles className="h-4 w-4 text-primary" />
            Purchase Alerts
          </SheetTitle>
        </SheetHeader>
        <div className="mt-2 flex items-center justify-between border-b border-border pb-3">
          <p className="text-[12px] text-muted-foreground">{unread} unread opportunities</p>
          <div className="flex items-center gap-3">
            <Link
              href="/alerts"
              className="text-[12px] font-medium text-primary hover:underline"
            >
              View all
            </Link>
            <Link
              href="/alerts/rules"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
            >
              <Settings className="h-3 w-3" />
              Rules
            </Link>
          </div>
        </div>
        <div className="mt-4 space-y-3 overflow-y-auto pr-1">
          <AnimatePresence>
            {PURCHASE_ALERTS.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/vehicles/${alert.vehicleId}`}
                  className={cn(
                    "block rounded-xl border p-4 transition-colors hover:bg-surface",
                    alert.read ? "border-border bg-card" : "border-primary/30 bg-primary-soft/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      New High Value Opportunity
                    </p>
                    {!alert.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-foreground">{alert.title}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                    <div className="rounded-lg bg-card/80 px-2.5 py-2">
                      <p className="text-muted-foreground">Opportunity Score</p>
                      <p className="font-mono font-semibold tabular-nums">{alert.opportunityScore}</p>
                    </div>
                    <div className="rounded-lg bg-card/80 px-2.5 py-2">
                      <p className="text-muted-foreground">Expected Profit</p>
                      <p className="font-mono font-semibold tabular-nums text-[var(--tint-success-fg)]">
                        {formatCurrency(alert.expectedProfit)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] text-muted-foreground">
                    {alert.location} · Posted {alert.postedAgo}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
