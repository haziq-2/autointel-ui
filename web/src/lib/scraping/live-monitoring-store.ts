"use client";

import { useSyncExternalStore } from "react";
import { ACTIVE_SCRAPERS } from "@/lib/mock-data/scrapers";

export const POLL_OPTIONS = [
  { value: "300", label: "Every 5 minutes" },
  { value: "600", label: "Every 10 minutes" },
  { value: "900", label: "Every 15 minutes" },
  { value: "1800", label: "Every 30 minutes" },
  { value: "3600", label: "Every hour" },
] as const;

export interface PollEvent {
  id: number;
  time: string;
  found: number;
}

export interface LiveMonitoringState {
  rate: string;
  active: boolean;
  remaining: number;
  cycles: number;
  totalFound: number;
  events: PollEvent[];
}

const DEFAULT_STATE: LiveMonitoringState = {
  rate: "300",
  active: false,
  remaining: 0,
  cycles: 0,
  totalFound: 0,
  events: [],
};

let state: LiveMonitoringState = { ...DEFAULT_STATE, events: [] };
let listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let eventId = 0;

function emit() {
  for (const listener of listeners) listener();
}

function setState(partial: Partial<LiveMonitoringState>) {
  state = { ...state, ...partial };
  emit();
}

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function runPoll() {
  const found = 4 + Math.floor(Math.random() * 15);
  eventId += 1;
  setState({
    cycles: state.cycles + 1,
    totalFound: state.totalFound + found,
    events: [{ id: eventId, time: nowTime(), found }, ...state.events].slice(0, 5),
  });
}

function tick() {
  if (!state.active) return;

  const next = state.remaining - 1;
  if (next <= 0) {
    runPoll();
    setState({ remaining: Number(state.rate) || 300 });
  } else {
    setState({ remaining: next });
  }
}

function ensureTicker() {
  if (intervalId != null) return;
  intervalId = setInterval(tick, 1000);
}

function clearTicker() {
  if (intervalId == null) return;
  clearInterval(intervalId);
  intervalId = null;
}

export function subscribeLiveMonitoring(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLiveMonitoringSnapshot(): LiveMonitoringState {
  return state;
}

export function getLiveMonitoringServerSnapshot(): LiveMonitoringState {
  return DEFAULT_STATE;
}

export function setLiveMonitoringRate(rate: string) {
  if (state.active) return;
  setState({ rate });
}

export function startLiveMonitoring() {
  const rateSec = Number(state.rate) || 300;
  const found = 4 + Math.floor(Math.random() * 15);
  eventId = 1;
  setState({
    active: true,
    cycles: 1,
    totalFound: found,
    events: [{ id: 1, time: nowTime(), found }],
    remaining: rateSec,
  });
  ensureTicker();
}

export function stopLiveMonitoring() {
  clearTicker();
  setState({
    active: false,
    remaining: 0,
  });
}

export function useLiveMonitoring() {
  const snapshot = useSyncExternalStore(
    subscribeLiveMonitoring,
    getLiveMonitoringSnapshot,
    getLiveMonitoringServerSnapshot
  );

  const rateSec = Number(snapshot.rate) || 300;
  const rateLabel = POLL_OPTIONS.find((o) => o.value === snapshot.rate)?.label ?? "";
  const sourceCount = ACTIVE_SCRAPERS.length;
  const pollProgress =
    snapshot.active && rateSec > 0
      ? ((rateSec - snapshot.remaining) / rateSec) * 100
      : 0;

  return {
    ...snapshot,
    rateSec,
    rateLabel,
    sourceCount,
    pollProgress,
    setRate: setLiveMonitoringRate,
    start: startLiveMonitoring,
    stop: stopLiveMonitoring,
  };
}

export function formatCountdown(seconds: number) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}
