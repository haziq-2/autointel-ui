"use client";

import { useMemo, useState } from "react";
import usaMap from "@svg-maps/usa";
import { motion, AnimatePresence } from "framer-motion";
import { EXTENDED_STATE_INTEL } from "@/lib/mock-data/intelligence-dashboard";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type MapLocation = { id: string; name: string; path: string };

type StateIntel = (typeof EXTENDED_STATE_INTEL)[number];

const MAP_LOCATIONS = usaMap.locations as MapLocation[];

const INTEL_BY_ID = Object.fromEntries(
  EXTENDED_STATE_INTEL.map((s) => [s.code.toLowerCase(), s])
);

function demandColor(score: number) {
  if (score >= 90) return "#1d4ed8";
  if (score >= 85) return "#2563eb";
  if (score >= 80) return "#3b82f6";
  if (score >= 75) return "#60a5fa";
  if (score >= 70) return "#93c5fd";
  return "#cbd5e1";
}

function getStateIntel(id: string): StateIntel {
  const existing = INTEL_BY_ID[id];
  if (existing) return existing;

  const location = MAP_LOCATIONS.find((l) => l.id === id);
  return {
    code: id.toUpperCase(),
    name: location?.name ?? id.toUpperCase(),
    demandScore: 62 + (id.charCodeAt(0) % 12),
    inventory: 180 + (id.charCodeAt(0) % 8) * 40,
    avgMargin: 2800 + (id.charCodeAt(1) % 10) * 180,
    avgSaleTime: 18 + (id.charCodeAt(0) % 6),
    topCategory: "SUVs",
    opportunityScore: 60 + (id.charCodeAt(0) % 15),
    roi: 16 + (id.charCodeAt(0) % 8),
    priceTrend: [26800, 26600, 26400, 26200],
  };
}

export function USDemandMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>("tx");

  const activeId = hoveredId ?? selectedId;
  const activeIntel = useMemo(
    () => (activeId ? getStateIntel(activeId) : null),
    [activeId]
  );

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-[#fafafa] to-white p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold">Interactive US Demand Map</h3>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Choropleth by demand score — hover or click any state
          </p>
        </div>
        {selectedId && (
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-[12px] font-medium text-[#2563eb] hover:underline"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_272px]">
        <div className="relative min-h-[280px]">
          <svg
            viewBox={usaMap.viewBox}
            role="img"
            aria-label="United States demand choropleth map"
            className="mx-auto h-auto w-full max-w-3xl"
          >
            {MAP_LOCATIONS.map((loc) => {
              const intel = getStateIntel(loc.id);
              const isActive = activeId === loc.id;
              const isSelected = selectedId === loc.id;

              return (
                <path
                  key={loc.id}
                  id={loc.id}
                  d={loc.path}
                  fill={demandColor(intel.demandScore)}
                  stroke={isActive ? "#0f172a" : "#ffffff"}
                  strokeWidth={isActive ? 1.25 : 0.6}
                  strokeLinejoin="round"
                  className={cn(
                    "cursor-pointer transition-[fill-opacity,stroke-width] duration-150",
                    isActive ? "opacity-100" : "opacity-90 hover:opacity-100"
                  )}
                  style={{
                    filter: isSelected && !hoveredId ? "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" : undefined,
                  }}
                  onMouseEnter={() => setHoveredId(loc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedId(loc.id)}
                >
                  <title>{`${loc.name} — Demand ${intel.demandScore}`}</title>
                </path>
              );
            })}
          </svg>
        </div>

        <aside className="flex flex-col">
          <AnimatePresence mode="wait">
            {activeIntel ? (
              <motion.div
                key={activeIntel.code}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="rounded-2xl border border-border bg-white p-5 shadow-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[16px] font-semibold">{activeIntel.name}</h4>
                  <span
                    className="rounded-lg px-2.5 py-1 font-mono text-[13px] font-bold tabular-nums text-white"
                    style={{ backgroundColor: demandColor(activeIntel.demandScore) }}
                  >
                    {activeIntel.demandScore}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Demand score</p>

                <dl className="mt-4 space-y-3 text-[12px]">
                  <DetailRow label="Inventory" value={activeIntel.inventory.toLocaleString()} />
                  <DetailRow
                    label="Average Margin"
                    value={formatCurrency(activeIntel.avgMargin)}
                    valueClassName="text-[#16a34a]"
                  />
                  <DetailRow label="Avg Sale Time" value={`${activeIntel.avgSaleTime} days`} />
                  <DetailRow label="Top Category" value={activeIntel.topCategory} />
                  <DetailRow
                    label="Opportunity Score"
                    value={String(activeIntel.opportunityScore)}
                    valueClassName="text-[#2563eb]"
                  />
                  <DetailRow
                    label="Expected ROI"
                    value={`${activeIntel.roi}%`}
                    valueClassName="text-[#16a34a]"
                  />
                </dl>

                {hoveredId && (
                  <p className="mt-4 text-[11px] text-muted-foreground">Click to pin this state</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-[#fafafa] p-8 text-center"
              >
                <p className="text-[13px] text-muted-foreground">
                  Hover over a state to view regional demand intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Demand scale
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { color: "#1d4ed8", label: "90+" },
                { color: "#2563eb", label: "85–89" },
                { color: "#3b82f6", label: "80–84" },
                { color: "#60a5fa", label: "75–79" },
                { color: "#93c5fd", label: "70–74" },
                { color: "#cbd5e1", label: "<70" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-mono font-semibold tabular-nums", valueClassName)}>{value}</dd>
    </div>
  );
}
