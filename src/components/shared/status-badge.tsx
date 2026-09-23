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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11.5px] font-medium",
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

const TINT = {
  info: "bg-[var(--tint-info-bg)] text-[var(--tint-info-fg)]",
  success: "bg-[var(--tint-success-bg)] text-[var(--tint-success-fg)]",
  warning: "bg-[var(--tint-warning-bg)] text-[var(--tint-warning-fg)]",
  danger: "bg-[var(--tint-danger-bg)] text-[var(--tint-danger-fg)]",
  neutral: "bg-[var(--tint-neutral-bg)] text-[var(--tint-neutral-fg)]",
  muted: "bg-[var(--tint-neutral-bg)] text-[var(--tint-muted-fg)]",
} as const;

const jobStyles: Record<JobStatus, string> = {
  running: TINT.info,
  completed: TINT.success,
  paused: TINT.warning,
  failed: TINT.danger,
  scheduled: TINT.neutral,
  idle: TINT.neutral,
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Pill className={jobStyles[status]}>
      <Dot className={status === "running" ? "bg-primary animate-pulse" : "bg-current opacity-60"} />
      <span className="capitalize">{status}</span>
    </Pill>
  );
}

const sourceStyles: Record<SourceStatus, string> = {
  running: TINT.info,
  healthy: TINT.success,
  idle: TINT.neutral,
  paused: TINT.warning,
  degraded: TINT.warning,
  offline: TINT.danger,
  syncing: TINT.info,
};

export function StatusBadge({ status }: { status: SourceStatus }) {
  const label = status === "healthy" ? "Active" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Pill className={sourceStyles[status] ?? sourceStyles.idle}>
      <Dot className={status === "syncing" || status === "running" ? "bg-primary animate-pulse" : "bg-current opacity-60"} />
      {label}
    </Pill>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 85 ? "text-[var(--tint-success-fg)]" : score >= 70 ? "text-foreground" : "text-muted-foreground";
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
  buy_now: TINT.success,
  negotiate: TINT.info,
  monitor: TINT.neutral,
  ignore: TINT.muted,
};

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return <Pill className={recStyles[recommendation]}>{recLabels[recommendation]}</Pill>;
}

const vehicleStatusStyles: Record<VehicleStatus, string> = {
  new: TINT.info,
  reviewed: TINT.neutral,
  saved: TINT.success,
  archived: TINT.muted,
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Pill className={vehicleStatusStyles[status]}>{status}</Pill>;
}

const alertStyles: Record<AlertSeverity, string> = {
  critical: TINT.danger,
  high: TINT.danger,
  medium: TINT.warning,
  low: TINT.neutral,
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
  acquire_immediately: TINT.success,
  strong_candidate: TINT.info,
  monitor: TINT.neutral,
  avoid: TINT.muted,
};

export function AcquisitionRecommendationBadge({ recommendation }: { recommendation: AcquisitionRecommendation }) {
  return <Pill className={acquisitionStyles[recommendation]}>{acquisitionLabels[recommendation]}</Pill>;
}
