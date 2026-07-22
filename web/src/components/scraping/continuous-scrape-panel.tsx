"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/shared/card";
import { ACTIVE_SCRAPERS } from "@/lib/mock-data/scrapers";
import { cn } from "@/lib/utils";

const POLL_OPTIONS = [
  { value: "300", label: "Every 5 minutes" },
  { value: "900", label: "Every 15 minutes" },
  { value: "1800", label: "Every 30 minutes" },
  { value: "3600", label: "Every hour" },
];

interface PollEvent {
  id: number;
  time: string;
  found: number;
}

export function ContinuousScrapePanel() {
  const [rate, setRate] = useState("300");
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const [events, setEvents] = useState<PollEvent[]>([]);

  const remainingRef = useRef(0);
  const idRef = useRef(0);

  const rateSec = Number(rate);
  const sourceCount = ACTIVE_SCRAPERS.length;
  const rateLabel = POLL_OPTIONS.find((o) => o.value === rate)?.label ?? "";

  const runPoll = useCallback(() => {
    const found = 4 + Math.floor(Math.random() * 15);
    setCycles((c) => c + 1);
    setTotalFound((t) => t + found);
    setEvents((e) => [{ id: idRef.current++, time: nowTime(), found }, ...e].slice(0, 5));
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      remainingRef.current -= 1;
      if (remainingRef.current <= 0) {
        runPoll();
        remainingRef.current = rateSec;
      }
      setRemaining(remainingRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [active, rateSec, runPoll]);

  const start = () => {
    idRef.current = 0;
    setCycles(0);
    setTotalFound(0);
    setEvents([]);
    runPoll();
    remainingRef.current = rateSec;
    setRemaining(rateSec);
    setActive(true);
  };

  const stop = () => {
    setActive(false);
    remainingRef.current = 0;
    setRemaining(0);
  };

  const pollProgress = rateSec > 0 ? ((rateSec - remaining) / rateSec) * 100 : 0;

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {active && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
            )}
            <span
              className={cn(
                "relative inline-flex h-2.5 w-2.5 rounded-full",
                active ? "bg-primary" : "bg-muted-foreground/40"
              )}
            />
          </span>
          <div>
            <p className="text-card-title font-medium">Live Monitoring</p>
            <p className="text-helper">
              {active
                ? `Polling ${sourceCount} sources ${rateLabel.toLowerCase()}`
                : "Automatically re-scrape all sources on a fixed interval"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={rate} onValueChange={(v) => setRate(v ?? "300")} disabled={active}>
            <SelectTrigger className="h-8 w-[168px] rounded-lg border-border bg-card text-[13px] shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POLL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {active ? (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={stop}>
              <Square className="h-3.5 w-3.5" />
              Stop
            </Button>
          ) : (
            <Button size="sm" className="gap-1.5" onClick={start}>
              <Play className="h-3.5 w-3.5" />
              Start
            </Button>
          )}
        </div>
      </div>

      {active && (
        <div className="mt-5 border-t border-border pt-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Polling rate" value={rateLabel.replace("Every ", "")} />
            <Stat label="Cycles" value={String(cycles)} mono />
            <Stat label="Vehicles found" value={totalFound.toLocaleString()} mono />
            <Stat label="Next poll" value={formatCountdown(remaining)} mono />
          </div>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${pollProgress}%` }}
            />
          </div>

          {events.length > 0 && (
            <ul className="mt-5 space-y-1.5">
              {events.map((e) => (
                <li key={e.id} className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">
                    <span className="mr-2 font-mono text-[11px] text-muted-foreground/70">{e.time}</span>
                    Polled {sourceCount} sources
                  </span>
                  <span className="font-mono tabular-nums text-[var(--tint-success-fg)]">+{e.found}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-label">{label}</p>
      <p className={cn("mt-1 text-[15px] font-medium", mono && "font-mono tabular-nums")}>{value}</p>
    </div>
  );
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatCountdown(seconds: number) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}
