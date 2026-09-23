import type { AlertCategory, AlertType } from "@/lib/types";
import {
  AlertTriangle,
  Bell,
  Bookmark,
  LineChart,
  Sparkles,
  Tag,
  TrendingDown,
} from "lucide-react";

export const ALERT_CATEGORIES: {
  id: AlertCategory;
  label: string;
  icon: typeof Bell;
  color: string;
  bg: string;
}[] = [
  { id: "all", label: "All Alerts", icon: Bell, color: "text-primary", bg: "bg-primary-soft" },
  { id: "price_drop", label: "Price Drops", icon: TrendingDown, color: "text-primary", bg: "bg-primary-soft" },
  { id: "new_listing", label: "New Listings", icon: Sparkles, color: "text-[var(--chart-6)]", bg: "bg-[var(--tint-info-bg)]" },
  { id: "market_intel", label: "Market Alerts", icon: LineChart, color: "text-[var(--chart-2)]", bg: "bg-[var(--tint-info-bg)]" },
  { id: "risk", label: "Risk Alerts", icon: AlertTriangle, color: "text-[var(--tint-danger-fg)]", bg: "bg-[var(--tint-danger-bg)]" },
  { id: "watchlist", label: "Watchlist", icon: Bookmark, color: "text-[var(--chart-1)]", bg: "bg-[var(--tint-info-bg)]" },
  { id: "system", label: "System", icon: Tag, color: "text-muted-foreground", bg: "bg-[var(--tint-neutral-bg)]" },
];

export const ALERT_TYPE_STYLES: Record<
  AlertType,
  { badge: string; badgeClass: string; accent: string }
> = {
  high_value_opportunity: {
    badge: "ALERT",
    badgeClass: "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)]",
    accent: "var(--chart-8)",
  },
  underpriced: {
    badge: "UNDER MARKET VALUE",
    badgeClass: "bg-[var(--tint-success-bg)] text-[var(--tint-success-fg)]",
    accent: "var(--success)",
  },
  price_drop: {
    badge: "PRICE DROP",
    badgeClass: "bg-[var(--tint-info-bg)] text-[var(--tint-info-fg)]",
    accent: "var(--primary)",
  },
  new_match: {
    badge: "NEW MATCH",
    badgeClass: "bg-[var(--tint-info-bg)] text-[var(--chart-6)]",
    accent: "var(--chart-6)",
  },
  high_roi: {
    badge: "ALERT",
    badgeClass: "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)]",
    accent: "var(--chart-8)",
  },
  negotiation: {
    badge: "NEGOTIATION",
    badgeClass: "bg-[var(--tint-warning-bg)] text-[var(--tint-warning-fg)]",
    accent: "var(--warning)",
  },
  market_intel: {
    badge: "MARKET ALERT",
    badgeClass: "bg-[var(--tint-info-bg)] text-[var(--chart-2)]",
    accent: "var(--chart-2)",
  },
  risk: {
    badge: "RISK ALERT",
    badgeClass: "bg-[var(--tint-danger-bg)] text-[var(--tint-danger-fg)]",
    accent: "var(--destructive)",
  },
  watchlist: {
    badge: "WATCHLIST",
    badgeClass: "bg-[var(--tint-info-bg)] text-[var(--tint-info-fg)]",
    accent: "var(--chart-1)",
  },
  system: {
    badge: "SYSTEM",
    badgeClass: "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)]",
    accent: "var(--chart-8)",
  },
};

export const PRIORITY_STYLES = {
  critical: "bg-[var(--tint-danger-bg)] text-[var(--tint-danger-fg)] border-transparent",
  high: "bg-[var(--tint-warning-bg)] text-[var(--tint-warning-fg)] border-transparent",
  medium: "bg-[var(--tint-warning-bg)] text-[var(--tint-warning-fg)] border-transparent",
  low: "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)] border-transparent",
};

export const TYPE_FILTER_OPTIONS: { value: AlertType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "underpriced", label: "Underpriced" },
  { value: "price_drop", label: "Price drop" },
  { value: "new_match", label: "New match" },
  { value: "market_intel", label: "Market alert" },
  { value: "risk", label: "Risk" },
  { value: "watchlist", label: "Watchlist" },
  { value: "system", label: "System" },
];

/** Alert types removed from the UI (AI / opportunity-scoring). */
export const HIDDEN_ALERT_TYPES: AlertType[] = [
  "high_value_opportunity",
  "high_roi",
  "negotiation",
];
