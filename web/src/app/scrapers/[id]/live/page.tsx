"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LIVE_ACTIVITY_MESSAGES } from "@/lib/mock-data/scrapers";
import { getRecentVehicles } from "@/lib/mock-data/generate-vehicles";
import { formatCurrency, formatMileage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Square } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LiveScrapingPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [progress, setProgress] = useState(12);
  const [pagesScanned, setPagesScanned] = useState(18);
  const [vehiclesFound, setVehiclesFound] = useState(24);
  const [elapsed, setElapsed] = useState(0);
  const [feed, setFeed] = useState<{ time: string; msg: string }[]>([
    { time: formatTime(0), msg: LIVE_ACTIVITY_MESSAGES[0] },
  ]);
  const [liveVehicles, setLiveVehicles] = useState(getRecentVehicles(4));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      setProgress((p) => Math.min(p + Math.random() * 3, 98));
      setPagesScanned((p) => p + 1);
      setVehiclesFound((v) => v + (Math.random() > 0.45 ? 1 : 0));
      setFeed((f) => {
        const next = LIVE_ACTIVITY_MESSAGES[f.length % LIVE_ACTIVITY_MESSAGES.length];
        return [{ time: formatTime(elapsed + 1), msg: next }, ...f].slice(0, 16);
      });
      if (Math.random() > 0.55) {
        const all = getRecentVehicles(20);
        const pick = all[Math.floor(Math.random() * all.length)];
        setLiveVehicles((v) => [pick, ...v.filter((x) => x.id !== pick.id)].slice(0, 6));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [elapsed]);

  const eta = Math.max(1, Math.round((100 - progress) / 7));
  const runtime = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div>
      <PageHeader title="Live scrape" description={`Job ${jobId} · Facebook Marketplace · Dallas, TX`}>
        <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
          <Square className="h-3.5 w-3.5" />
          Stop
        </button>
      </PageHeader>

      <div className="mb-10 rounded-md border border-border p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#111827] opacity-20" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#111827]" />
            </span>
            <span className="text-card-title">Running</span>
          </div>
          <span className="font-mono text-[13px] tabular-nums text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#f4f4f5]">
          <div
            className="h-full rounded-full bg-[#111827] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Metric label="Marketplace" value="Facebook" />
          <Metric label="Pages scanned" value={String(pagesScanned)} mono />
          <Metric label="Vehicles found" value={String(vehiclesFound)} mono />
          <Metric label="Runtime" value={runtime} mono />
        </div>
        <p className="mt-6 text-label">
          Est. {eta} min remaining · scanning listing pages in Dallas metro
        </p>
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
                  key={i}
                  className={cn(
                    "border-b border-border px-4 py-2.5 text-[13px] transition-opacity",
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
            <h2 className="text-card-title">Incoming records</h2>
          </div>
          <ScrollArea className="h-[360px]">
            <div className="divide-y divide-border">
              {liveVehicles.map((v, i) => (
                <Link
                  key={`${v.id}-${i}`}
                  href={`/vehicles/${v.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded border border-border bg-[#fafafa]">
                    <Image src={v.image} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{v.title}</p>
                    <p className="font-mono text-[12px] text-muted-foreground tabular-nums">
                      {formatCurrency(v.price)} · {formatMileage(v.mileage)}
                    </p>
                  </div>
                  <span className="text-label">{v.location.split(",")[0]}</span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
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

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
