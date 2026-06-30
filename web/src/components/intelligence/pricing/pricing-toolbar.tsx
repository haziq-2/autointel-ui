"use client";

import Link from "next/link";
import { Bookmark, ExternalLink, GitCompare, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MARKETPLACES } from "@/lib/constants";
import { VEHICLE_MAKES } from "@/lib/mock-data/generate-vehicles";
import type { PricingWorkspace } from "@/lib/types";

export interface PricingFilters {
  marketplace: string;
  city: string;
  priceRange: string;
  make: string;
  model: string;
}

export const DEFAULT_PRICING_FILTERS: PricingFilters = {
  marketplace: "All",
  city: "All",
  priceRange: "All",
  make: "All",
  model: "All",
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-9 min-w-[132px] text-[12px]">
        <span className="flex w-full items-center gap-1.5 overflow-hidden">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span className="shrink-0 text-border">·</span>
          <span className="truncate">{value}</span>
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} className="text-[12px]">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PricingToolbar({
  workspace,
  filters,
  onFiltersChange,
}: {
  workspace: PricingWorkspace;
  filters: PricingFilters;
  onFiltersChange: (f: PricingFilters) => void;
}) {
  const set = (patch: Partial<PricingFilters>) => onFiltersChange({ ...filters, ...patch });
  const city = workspace.location.split(",")[0];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          label="Marketplace"
          value={filters.marketplace}
          options={["All", ...MARKETPLACES]}
          onChange={(v) => set({ marketplace: v })}
        />
        <FilterSelect
          label="City"
          value={filters.city}
          options={["All", city, "Dallas", "Houston", "Austin", "Phoenix", "Atlanta"]}
          onChange={(v) => set({ city: v })}
        />
        <FilterSelect
          label="Price"
          value={filters.priceRange}
          options={["All", "Under $15k", "$15–25k", "$25–35k", "$35k+"]}
          onChange={(v) => set({ priceRange: v })}
        />
        <FilterSelect
          label="Make"
          value={filters.make}
          options={["All", ...VEHICLE_MAKES.slice(0, 8)]}
          onChange={(v) => set({ make: v })}
        />
        <FilterSelect
          label="Model"
          value={filters.model}
          options={["All", workspace.model]}
          onChange={(v) => set({ model: v })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 gap-1.5 text-[12px]")}>
          <Save className="h-3.5 w-3.5" />
          Save Analysis
        </button>
        <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 gap-1.5 text-[12px]")}>
          <Bookmark className="h-3.5 w-3.5" />
          Watchlist
        </button>
        <Link
          href={`/vehicles/${workspace.vehicleId}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 gap-1.5 text-[12px]")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Listing
        </Link>
        <button type="button" className={cn(buttonVariants({ size: "sm" }), "h-9 gap-1.5 text-[12px]")}>
          <GitCompare className="h-3.5 w-3.5" />
          Compare
        </button>
      </div>
    </div>
  );
}
