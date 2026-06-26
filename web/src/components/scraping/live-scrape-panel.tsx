"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Square, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatMileage } from "@/lib/format";
import type { ScrapeContext } from "@/lib/scraping/scraper-config";
import { useScrapeSimulation } from "@/lib/scraping/use-scrape-simulation";
import { CityPrompt } from "@/components/scraping/city-prompt";

interface LiveScrapePanelProps {
  context: ScrapeContext;
  city?: string;
  initialCity?: string;
  onComplete?: () => void;
  showRestart?: boolean;
  /** When true, city is provided by parent and cannot be changed mid-run */
  cityLocked?: boolean;
}

export function LiveScrapePanel({
  context,
  city: cityProp,
  initialCity,
  onComplete,
  showRestart = true,
  cityLocked = false,
}: LiveScrapePanelProps) {
  const [city, setCity] = useState<string | null>(cityProp ?? initialCity ?? null);

  const activeCity = cityProp ?? city;
  const sourceId = context.sourceId ?? context.id;

  if (!activeCity) {
    return (
      <CityPrompt
        marketplace={context.marketplace}
        defaultCity={initialCity}
        onSubmit={setCity}
      />
    );
  }

  return (
    <LiveScrapeRunner
      key={`${sourceId}-${activeCity}`}
      context={{ ...context, location: `${activeCity} · 50 mi` }}
      city={activeCity}
      sourceId={sourceId}
      onComplete={onComplete}
      showRestart={showRestart}
      onChangeCity={cityLocked ? undefined : () => setCity(null)}
    />
  );
}

function LiveScrapeRunner({
  context,
  city,
  sourceId,
  onComplete,
  showRestart,
  onChangeCity,
}: {
  context: ScrapeContext;
  city: string;
  sourceId: string;
  onComplete?: () => void;
  showRestart?: boolean;
  onChangeCity?: () => void;
}) {
  const {
    phase,
    progress,
    remainingSec,
    pagesScanned,
    vehiclesFound,
    feed,
    liveVehicles,
    elapsed,
    start,
    stop,
  } = useScrapeSimulation({
    sourceId,
    city,
    autoStart: true,
    onComplete,
  });

  const runtime = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  const marketplaceShort = context.marketplace.split(" ")[0];

  return (
    <>
      <div className="mb-10 rounded-md border border-border p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            {phase === "running" && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#111827] opacity-20" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#111827]" />
              </span>
            )}
            {phase === "completed" && (
              <span className="inline-flex h-2 w-2 rounded-full bg-[#16a34a]" />
            )}
            {(phase === "stopped" || phase === "idle") && (
              <span className="inline-flex h-2 w-2 rounded-full bg-[#9ca3af]" />
            )}
            <span className="text-card-title capitalize">{phase === "idle" ? "starting" : phase}</span>
          </div>
          <span className="font-mono text-[13px] tabular-nums text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#f4f4f5]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              phase === "completed" ? "bg-[#16a34a]" : "bg-[#111827]"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Metric label="Marketplace" value={marketplaceShort} />
          <Metric label="City" value={city.split(",")[0]} />
          <Metric label="Vehicles found" value={String(vehiclesFound)} mono />
          <Metric label="Runtime" value={runtime} mono />
        </div>
        <p className="mt-6 text-label">
          {phase === "running" && `${remainingSec}s remaining · ${pagesScanned} pages · ${city} only`}
          {phase === "completed" && `Finished in ${runtime} · ${vehiclesFound} vehicles in ${city}`}
          {phase === "stopped" && "Scrape stopped"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {phase === "running" ? (
            <button
              type="button"
              onClick={stop}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </button>
          ) : showRestart ? (
            <button
              type="button"
              onClick={start}
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Run again
            </button>
          ) : null}
          {onChangeCity && phase !== "running" && (
            <button
              type="button"
              onClick={onChangeCity}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Change city
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-card-title">Event log</h2>
          </div>
          <ScrollArea className="h-[360px]">
            <ul>
              {feed.map((item, i) => (
                <li
                  key={`${item.time}-${item.msg}`}
                  className={cn(
                    "border-b border-border px-4 py-2.5 text-[13px]",
                    i === 0 ? "bg-[#fafafa] text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span className="mr-3 font-mono text-[11px] text-muted-foreground">{item.time}</span>
                  {item.msg}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        <div className="rounded-md border border-border">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-card-title">Incoming records · {city}</h2>
          </div>
          <ScrollArea className="h-[360px]">
            {liveVehicles.length === 0 ? (
              <p className="p-4 text-[13px] text-muted-foreground">Waiting for listings in {city}...</p>
            ) : (
              <div className="divide-y divide-border">
                {liveVehicles.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vehicles/${v.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafafa]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{v.title}</p>
                      <p className="font-mono text-[12px] text-muted-foreground tabular-nums">
                        {formatCurrency(v.price)} · {formatMileage(v.mileage)}
                      </p>
                    </div>
                    <span className="text-label">{v.location}</span>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

function Metric({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-label">{label}</p>
      <p className={cn("mt-1 text-[15px] font-medium", mono && "font-mono tabular-nums")}>{value}</p>
    </div>
  );
}
