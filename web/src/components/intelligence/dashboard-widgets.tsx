"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, TrendingDown, MapPin, Clock, DollarSign } from "lucide-react";
import { getDashboardWidgets, getOpportunityLabel } from "@/lib/mock-data/ai-intelligence";
import { formatCurrency } from "@/lib/format";
import { OpportunityLabelBadge } from "./opportunity-label-badge";
import type { OpportunityLabel } from "@/lib/types";

type WidgetItem = {
  id: string;
  primary: string;
  secondary: string;
  value: string;
  href: string;
  badge?: OpportunityLabel;
};

export function DashboardIntelligenceWidgets() {
  const w = getDashboardWidgets();

  const sections: { title: string; icon: typeof Flame; items: WidgetItem[] }[] = [
    {
      title: "Top Opportunities",
      icon: Flame,
      items: w.topOpportunities.map((v) => ({
        id: v.id,
        primary: v.title,
        secondary: `Score ${v.opportunityScore}`,
        value: formatCurrency(v.marginPotential ?? 0),
        href: `/vehicles/${v.id}`,
      })),
    },
    {
      title: "Highest Expected ROI",
      icon: DollarSign,
      items: w.highestRoi.map((v) => ({
        id: v.id,
        primary: `${v.year} ${v.make} ${v.model}`,
        secondary: v.location,
        value: `+${Math.round(((v.marginPotential ?? 0) / v.price) * 100)}%`,
        href: `/vehicles/${v.id}`,
      })),
    },
    {
      title: "Most Undervalued",
      icon: TrendingDown,
      items: w.undervalued.map((v) => ({
        id: v.id,
        primary: v.title,
        secondary: "Below market",
        value: formatCurrency((v.fairMarketValue ?? v.price) - v.price),
        href: `/vehicles/${v.id}`,
      })),
    },
    {
      title: "Highest Demand Cities",
      icon: MapPin,
      items: w.topCities.map((c) => ({
        id: c.city,
        primary: `${c.city}, ${c.state}`,
        secondary: `${c.inventory} listings`,
        value: `Score ${c.demandScore}`,
        href: "/regional-intelligence",
      })),
    },
    {
      title: "Newest Listings",
      icon: Clock,
      items: w.newest.map((v) => ({
        id: v.id,
        primary: v.title,
        secondary: v.dateFound,
        value: formatCurrency(v.price),
        href: `/vehicles/${v.id}`,
      })),
    },
    {
      title: "Immediate Attention",
      icon: Flame,
      items: w.urgent.map((v) => ({
        id: v.id,
        primary: v.title,
        secondary: "High score",
        value: "",
        badge: getOpportunityLabel(v.opportunityScore),
        href: `/vehicles/${v.id}`,
      })),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.06 }}
          className="rounded-2xl border border-border bg-white shadow-card transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <section.icon className="h-4 w-4 text-[#2563eb]" />
            <h3 className="text-[13px] font-semibold">{section.title}</h3>
          </div>
          <ul className="divide-y divide-border">
            {section.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{item.primary}</p>
                    <p className="text-[11px] text-muted-foreground">{item.secondary}</p>
                    {item.badge && (
                      <div className="mt-1.5">
                        <OpportunityLabelBadge label={item.badge} className="text-[10px] px-2 py-0.5" />
                      </div>
                    )}
                  </div>
                  {item.value && (
                    <span className="font-mono text-[12px] font-semibold tabular-nums text-[#16a34a]">
                      {item.value}
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#9ca3af] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
