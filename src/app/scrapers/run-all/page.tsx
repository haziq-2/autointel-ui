"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { LiveScrapePanel } from "@/components/scraping/live-scrape-panel";
import { CityPrompt } from "@/components/scraping/city-prompt";
import { ACTIVE_SCRAPERS } from "@/lib/mock-data/scrapers";
import {
  ALL_SOURCE_IDS,
  resolveScrapeContext,
  SCRAPE_DURATION_SEC,
} from "@/lib/scraping/scraper-config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function RunAllScrapersPage() {
  const [city, setCity] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const currentId = ALL_SOURCE_IDS[activeIndex];
  const context = resolveScrapeContext(currentId, city ?? undefined);
  const total = ALL_SOURCE_IDS.length;

  const handleComplete = useCallback(() => {
    setCompleted((prev) => new Set(prev).add(currentId));
    if (activeIndex < total - 1) {
      setTimeout(() => setActiveIndex((i) => i + 1), 800);
    } else {
      setFinished(true);
    }
  }, [activeIndex, currentId, total]);

  if (!city) {
    return (
      <div>
        <PageHeader
          title="Run all sources"
          description={`${SCRAPE_DURATION_SEC}s per marketplace · ${total} sources`}
        >
          <Link href="/scrapers" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Back
          </Link>
        </PageHeader>
        <CityPrompt
          marketplace="All marketplaces"
          onSubmit={setCity}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Run all sources"
        description={`${city} · ${SCRAPE_DURATION_SEC}s per source`}
      >
        <Link href="/scrapers" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Back
        </Link>
      </PageHeader>

      <div className="mb-8 flex flex-wrap gap-2">
        {ACTIVE_SCRAPERS.map((s, i) => {
          const isDone = completed.has(s.id);
          const isCurrent = i === activeIndex && !finished;
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] ring-1 transition-colors",
                isCurrent && "bg-primary-soft font-medium text-primary ring-primary/25",
                isDone && "bg-card text-muted-foreground ring-border",
                !isCurrent && !isDone && "text-muted-foreground ring-border"
              )}
            >
              {isDone && <Check className="h-3.5 w-3.5 text-success" />}
              {s.name}
            </div>
          );
        })}
      </div>

      {finished ? (
        <div className="surface-card p-10 text-center">
          <p className="text-section-title">All scrapers completed</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {city} · {total} marketplaces · ~{total} minutes
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link
              href={`/vehicles?search=${encodeURIComponent(city.split(",")[0])}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              View vehicles
            </Link>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              onClick={() => {
                setActiveIndex(0);
                setCompleted(new Set());
                setFinished(false);
              }}
            >
              Run again
            </button>
          </div>
        </div>
      ) : (
        <LiveScrapePanel
          key={`${currentId}-${city}`}
          context={context}
          city={city}
          onComplete={handleComplete}
          showRestart={false}
        />
      )}
    </div>
  );
}
