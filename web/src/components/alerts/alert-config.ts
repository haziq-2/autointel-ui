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
  { id: "all", label: "All Alerts", icon: Bell, color: "text-primary", bg: "bg-[#eff6ff]" },
  { id: "price_drop", label: "Price Drops", icon: TrendingDown, color: "text-primary", bg: "bg-blue-50" },
  { id: "new_listing", label: "New Listings", icon: Sparkles, color: "text-[#7c3aed]", bg: "bg-violet-50" },
  { id: "market_intel", label: "Market Alerts", icon: LineChart, color: "text-[#0891b2]", bg: "bg-cyan-50" },
  { id: "risk", label: "Risk Alerts", icon: AlertTriangle, color: "text-[#dc2626]", bg: "bg-red-50" },
  { id: "watchlist", label: "Watchlist", icon: Bookmark, color: "text-[#6366f1]", bg: "bg-indigo-50" },
  { id: "system", label: "System", icon: Tag, color: "text-[#64748b]", bg: "bg-slate-50" },
];

export const ALERT_TYPE_STYLES: Record<
  AlertType,
  { badge: string; badgeClass: string; accent: string }
> = {
  high_value_opportunity: {
    badge: "ALERT",
    badgeClass: "bg-slate-600 text-white",
    accent: "#64748b",
  },
  underpriced: {
    badge: "UNDER MARKET VALUE",
    badgeClass: "bg-emerald-600 text-white",
    accent: "#16a34a",
  },
  price_drop: {
    badge: "PRICE DROP",
    badgeClass: "bg-blue-600 text-white",
    accent: "#2563eb",
  },
  new_match: {
    badge: "NEW MATCH",
    badgeClass: "bg-violet-600 text-white",
    accent: "#7c3aed",
  },
  high_roi: {
    badge: "ALERT",
    badgeClass: "bg-slate-600 text-white",
    accent: "#64748b",
  },
  negotiation: {
    badge: "NEGOTIATION",
    badgeClass: "bg-orange-500 text-white",
    accent: "#ea580c",
  },
  market_intel: {
    badge: "MARKET ALERT",
    badgeClass: "bg-cyan-600 text-white",
    accent: "#0891b2",
  },
  risk: {
    badge: "RISK ALERT",
    badgeClass: "bg-red-700 text-white",
    accent: "#b91c1c",
  },
  watchlist: {
    badge: "WATCHLIST",
    badgeClass: "bg-indigo-600 text-white",
    accent: "#6366f1",
  },
  system: {
    badge: "SYSTEM",
    badgeClass: "bg-slate-600 text-white",
    accent: "#64748b",
  },
};

export const PRIORITY_STYLES = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
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
