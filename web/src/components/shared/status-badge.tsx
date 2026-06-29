import { cn } from "@/lib/utils";
import type { JobStatus, SourceStatus, Recommendation, VehicleStatus, AlertSeverity, AcquisitionRecommendation } from "@/lib/types";

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("h-1.5 w-1.5 rounded-full", className)} />;
}

const jobStyles: Record<JobStatus, string> = {
  running: "bg-[#eff6ff] text-[#1d4ed8]",
  completed: "bg-[#f0fdf4] text-[#15803d]",
  paused: "bg-[#fffbeb] text-[#b45309]",
  failed: "bg-[#fef2f2] text-[#dc2626]",
  scheduled: "bg-[#f4f4f5] text-[#6b7280]",
  idle: "bg-[#f4f4f5] text-[#6b7280]",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Pill className={jobStyles[status]}>
      <Dot className={status === "running" ? "bg-[#2563eb] animate-pulse" : "bg-current opacity-60"} />
      <span className="capitalize">{status}</span>
    </Pill>
  );
}

const sourceStyles: Record<SourceStatus, string> = {
  running: "bg-[#eff6ff] text-[#1d4ed8]",
  healthy: "bg-[#f0fdf4] text-[#15803d]",
  idle: "bg-[#f4f4f5] text-[#6b7280]",
  paused: "bg-[#fffbeb] text-[#b45309]",
  degraded: "bg-[#fffbeb] text-[#b45309]",
  offline: "bg-[#fef2f2] text-[#dc2626]",
  syncing: "bg-[#eff6ff] text-[#1d4ed8]",
};

export function StatusBadge({ status }: { status: SourceStatus }) {
  const label = status === "healthy" ? "Active" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Pill className={sourceStyles[status] ?? sourceStyles.idle}>
      <Dot className={status === "syncing" || status === "running" ? "bg-[#2563eb] animate-pulse" : "bg-current opacity-60"} />
      {label}
    </Pill>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 85 ? "text-[#15803d]" : score >= 70 ? "text-foreground" : "text-muted-foreground";
  return (
    <span className={cn("font-mono text-[12px] font-medium tabular-nums", tone)}>
      {score}
    </span>
  );
}

const recLabels: Record<Recommendation, string> = {
  buy_now: "Buy now",
  negotiate: "Negotiate",
  monitor: "Monitor",
  ignore: "Ignore",
};

const recStyles: Record<Recommendation, string> = {
  buy_now: "bg-[#f0fdf4] text-[#15803d]",
  negotiate: "bg-[#eff6ff] text-[#1d4ed8]",
  monitor: "bg-[#f4f4f5] text-[#6b7280]",
  ignore: "bg-[#fef2f2] text-[#9ca3af]",
};

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return <Pill className={recStyles[recommendation]}>{recLabels[recommendation]}</Pill>;
}

const vehicleStatusStyles: Record<VehicleStatus, string> = {
  new: "bg-[#eff6ff] text-[#1d4ed8]",
  reviewed: "bg-[#f4f4f5] text-[#6b7280]",
  saved: "bg-[#f0fdf4] text-[#15803d]",
  archived: "bg-[#f4f4f5] text-[#9ca3af]",
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Pill className={vehicleStatusStyles[status]}>{status}</Pill>;
}

const alertStyles: Record<AlertSeverity, string> = {
  critical: "bg-[#fef2f2] text-[#dc2626]",
  high: "bg-[#fef2f2] text-[#dc2626]",
  medium: "bg-[#fffbeb] text-[#b45309]",
  low: "bg-[#f4f4f5] text-[#6b7280]",
};

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Pill className={alertStyles[severity]}>
      <Dot className="bg-current opacity-60" />
      <span className="capitalize">{severity}</span>
    </Pill>
  );
}

const acquisitionLabels: Record<AcquisitionRecommendation, string> = {
  acquire_immediately: "Acquire immediately",
  strong_candidate: "Strong candidate",
  monitor: "Monitor",
  avoid: "Avoid",
};

const acquisitionStyles: Record<AcquisitionRecommendation, string> = {
  acquire_immediately: "bg-[#f0fdf4] text-[#15803d]",
  strong_candidate: "bg-[#eff6ff] text-[#1d4ed8]",
  monitor: "bg-[#f4f4f5] text-[#6b7280]",
  avoid: "bg-[#fef2f2] text-[#9ca3af]",
};

export function AcquisitionRecommendationBadge({ recommendation }: { recommendation: AcquisitionRecommendation }) {
  return <Pill className={acquisitionStyles[recommendation]}>{acquisitionLabels[recommendation]}</Pill>;
}
