import {
  LayoutDashboard,
  Radar,
  Car,
  Bookmark,
  Sparkles,
  FileText,
  Database,
  Warehouse,
  TrendingUp,
  DollarSign,
  LineChart,
  Target,
  Truck,
  Users,
  Globe,
  Bell,
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
      { title: "Scrapers", href: "/scrapers", icon: Radar, badge: "2 active" },
      { title: "Vehicles", href: "/vehicles", icon: Car },
      { title: "Inventory", href: "/inventory", icon: Warehouse },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Market Intel", href: "/market-intelligence", icon: TrendingUp },
      { title: "Pricing", href: "/pricing", icon: DollarSign },
      { title: "Acquisition", href: "/opportunities", icon: Bookmark, badge: "24" },
      { title: "Demand", href: "/demand", icon: LineChart },
      { title: "Competitive", href: "/competitive", icon: Target },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Fleet", href: "/fleet", icon: Truck },
      { title: "Sellers", href: "/sellers", icon: Users },
      { title: "Marketplaces", href: "/marketplaces", icon: Globe },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "AI Copilot", href: "/ai-analysis", icon: Sparkles },
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
