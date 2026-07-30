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
    <aside className="flex h-full w-[220px] flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-12 items-center gap-2.5 px-4">
        <span className="bg-gradient-primary flex h-6 w-6 items-center justify-center rounded-[7px] text-[13px] font-bold text-white shadow-card">
          T
        </span>
        <span className="text-[14px] font-semibold tracking-[-0.02em] text-foreground">
          Trip<span className="text-primary">AI</span>
        </span>
      </div>

      <div className="mx-3 mb-2 h-px bg-sidebar-border" />

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.label ?? `section-${idx}`}>
            {section.label && (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80">
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
                      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-all duration-150",
                      isActive
                        ? "bg-primary-soft font-medium text-primary shadow-card"
                        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <Icon
                      className={cn(
                        "h-[15px] w-[15px] shrink-0 stroke-[1.75] transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {showLive ? (
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-px font-mono text-[10px] text-primary">
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
                            "rounded px-1.5 py-px font-mono text-[10px]",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "bg-accent text-muted-foreground"
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
