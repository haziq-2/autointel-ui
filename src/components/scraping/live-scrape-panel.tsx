"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Check, RotateCcw, Square } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatMileage } from "@/lib/format";
import type { ScrapeContext } from "@/lib/scraping/scraper-config";
import { useScrapeSimulation } from "@/lib/scraping/use-scrape-simulation";
import { CityPrompt } from "@/components/scraping/city-prompt";
import { Card } from "@/components/shared/card";

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

  const recordsPerSec = elapsed > 0 ? (vehiclesFound / elapsed).toFixed(1) : "—";

  return (
    <>
      <Card className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-center gap-2.5">
            {phase === "running" && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-25" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            )}
            {phase === "completed" && (
              <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            )}
            {(phase === "stopped" || phase === "idle") && (
              <span className="inline-flex h-2 w-2 rounded-full bg-muted-foreground/60" />
            )}
            <span className="text-card-title capitalize">{phase === "idle" ? "starting" : phase}</span>
          </div>
          <span className="text-metric text-[13px] text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              phase === "completed" ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          <Metric label="Marketplace" value={marketplaceShort} />
          <Metric label="City" value={city.split(",")[0]} />
          <Metric label="Vehicles" value={String(vehiclesFound)} mono />
          <Metric label="Pages" value={String(pagesScanned)} mono />
          <Metric label="Speed" value={`${recordsPerSec}/s`} mono />
          <Metric label="ETA" value={phase === "running" ? `${remainingSec}s` : "—"} mono />
        </div>
        <p className="mt-6 text-helper">
          {phase === "running" && `Scanning ${marketplaceShort} · ${city} · ${pagesScanned} pages processed`}
          {phase === "completed" && `Completed in ${runtime} · ${vehiclesFound} vehicles indexed`}
          {phase === "stopped" && "Scrape stopped by user"}
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
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card padding={false} className="overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-card-title">Event log</h2>
          </div>
          <ScrollArea className="h-[360px]">
            <ul>
              {feed.map((item, i) => (
                <li
                  key={`${item.time}-${item.msg}`}
                  className={cn(
                    "flex items-start gap-3 border-b border-border px-5 py-2.5 text-[13px] transition-colors",
                    i === 0 ? "bg-surface" : ""
                  )}
                >
                  <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", i === 0 ? "text-primary" : "text-muted-foreground/60")} />
                  <div className="min-w-0 flex-1">
                    <span className="mr-2 font-mono text-[11px] text-muted-foreground/70">{item.time}</span>
                    <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{item.msg}</span>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>

        <Card padding={false} className="overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
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
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface"
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
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-label">{label}</p>
      <p className={cn("mt-1.5 text-[16px] font-medium", mono && "text-metric")}>{value}</p>
    </div>
  );
}
