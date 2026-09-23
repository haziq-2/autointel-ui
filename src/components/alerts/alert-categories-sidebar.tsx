"use client";

import { cn } from "@/lib/utils";
import type { AlertCategory } from "@/lib/types";
import { ALERT_CATEGORIES } from "./alert-config";

interface AlertCategoriesSidebarProps {
  active: AlertCategory;
  counts: Record<AlertCategory, number>;
  onSelect: (category: AlertCategory) => void;
}

export function AlertCategoriesSidebar({
  active,
  counts,
  onSelect,
}: AlertCategoriesSidebarProps) {
  return (
    <nav className="space-y-1">
      {ALERT_CATEGORIES.map((cat) => {
        const count = counts[cat.id];
        const isActive = active === cat.id;
        const Icon = cat.icon;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
              isActive ? "bg-primary-soft" : "hover:bg-surface"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                isActive ? cat.bg : "bg-surface group-hover:bg-surface-hover"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? cat.color : "text-muted-foreground")} />
            </div>
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px]",
                isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
              )}
            >
              {cat.label}
            </span>
            {count > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10.5px] font-semibold tabular-nums",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-[var(--tint-neutral-bg)] text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
