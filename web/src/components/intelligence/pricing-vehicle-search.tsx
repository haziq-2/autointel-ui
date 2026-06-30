"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAllVehicles, getVehicleById } from "@/lib/mock-data/generate-vehicles";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

function vehicleLabel(id: string) {
  const v = getVehicleById(id);
  if (!v) return "";
  return `${v.year} ${v.make} ${v.model}`;
}

function searchVehicles(query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getAllVehicles()
    .filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        String(v.year).includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.marketplace.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

interface PricingVehicleSearchProps {
  vehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
  className?: string;
}

export function PricingVehicleSearch({
  vehicleId,
  onVehicleChange,
  className,
}: PricingVehicleSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchVehicles(query), [query]);
  const selectedLabel = vehicleId ? vehicleLabel(vehicleId) : "";
  const inputValue = focused ? query : selectedLabel;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setFocused(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full min-w-[280px] sm:w-[360px]", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={inputValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setQuery("");
            setOpen(true);
          }}
          placeholder="Search by make, model, year, or location..."
          className="h-9 rounded-xl border-border bg-white pl-9 text-[13px] shadow-none"
        />
      </div>

      {open && focused && query.trim().length > 0 && (
        <div className="absolute top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-[13px] text-muted-foreground">
              No vehicles found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto py-1">
              {results.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onVehicleChange(v.id);
                      setOpen(false);
                      setFocused(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#fafafa]",
                      vehicleId === v.id && "bg-[#eff6ff]"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">
                        {v.year} {v.make} {v.model}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        {v.location} · {v.marketplace}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-[13px] font-semibold tabular-nums">
                        {formatCurrency(v.price)}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-[#2563eb]">
                        {v.opportunityScore} opp
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
