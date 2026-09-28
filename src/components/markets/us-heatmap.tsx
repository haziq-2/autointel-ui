"use client";

import { useState } from "react";
import usa from "@svg-maps/usa";
import { STATE_NAMES } from "@/lib/geo/resolve-state";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

function heatFill(count: number, max: number) {
  if (count <= 0 || max <= 0) return "var(--muted)";
  const t = Math.sqrt(count / max);
  const mix = Math.round(16 + t * 84);
  return `color-mix(in oklab, var(--primary) ${mix}%, var(--muted))`;
}

export function UsHeatmap({
  counts,
  selected,
  onSelect,
}: {
  counts: Record<string, number>;
  selected: string | null;
  onSelect: (code: string | null) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(0, ...Object.values(counts));
  const activeId = hover ?? selected;
  const activeCount = activeId ? (counts[activeId] ?? 0) : 0;
  const activeName = activeId ? (STATE_NAMES[activeId.toUpperCase()] ?? activeId.toUpperCase()) : null;

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={usa.viewBox}
          className="h-auto w-full"
          role="group"
          aria-label="United States listing heatmap"
        >
          {usa.locations.map((location) => {
            const count = counts[location.id] ?? 0;
            const isSelected = selected === location.id;
            const isHover = hover === location.id;
            return (
              <path
                key={location.id}
                d={location.path}
                fill={heatFill(count, max)}
                stroke={isSelected || isHover ? "var(--primary)" : "var(--card)"}
                strokeWidth={isSelected ? 2.4 : isHover ? 1.6 : 1.1}
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${location.name}, ${formatNumber(count)} listings`}
                aria-pressed={isSelected}
                onMouseEnter={() => setHover(location.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(location.id)}
                onBlur={() => setHover(null)}
                onClick={() => onSelect(isSelected ? null : location.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(isSelected ? null : location.id);
                  }
                }}
              >
                <title>{`${location.name}: ${formatNumber(count)} listings`}</title>
              </path>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute left-0 top-0 rounded-lg bg-card/95 px-2.5 py-1.5 text-[12px] text-foreground shadow-sm ring-1 ring-border">
          {activeName ? (
            <span>
              <span className="font-medium">{activeName}</span>
              <span className="text-muted-foreground"> · {formatNumber(activeCount)} listings</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Hover a state</span>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-helper">Fewer</span>
        <div
          className="h-1.5 flex-1 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--muted), color-mix(in oklab, var(--primary) 45%, var(--muted)), var(--primary))",
          }}
        />
        <span className="text-helper">More</span>
        <span className={cn("text-helper tabular-nums", max === 0 && "invisible")}>
          {formatNumber(max)}
        </span>
      </div>
    </div>
  );
}
