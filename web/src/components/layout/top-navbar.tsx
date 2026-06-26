"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
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
import { ORGANIZATIONS, NAV_SECTIONS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-border bg-white px-4 lg:px-6">
      <Sheet>
        <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 lg:hidden")}>
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[200px] p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-[13px] font-semibold">AutoIntel</p>
          </div>
          <nav className="space-y-3 overflow-y-auto p-2">
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
                    className="block rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-[#fafafa]"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative hidden max-w-xs flex-1 md:block">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="h-8 border-border bg-[#fafafa] pl-8 text-[13px] shadow-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden h-8 text-[13px] text-muted-foreground sm:inline-flex"
            )}
          >
            {ORGANIZATIONS[0].name}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-[13px]">
            <DropdownMenuLabel className="text-label">Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ORGANIZATIONS.map((org) => (
              <DropdownMenuItem key={org.id}>{org.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md p-1 hover:bg-[#fafafa]">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-[#f4f4f5] text-[11px] font-medium">JM</AvatarFallback>
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
