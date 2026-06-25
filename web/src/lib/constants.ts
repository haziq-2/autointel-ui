import {
  LayoutDashboard,
  Radar,
  Car,
  Bookmark,
  Sparkles,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Scrapers", href: "/scrapers", icon: Radar, badge: "2 active" },
  { title: "Vehicles", href: "/vehicles", icon: Car },
  { title: "Saved Opportunities", href: "/opportunities", icon: Bookmark, badge: "24" },
  { title: "AI Analysis", href: "/ai-analysis", icon: Sparkles },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
];

export const ORGANIZATIONS = [
  { id: "1", name: "Premier Auto Group", plan: "Professional" },
  { id: "2", name: "Southwest Acquisitions", plan: "Team" },
];

export const MARKETPLACES = [
  "Facebook Marketplace",
  "Craigslist",
  "AutoTrader",
  "Cars.com",
  "CarGurus",
  "Dealer Websites",
];
