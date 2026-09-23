"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INTELLIGENCE_ALERTS } from "@/lib/mock-data/alerts";
import { HIDDEN_ALERT_TYPES, ALERT_TYPE_STYLES } from "@/components/alerts/alert-config";
import { formatCurrency } from "@/lib/format";

export function NotificationCenter() {
  const alerts = INTELLIGENCE_ALERTS.filter(
    (a) => !HIDDEN_ALERT_TYPES.includes(a.type) && a.vehicleId
  ).slice(0, 8);
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative h-9 w-9 text-muted-foreground"
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
            <Bell className="h-4 w-4 text-primary" />
            Alerts
          </SheetTitle>
        </SheetHeader>
        <div className="mt-2 flex items-center justify-between border-b border-border pb-3">
          <p className="text-[12px] text-muted-foreground">{unread} unread</p>
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
            {alerts.map((alert, i) => {
              const style = ALERT_TYPE_STYLES[alert.type];
              const price =
                typeof alert.data.currentPrice === "number"
                  ? alert.data.currentPrice
                  : typeof alert.data.price === "number"
                    ? alert.data.price
                    : null;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/vehicles/${alert.vehicleId}`}
                    className={cn(
                      "block rounded-xl p-4 ring-1 transition-colors hover:bg-surface",
                      alert.read ? "bg-card ring-border" : "bg-primary-soft/60 ring-primary/25"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {style.badge}
                      </p>
                      {!alert.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-2 text-[14px] font-semibold text-foreground">{alert.title}</p>
                    {price != null && (
                      <p className="text-metric mt-2 text-[14px]">
                        {formatCurrency(price)}
                      </p>
                    )}
                    <p className="mt-2 text-[12px] text-muted-foreground">
                      {[alert.location, alert.postedAgo].filter(Boolean).join(" · ")}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
