"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getVehiclesByCity } from "@/lib/mock-data/generate-vehicles";
import type { VehicleListing } from "@/lib/types";
import { SCRAPE_DURATION_SEC, getActivityMessages } from "./scraper-config";

export type ScrapePhase = "idle" | "running" | "completed" | "stopped";

export interface ScrapeFeedItem {
  time: string;
  msg: string;
}

export interface UseScrapeSimulationOptions {
  sourceId: string;
  city: string;
  durationSec?: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useScrapeSimulation({
  sourceId,
  city,
  durationSec = SCRAPE_DURATION_SEC,
  autoStart = false,
  onComplete,
}: UseScrapeSimulationOptions) {
  const [phase, setPhase] = useState<ScrapePhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [pagesScanned, setPagesScanned] = useState(0);
  const [vehiclesFound, setVehiclesFound] = useState(0);
  const [feed, setFeed] = useState<ScrapeFeedItem[]>([]);
  const [liveVehicles, setLiveVehicles] = useState<VehicleListing[]>([]);

  const completedRef = useRef(false);
  const poolRef = useRef<VehicleListing[]>([]);
  const poolCursorRef = useRef(0);
  const autoStartedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const messages = useMemo(
    () => getActivityMessages(sourceId, city),
    [sourceId, city]
  );
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const progress = phase === "completed" ? 100 : Math.min(100, Math.round((elapsed / durationSec) * 100));
  const remainingSec = Math.max(0, durationSec - elapsed);

  const stop = useCallback(() => {
    setPhase("stopped");
  }, []);

  const start = useCallback(() => {
    const pool = getVehiclesByCity(city, 120);
    poolRef.current = pool.length > 0 ? pool : [];

    completedRef.current = false;
    autoStartedRef.current = true;
    poolCursorRef.current = Math.min(3, pool.length);
    setPhase("running");
    setElapsed(0);
    setPagesScanned(0);
    setVehiclesFound(0);
    setFeed([
      {
        time: formatTime(0),
        msg: `Scoped scrape to ${city} · ${pool.length} listings in index`,
      },
    ]);
    setLiveVehicles(pool.slice(0, 3));
  }, [city]);

  useEffect(() => {
    if (!autoStart || !city || autoStartedRef.current) return;
    autoStartedRef.current = true;
    start();
  }, [autoStart, city, start]);

  useEffect(() => {
    if (phase !== "running") return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        const pool = poolRef.current;
        const isComplete = next >= durationSec;

        setPagesScanned(
          Math.floor((next / durationSec) * 48) + Math.floor(Math.random() * 2)
        );

        if (isComplete) {
          if (!completedRef.current) {
            completedRef.current = true;
            setPhase("completed");
            setVehiclesFound(
              pool.length > 0
                ? Math.min(pool.length, Math.floor(pool.length * 0.15) + 8)
                : 0
            );
            setFeed((f) =>
              [
                { time: formatTime(next), msg: `Scrape completed · ${city} only` },
                ...f,
              ].slice(0, 20)
            );
            onCompleteRef.current?.();
          }
        } else {
          if (pool.length > 0 && Math.random() > 0.35) {
            setVehiclesFound((v) => Math.min(v + 1, pool.length));
          }

          const msgList = messagesRef.current;
          const msg = msgList[next % msgList.length];
          setFeed((f) => [{ time: formatTime(next), msg }, ...f].slice(0, 20));

          if (pool.length > 0 && Math.random() > 0.4) {
            const cursor = poolCursorRef.current;
            if (cursor < pool.length) {
              const pick = pool[cursor];
              poolCursorRef.current = cursor + 1;
              setLiveVehicles((v) => [pick, ...v].slice(0, 8));
            }
          }
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, durationSec, city]);

  return {
    phase,
    elapsed,
    progress,
    remainingSec,
    pagesScanned,
    vehiclesFound,
    feed,
    liveVehicles,
    start,
    stop,
  };
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
