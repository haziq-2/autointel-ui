"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type QuickAction = {
  label: string;
  href: string;
  hint: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Browse vehicles", href: "/vehicles", hint: "Inventory" },
  { label: "Open alerts", href: "/alerts", hint: "High-priority signals" },
  { label: "Run all scrapers", href: "/scrapers/run-all", hint: "Data collection" },
  { label: "Generate reports", href: "/reports", hint: "Insights" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const items = useMemo(() => {
    const nav = NAV_ITEMS.map((item) => ({
      label: item.title,
      href: item.href,
      hint: "Navigate",
    }));
    return [...QUICK_ACTIONS, ...nav].filter(
      (item, i, arr) => arr.findIndex((x) => x.href === item.href) === i
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="border-b border-border/70 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, actions, and tools..."
              className="h-10 rounded-xl border-border/70 bg-card pl-9"
            />
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for "{query}".
            </p>
          ) : (
            filtered.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors",
                    active
                      ? "bg-primary-soft text-primary"
                      : "hover:bg-surface-hover text-foreground"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.hint}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </Link>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
