import {
  LayoutDashboard,
  Radar,
  Car,
  Sparkles,
  FileText,
  Bell,
  ScanSearch,
} from "lucide-react";
import type { NavSection } from "@/lib/types";

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ title: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Data",
    items: [
      { title: "Data Collection", href: "/scrapers", icon: Radar, badge: "2 active" },
      { title: "Vehicles", href: "/vehicles", icon: Car },
      { title: "VIN Decoder", href: "/vin-decoder", icon: ScanSearch },
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
