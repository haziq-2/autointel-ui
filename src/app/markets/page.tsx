"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, MapPinned } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader } from "@/components/shared/card";
import { MetricsGrid } from "@/components/shared/metrics-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { UsHeatmap } from "@/components/markets/us-heatmap";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatMileage, formatNumber } from "@/lib/format";
import { searchListings, summarizeMarkets } from "@/lib/geo/market-summary";
import { STATE_NAMES } from "@/lib/geo/resolve-state";
import { cn } from "@/lib/utils";

function shareLabel(count: number, total: number) {
  if (total === 0) return "No listings in this search";
  return `${Math.round((count / total) * 100)}% of matches`;
}

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const deferred = useDeferredValue(search);
  const summary = useMemo(() => summarizeMarkets(searchListings(deferred)), [deferred]);

  const selectedCode = selected?.toUpperCase() ?? null;
  const selectedName = selectedCode ? (STATE_NAMES[selectedCode] ?? selectedCode) : null;
  const cities = selectedCode ? (summary.citiesByState[selectedCode] ?? []) : summary.cities;
  const stateMax = summary.states[0]?.count ?? 1;
  const unplaced = summary.total - summary.placed;

  return (
    <div className="animate-fade-in min-w-0">
      <PageHeader
        title="Markets"
        description="Search a vehicle and see where matching listings sit across the United States."
      />

      <Card className="mb-5" padding={false}>
        <div className="p-3">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelected(null);
              }}
              placeholder="Search make, model, or listing title"
              className="pl-9"
              aria-label="Search vehicles"
            />
          </div>
        </div>
      </Card>

      {summary.total === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No listings match"
          description="Try a make or model, such as F-150, Camry, or Silverado."
          actionLabel="Clear search"
          onAction={() => setSearch("")}
        />
      ) : (
        <>
          <MetricsGrid
            className="mb-5 lg:grid-cols-4"
            metrics={[
              {
                label: "Listings",
                value: formatNumber(summary.total),
                description: deferred.trim() ? "Matching this search" : "Full catalog",
              },
              {
                label: "Craigslist",
                value: formatNumber(summary.craigslist),
                description: shareLabel(summary.craigslist, summary.total),
              },
              {
                label: "Facebook Marketplace",
                value: formatNumber(summary.facebook),
                description: shareLabel(summary.facebook, summary.total),
              },
              {
                label: "OfferUp",
                value: formatNumber(summary.offerup),
                description: shareLabel(summary.offerup, summary.total),
              },
            ]}
          />

          <div className="grid min-w-0 gap-4 lg:grid-cols-5">
            <Card className="min-w-0 lg:col-span-3">
              <CardHeader
                title="Listing heatmap"
                description={
                  selectedName
                    ? `${selectedName} is selected. Choose it again to see every state.`
                    : "Darker states have more matching listings."
                }
              />
              <UsHeatmap counts={summary.counts} selected={selected} onSelect={setSelected} />
              <p className="mt-4 text-helper">
                {formatNumber(summary.placed)} of {formatNumber(summary.total)} listings placed on a state
                {unplaced > 0 ? ` · ${formatNumber(unplaced)} locations could not be mapped` : ""}
              </p>
            </Card>

            <Card className="min-w-0 lg:col-span-2">
              <CardHeader title="This search" description="Price, mileage, and where listings cluster." />
              <dl className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface px-3 py-2.5 ring-1 ring-border">
                  <dt className="text-label">Median ask</dt>
                  <dd className="text-metric mt-1 text-[15px]">
                    {summary.medianPrice == null ? "—" : formatCurrency(summary.medianPrice)}
                  </dd>
                </div>
                <div className="rounded-xl bg-surface px-3 py-2.5 ring-1 ring-border">
                  <dt className="text-label">Median mileage</dt>
                  <dd className="text-metric mt-1 text-[15px]">
                    {summary.medianMileage == null ? "—" : formatMileage(summary.medianMileage)}
                  </dd>
                </div>
              </dl>
              <h3 className="text-label mb-2">States</h3>
              <ul className="max-h-[420px] space-y-0.5 overflow-y-auto pr-1">
                {summary.states.map((state) => {
                  const id = state.code.toLowerCase();
                  const active = selected === id;
                  return (
                    <li key={state.code}>
                      <button
                        type="button"
                        onClick={() => setSelected(active ? null : id)}
                        className={cn(
                          "w-full rounded-lg px-2 py-1.5 text-left transition-colors",
                          active ? "bg-primary-soft" : "hover:bg-surface"
                        )}
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 truncate text-[13px] text-foreground">{state.name}</span>
                          <span className="text-metric shrink-0 text-[13px]">{formatNumber(state.count)}</span>
                        </span>
                        <span className="mt-1 block h-1 overflow-hidden rounded-full bg-muted">
                          <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${Math.max(4, (state.count / stateMax) * 100)}%` }}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader
              title={selectedName ? `Cities in ${selectedName}` : "Top cities"}
              description="Places with the most matching listings we could locate."
            />
            {cities.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No city names could be read for this selection.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {cities.map((city) => (
                  <li
                    key={`${city.state}-${city.name}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5 ring-1 ring-border"
                  >
                    <span className="min-w-0 truncate text-[13px] text-foreground">
                      {city.name}
                      <span className="text-muted-foreground"> · {city.state}</span>
                    </span>
                    <span className="text-metric shrink-0 text-[13px]">{formatNumber(city.count)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
