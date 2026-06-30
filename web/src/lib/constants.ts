import {
  LayoutDashboard,
  Radar,
  Car,
  Bookmark,
  Sparkles,
  FileText,
  Database,
  TrendingUp,
  LineChart,
  Bell,
  DollarSign,
  Map,
} from "lucide-react";
import type { NavSection } from "@/lib/types";

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ title: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Data",
    items: [
      { title: "Data Sources", href: "/data-sources", icon: Database },
      { title: "Data Collection", href: "/scrapers", icon: Radar, badge: "2 active" },
      { title: "Vehicles", href: "/vehicles", icon: Car },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Market Intel", href: "/market-intelligence", icon: TrendingUp },
      { title: "AI Pricing", href: "/pricing-intelligence", icon: DollarSign },
      { title: "Regional Intel", href: "/regional-intelligence", icon: Map },
      { title: "Acquisition", href: "/opportunities", icon: Bookmark, badge: "24" },
      { title: "Demand Intel", href: "/demand", icon: LineChart },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "AI Assistant", href: "/ai-analysis", icon: Sparkles },
      { title: "Alerts", href: "/alerts", icon: Bell },
      { title: "Reports", href: "/reports", icon: FileText },
    ],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

export const ORGANIZATIONS = [
  { id: "1", name: "Premier Auto Group", plan: "Professional" },
  { id: "2", name: "Southwest Acquisitions", plan: "Team" },
];

export const MARKETPLACES = [
  "Facebook Marketplace",
  "Craigslist",
  "AutoTrader",
];
