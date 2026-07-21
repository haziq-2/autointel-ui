"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Store, Sparkles, TrendingUp, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { AlertsDashboardStats } from "@/lib/types";

export function AlertsInsightsSidebar({ stats }: { stats: AlertsDashboardStats }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="text-[13px] font-semibold">Today&apos;s Alerts</h3>
        <div className="mt-4 space-y-3">
          <StatRow label="Total" value={stats.todayTotal} />
          <StatRow label="High Priority" value={stats.highPriority} highlight />
          <StatRow label="Price Drops" value={stats.priceDrops} />
          <StatRow label="New Listings" value={stats.newListings} />
          <StatRow label="Negotiation" value={stats.negotiation} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-[13px] font-semibold">AI Recommendation</h3>
        </div>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Buy now</p>
        <Link
          href={`/vehicles/${stats.topOpportunity.vehicleId}`}
          className="mt-1 block text-[15px] font-semibold hover:text-primary hover:underline"
        >
          {stats.topOpportunity.title}
        </Link>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-white px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">Projected ROI</p>
            <p className="font-mono text-[14px] font-semibold tabular-nums text-[#16a34a]">
              {stats.topOpportunity.roi}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">Confidence</p>
            <p className="font-mono text-[14px] font-semibold tabular-nums">{stats.topOpportunity.confidence}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="text-[13px] font-semibold">Quick Insights</h3>
        <ul className="mt-3 space-y-3">
          <InsightItem
            icon={TrendingUp}
            label="Highest ROI"
            value={`${stats.highestRoi.roi}%`}
            sub={stats.highestRoi.title}
            href={`/vehicles/${stats.highestRoi.vehicleId}`}
          />
          <InsightItem
            icon={Store}
            label="Most Active Marketplace"
            value={stats.mostActiveMarketplace}
          />
          <InsightItem
            icon={MapPin}
            label="Highest Demand City"
            value={stats.highestDemandCity}
            href="/vehicles"
          />
          <InsightItem
            icon={BarChart3}
            label="Top Opportunity"
            value={formatCurrency(5400)}
            sub="Expected profit"
            href={`/vehicles/${stats.topOpportunity.vehicleId}`}
          />
        </ul>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span
        className={`font-mono text-[13px] font-semibold tabular-nums ${highlight ? "text-[#dc2626]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function InsightItem({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc]">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="truncate text-[12px] font-semibold">{value}</p>
        {sub && <p className="truncate text-[11px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <motion.li whileHover={{ x: 2 }}>
        <Link href={href} className="block rounded-lg p-1 transition-colors hover:bg-surface">
          {content}
        </Link>
      </motion.li>
    );
  }

  return <li>{content}</li>;
}
