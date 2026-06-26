import { cn } from "@/lib/utils";
import type { JobStatus, SourceStatus, Recommendation, VehicleStatus, AlertSeverity, AcquisitionRecommendation } from "@/lib/types";

function Dot({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", className)} />;
}

const jobDot: Record<JobStatus, string> = {
  running: "bg-[#111827]",
  completed: "bg-[#16a34a]",
  paused: "bg-[#d97706]",
  failed: "bg-[#dc2626]",
  scheduled: "bg-[#9ca3af]",
  idle: "bg-[#9ca3af]",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-table text-foreground">
      <Dot className={jobDot[status]} />
      <span className="capitalize">{status}</span>
    </span>
  );
}

const sourceDot: Record<SourceStatus, string> = {
  running: "bg-[#111827]",
  healthy: "bg-[#16a34a]",
  idle: "bg-[#9ca3af]",
  paused: "bg-[#d97706]",
  degraded: "bg-[#d97706]",
  offline: "bg-[#dc2626]",
  syncing: "bg-[#111827] animate-pulse",
};

export function StatusBadge({ status }: { status: SourceStatus }) {
  const dot = sourceDot[status] ?? sourceDot.idle;
  const label = status === "healthy" ? "Active" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className="inline-flex items-center gap-1.5 text-table text-foreground">
      <Dot className={dot} />
      {label}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="font-mono text-table font-medium tabular-nums text-foreground">
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

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return (
    <span className="text-table font-medium text-foreground">
      {recLabels[recommendation]}
    </span>
  );
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span className="text-table capitalize text-muted-foreground">{status}</span>
  );
}

const alertDot: Record<AlertSeverity, string> = {
  critical: "bg-[#dc2626]",
  high: "bg-[#dc2626]",
  medium: "bg-[#d97706]",
  low: "bg-[#9ca3af]",
};

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-table capitalize text-foreground">
      <Dot className={alertDot[severity]} />
      {severity}
    </span>
  );
}

const acquisitionLabels: Record<AcquisitionRecommendation, string> = {
  acquire_immediately: "Acquire immediately",
  strong_candidate: "Strong candidate",
  monitor: "Monitor",
  avoid: "Avoid",
};

export function AcquisitionRecommendationBadge({ recommendation }: { recommendation: AcquisitionRecommendation }) {
  return (
    <span className="text-table font-medium text-foreground">
      {acquisitionLabels[recommendation]}
    </span>
  );
}
