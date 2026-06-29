"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/lib/constants";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[200px] flex-col border-r border-border bg-[#fafafa]">
      <div className="flex h-12 items-center px-4">
        <span className="text-[13px] font-semibold tracking-[-0.02em] text-foreground">AutoIntel</span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.label ?? `section-${idx}`}>
            {section.label && (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
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

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-all duration-150",
                      isActive
                        ? "bg-white font-medium text-foreground shadow-card"
                        : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#2563eb]" />
                    )}
                    <Icon
                      className={cn(
                        "h-[15px] w-[15px] shrink-0 stroke-[1.75] transition-colors",
                        isActive ? "text-[#2563eb]" : "text-[#9ca3af] group-hover:text-muted-foreground"
                      )}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <span className="rounded bg-[#f4f4f5] px-1.5 py-px font-mono text-[10px] text-muted-foreground">
                        {item.badge.replace(" active", "")}
                      </span>
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
