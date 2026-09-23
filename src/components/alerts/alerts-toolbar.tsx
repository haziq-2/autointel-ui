"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ALERT_CITIES, ALERT_MAKES, ALERT_MARKETPLACES } from "@/lib/mock-data/alerts";
import { TYPE_FILTER_OPTIONS, PRIORITY_STYLES } from "./alert-config";
import type { AlertPriority } from "@/lib/types";

export interface AlertFilters {
  search: string;
  dateRange: string;
  marketplace: string;
  city: string;
  make: string;
  priority: string;
  alertType: string;
  unreadOnly: boolean;
  savedOnly: boolean;
}

export const DEFAULT_FILTERS: AlertFilters = {
  search: "",
  dateRange: "today",
  marketplace: "all",
  city: "all",
  make: "all",
  priority: "all",
  alertType: "all",
  unreadOnly: false,
  savedOnly: false,
};

interface AlertsToolbarProps {
  filters: AlertFilters;
  onChange: (filters: AlertFilters) => void;
  resultCount: number;
}

export function AlertsToolbar({ filters, onChange, resultCount }: AlertsToolbarProps) {
  const set = (patch: Partial<AlertFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="surface-card mb-5 space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-full sm:min-w-[180px] sm:basis-auto">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search alerts, vehicles, locations..."
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="h-9 pl-8 text-[13px]"
          />
        </div>
        <FilterSelect
          value={filters.dateRange}
          onValueChange={(v) => set({ dateRange: v })}
          label="Date Range"
          options={[
            { value: "today", label: "Today" },
            { value: "24h", label: "Last 24 hours" },
            { value: "7d", label: "Last 7 days" },
            { value: "30d", label: "Last 30 days" },
          ]}
        />
        <FilterSelect
          value={filters.marketplace}
          onValueChange={(v) => set({ marketplace: v })}
          label="Marketplace"
          options={[{ value: "all", label: "All sources" }, ...ALERT_MARKETPLACES.map((m) => ({ value: m, label: m }))]}
        />
        <FilterSelect
          value={filters.city}
          onValueChange={(v) => set({ city: v })}
          label="City"
          options={[{ value: "all", label: "All cities" }, ...ALERT_CITIES.map((c) => ({ value: c, label: c }))]}
        />
        <FilterSelect
          value={filters.make}
          onValueChange={(v) => set({ make: v })}
          label="Make"
          options={[{ value: "all", label: "All makes" }, ...ALERT_MAKES.map((m) => ({ value: m, label: m }))]}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          value={filters.priority}
          onValueChange={(v) => set({ priority: v })}
          label="Priority"
          options={[
            { value: "all", label: "All priorities" },
            { value: "critical", label: "Critical" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
        />
        <FilterSelect
          value={filters.alertType}
          onValueChange={(v) => set({ alertType: v })}
          label="Alert Type"
          options={TYPE_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <ToggleChip
          active={filters.unreadOnly}
          onClick={() => set({ unreadOnly: !filters.unreadOnly })}
          label="Unread only"
        />
        <ToggleChip
          active={filters.savedOnly}
          onClick={() => set({ savedOnly: !filters.savedOnly })}
          label="Saved only"
        />
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset filters
        </button>
        <span className="ml-auto text-[12px] text-muted-foreground">
          <span className="font-mono font-medium tabular-nums text-foreground">{resultCount}</span> alerts
        </span>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onValueChange,
  label,
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onValueChange(v)}>
      <SelectTrigger className="h-9 min-w-0 max-w-full text-[12px] sm:min-w-[148px]">
        <span className="flex w-full items-center gap-1.5 overflow-hidden">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span className="shrink-0 text-border">·</span>
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-[12px]">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-surface text-muted-foreground ring-1 ring-border hover:bg-surface-hover hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function PriorityBadge({ priority }: { priority: AlertPriority }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        PRIORITY_STYLES[priority]
      )}
    >
      {priority}
    </span>
  );
}
