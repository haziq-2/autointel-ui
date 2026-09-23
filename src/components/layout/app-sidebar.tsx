"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/lib/constants";
import { useLiveMonitoring } from "@/lib/scraping/live-monitoring-store";

export function AppSidebar() {
  const pathname = usePathname();
  const { active: liveMonitoring } = useLiveMonitoring();

  return (
    <aside className="flex h-full w-[236px] flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="bg-gradient-primary flex h-7 w-7 items-center justify-center rounded-[9px] text-[13px] font-bold text-white shadow-card">
          T
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
          Trip<span className="text-primary">AI</span>
        </span>
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-3 pb-6 pt-2">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.label ?? `section-${idx}`}>
            {section.label && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                const showLive = liveMonitoring && item.href === "/scrapers";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-[10px] px-3 py-[7px] text-[13.5px] transition-colors duration-150",
                      isActive
                        ? "bg-card font-medium text-foreground shadow-card"
                        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[16px] w-[16px] shrink-0 stroke-[1.75] transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {showLive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-1.5 py-px text-[10px] font-medium text-primary">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                        Live
                      </span>
                    ) : (
                      item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums",
                            isActive
                              ? "bg-primary-soft text-primary"
                              : "bg-[var(--tint-neutral-bg)] text-muted-foreground"
                          )}
                        >
                          {item.badge.replace(" active", "")}
                        </span>
                      )
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
