"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SCRAPE_CITIES, countVehiclesByCity } from "@/lib/mock-data/generate-vehicles";

interface CityPromptProps {
  marketplace: string;
  onSubmit: (city: string) => void;
  defaultCity?: string;
}

export function CityPrompt({ marketplace, onSubmit, defaultCity = "" }: CityPromptProps) {
  const [city, setCity] = useState(defaultCity);
  const [error, setError] = useState("");

  const previewCount = city.trim() ? countVehiclesByCity(city) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) {
      setError("Enter a city to scope this scrape.");
      return;
    }
    if (previewCount === 0) {
      setError("No indexed vehicles for this city. Try Dallas, Houston, Austin, or Phoenix.");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="mx-auto max-w-md rounded-md border border-border p-6">
      <h2 className="text-card-title">Select city</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {marketplace} will only return listings from this city.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-label" htmlFor="scrape-city">
            City
          </label>
          <Input
            id="scrape-city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError("");
            }}
            placeholder="e.g. Dallas, TX"
            className="mt-1.5 h-9 border-border text-[13px] shadow-none"
            autoFocus
          />
          {previewCount !== null && previewCount > 0 && (
            <p className="mt-1.5 text-label">
              ~{previewCount.toLocaleString()} vehicles indexed in this area
            </p>
          )}
          {error && <p className="mt-1.5 text-[13px] text-destructive">{error}</p>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SCRAPE_CITIES.slice(0, 6).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCity(c);
                setError("");
              }}
              className="rounded-md border border-border px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {c}
            </button>
          ))}
        </div>

        <button type="submit" className={cn(buttonVariants({ size: "sm" }), "w-full")}>
          Start scraping
        </button>
      </form>
    </div>
  );
}
