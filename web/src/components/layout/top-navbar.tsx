"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationCenter } from "@/components/intelligence/notification-center";
import { Menu, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_SECTIONS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <Sheet>
        <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 lg:hidden")}>
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="bg-gradient-primary flex h-6 w-6 items-center justify-center rounded-[7px] text-[13px] font-bold text-white shadow-card">
              T
            </span>
            <p className="text-[14px] font-semibold tracking-[-0.02em]">
              Trip<span className="text-primary">AI</span>
            </p>
          </div>
          <nav className="space-y-4 overflow-y-auto p-3">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={section.label ?? `m-${idx}`}>
                {section.label && (
                  <p className="mb-1 px-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </p>
                )}
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-2.5 py-1.5 text-[13px] transition-colors",
                      pathname.startsWith(item.href) || (item.href === "/" && pathname === "/")
                        ? "bg-surface font-medium text-foreground"
                        : "text-muted-foreground hover:bg-surface"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="group relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search vehicles, sources, reports..."
          className="h-8 rounded-lg border-border/60 bg-surface pl-9 text-[13px] shadow-none transition-all focus-visible:border-primary/40 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/15"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-1.5 py-px font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden h-8 gap-1.5 text-[13px] text-muted-foreground sm:inline-flex")}
          >
            <Plus className="h-3.5 w-3.5" />
            Quick actions
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-[13px]">
            <DropdownMenuItem>
              <Link href="/scrapers/run-all" className="w-full">Run all scrapers</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/vehicles" className="w-full">Browse vehicles</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/reports" className="w-full">Generate report</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationCenter />

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full p-0.5 ring-1 ring-transparent transition-all hover:ring-border focus-visible:outline-none focus-visible:ring-primary/40">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-primary text-[11px] font-semibold text-white">JM</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-[13px]">
            <DropdownMenuLabel>James Mitchell</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
