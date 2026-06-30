"use client";

import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { INTELLIGENCE_FILTER_OPTIONS } from "@/lib/mock-data/intelligence-dashboard";

export interface IntelligenceFilters {
  search: string;
  dateRange: string;
  marketplace: string;
  state: string;
  city: string;
  make: string;
  category: string;
  fuelType: string;
  priceRange: string;
  mileage: string;
  opportunityScore: string;
  demandScore: string;
}

export const DEFAULT_INTELLIGENCE_FILTERS: IntelligenceFilters = {
  search: "",
  dateRange: "30 Days",
  marketplace: "All",
  state: "All",
  city: "All",
  make: "All",
  category: "All",
  fuelType: "All",
  priceRange: "All",
  mileage: "All",
  opportunityScore: "All",
  demandScore: "All",
};

export function IntelligenceFilterBar({
  filters,
  onChange,
  showDemandScore = false,
  showSearch = true,
  compact = false,
}: {
  filters: IntelligenceFilters;
  onChange: (f: IntelligenceFilters) => void;
  showDemandScore?: boolean;
  showSearch?: boolean;
  compact?: boolean;
}) {
  const set = (patch: Partial<IntelligenceFilters>) => onChange({ ...filters, ...patch });

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
        <FilterSelect label="Date Range" value={filters.dateRange} options={INTELLIGENCE_FILTER_OPTIONS.dateRanges} onChange={(v) => set({ dateRange: v })} />
        <FilterSelect label="Marketplace" value={filters.marketplace} options={INTELLIGENCE_FILTER_OPTIONS.marketplaces} onChange={(v) => set({ marketplace: v })} />
        <FilterSelect label="Category" value={filters.category} options={INTELLIGENCE_FILTER_OPTIONS.categories} onChange={(v) => set({ category: v })} />
        <FilterSelect
          label="Price Range"
          value={filters.priceRange}
          options={["All", "Under $15k", "$15–25k", "$25–35k", "$35k+"]}
          onChange={(v) => set({ priceRange: v })}
        />
        <FilterSelect label="State" value={filters.state} options={INTELLIGENCE_FILTER_OPTIONS.states} onChange={(v) => set({ state: v })} />
        <button
          type="button"
          onClick={() => onChange(DEFAULT_INTELLIGENCE_FILTERS)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-[#fafafa] hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        {showSearch && (
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vehicles, markets, segments..."
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              className="h-9 pl-8 text-[13px]"
            />
          </div>
        )}
        <FilterSelect label="Date Range" value={filters.dateRange} options={INTELLIGENCE_FILTER_OPTIONS.dateRanges} onChange={(v) => set({ dateRange: v })} />
        <FilterSelect label="Marketplace" value={filters.marketplace} options={INTELLIGENCE_FILTER_OPTIONS.marketplaces} onChange={(v) => set({ marketplace: v })} />
        <FilterSelect label="State" value={filters.state} options={INTELLIGENCE_FILTER_OPTIONS.states} onChange={(v) => set({ state: v })} />
        <FilterSelect label="City" value={filters.city} options={INTELLIGENCE_FILTER_OPTIONS.cities} onChange={(v) => set({ city: v })} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect label="Make" value={filters.make} options={INTELLIGENCE_FILTER_OPTIONS.makes} onChange={(v) => set({ make: v })} />
        <FilterSelect label="Category" value={filters.category} options={INTELLIGENCE_FILTER_OPTIONS.categories} onChange={(v) => set({ category: v })} />
        <FilterSelect label="Fuel Type" value={filters.fuelType} options={INTELLIGENCE_FILTER_OPTIONS.fuelTypes} onChange={(v) => set({ fuelType: v })} />
        <FilterSelect
          label="Price Range"
          value={filters.priceRange}
          options={["All", "Under $15k", "$15–25k", "$25–35k", "$35k+"]}
          onChange={(v) => set({ priceRange: v })}
        />
        <FilterSelect
          label="Mileage"
          value={filters.mileage}
          options={["All", "Under 50k", "50–80k", "80–120k", "120k+"]}
          onChange={(v) => set({ mileage: v })}
        />
        <FilterSelect
          label="Opportunity Score"
          value={filters.opportunityScore}
          options={["All", "90+", "85+", "80+", "75+"]}
          onChange={(v) => set({ opportunityScore: v })}
        />
        {showDemandScore && (
          <FilterSelect
            label="Demand Score"
            value={filters.demandScore}
            options={["All", "90+", "85+", "80+", "75+"]}
            onChange={(v) => set({ demandScore: v })}
          />
        )}
        <button
          type="button"
          onClick={() => onChange(DEFAULT_INTELLIGENCE_FILTERS)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-[#fafafa] hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-9 min-w-[148px] text-[12px]">
        <span className="flex w-full items-center gap-1.5 overflow-hidden">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span className="shrink-0 text-border">·</span>
          <SelectValue />
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

export function PeriodToggle({
  value,
  onChange,
  options = ["7d", "30d", "90d", "1y"],
  labels = { "7d": "7 Days", "30d": "30 Days", "90d": "90 Days", "1y": "1 Year" },
}: {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-[#fafafa] p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
            value === opt ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {labels[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

export function ChartPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-white p-5 shadow-card", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
