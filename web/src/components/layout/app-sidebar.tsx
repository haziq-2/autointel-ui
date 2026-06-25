"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[200px] flex-col border-r border-border bg-[#fafafa]">
      <div className="flex h-12 items-center px-4">
        <span className="text-[13px] font-semibold tracking-tight text-foreground">AutoIntel</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {NAV_ITEMS.map((item) => {
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
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                isActive
                  ? "bg-white font-medium text-foreground shadow-[0_0_0_1px_#e5e7eb]"
                  : "text-muted-foreground hover:bg-white/80 hover:text-foreground"
              )}
            >
              <Icon className="h-[15px] w-[15px] shrink-0 stroke-[1.75]" />
              <span className="flex-1 truncate">{item.title}</span>
              {item.badge && (
                <span className="font-mono text-[10px] text-muted-foreground">{item.badge.replace(" active", "")}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
