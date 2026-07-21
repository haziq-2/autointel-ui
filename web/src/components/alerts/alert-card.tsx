"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Bookmark, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { IntelligenceAlert } from "@/lib/types";
import { ALERT_TYPE_STYLES } from "./alert-config";
import { PriorityBadge } from "./alerts-toolbar";
import { VehicleImagePlaceholder } from "./vehicle-image-placeholder";
import { Sparkline } from "@/components/shared/sparkline";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: IntelligenceAlert;
  index: number;
  onOpen: (alert: IntelligenceAlert) => void;
  onDismiss: (id: string) => void;
  onSave: (id: string) => void;
}

export function AlertCard({ alert, index, onOpen, onDismiss, onSave }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = ALERT_TYPE_STYLES[alert.type];
  const hasVehicle = Boolean(alert.vehicleId);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white transition-colors hover:border-[#dcdcdc]",
        !alert.read ? "border-[#2563eb]/25" : "border-border"
      )}
    >
      {!alert.read && (
        <span className="absolute left-0 top-0 h-full w-1 bg-primary" />
      )}

      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          {hasVehicle && (
            <VehicleImagePlaceholder
              seed={alert.vehicleId!}
              className="hidden h-20 w-28 sm:flex"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  style.badgeClass
                )}
              >
                {style.badge}
              </span>
              <PriorityBadge priority={alert.priority} />
              {!alert.read && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              )}
              <span className="ml-auto text-[11px] text-muted-foreground">{alert.postedAgo}</span>
            </div>

            <button
              type="button"
              onClick={() => onOpen(alert)}
              className="mt-2 text-left"
            >
              <h3 className="text-[15px] font-semibold leading-snug hover:text-primary">
                {alert.title}
              </h3>
            </button>

            <p className="mt-1.5 text-[13px] text-muted-foreground">{alert.aiSummary}</p>

            <AlertTypeBody alert={alert} />

            {(alert.location || alert.marketplace) && (
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                {alert.location && <span>{alert.location}</span>}
                {alert.marketplace && (
                  <>
                    <span>·</span>
                    <span>{alert.marketplace}</span>
                  </>
                )}
              </div>
            )}

            {alert.explanationBullets.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  AI explanation
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {expanded && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 space-y-1 border-l-2 border-[#2563eb]/20 pl-3"
                  >
                    {alert.explanationBullets.map((b) => (
                      <li key={b} className="text-[12px] text-muted-foreground">
                        {b}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <ActionButton icon={Eye} label="View" onClick={() => onOpen(alert)} primary />
          <ActionButton
            icon={Bookmark}
            label={alert.saved ? "Saved" : "Save"}
            onClick={() => onSave(alert.id)}
            active={alert.saved}
          />
          <ActionButton icon={X} label="Dismiss" onClick={() => onDismiss(alert.id)} />
        </div>
      </div>
    </motion.article>
  );
}

function AlertTypeBody({ alert }: { alert: IntelligenceAlert }) {
  const d = alert.data;

  switch (alert.type) {
    case "high_value_opportunity":
      return (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Metric label="Opportunity Score" value={String(alert.opportunityScore)} accent />
          <Metric label="Expected Profit" value={formatCurrency(alert.expectedProfit ?? 0)} green />
          <Metric label="Listed" value={alert.postedAgo} />
        </div>
      );

    case "underpriced":
      return (
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Current Price" value={formatCurrency(Number(d.currentPrice))} />
            <Metric label="Estimated Market" value={formatCurrency(Number(d.marketValue))} />
            <Metric label="Savings" value={formatCurrency(Number(d.savings))} green />
          </div>
          <MiniCompareChart current={Number(d.currentPrice)} market={Number(d.marketValue)} />
        </div>
      );

    case "price_drop": {
      const history = (d.priceHistory as { date: string; price: number }[]) ?? [];
      const spark = history.map((h) => h.price);
      return (
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Previous" value={formatCurrency(Number(d.previousPrice))} />
            <Metric label="Current" value={formatCurrency(Number(d.currentPrice))} accent />
            <Metric label="Reduction" value={formatCurrency(Number(d.reduction))} green />
          </div>
          {spark.length > 1 && (
            <Sparkline data={spark} color="#2563eb" className="h-10 w-24" />
          )}
        </div>
      );
    }

    case "new_match":
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Metric label="Matches" value={String(d.savedSearch)} />
          <Metric label="Posted" value={alert.postedAgo} />
        </div>
      );

    case "high_roi":
      return (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric label="Expected ROI" value={`${d.roi}%`} green />
          <Metric label="Net Profit" value={formatCurrency(Number(d.netProfit))} />
          <Metric label="Expected Sale" value={`${d.expectedSaleDays} Days`} />
        </div>
      );

    case "negotiation":
      return (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric label="Acceptance Probability" value={`${d.acceptanceProbability}%`} accent />
          <Metric label="Recommended Offer" value={formatCurrency(Number(d.recommendedOffer))} />
          <Metric label="Maximum Offer" value={formatCurrency(Number(d.maxOffer))} />
        </div>
      );

    case "market_intel": {
      const trend = (d.trend as number[]) ?? [];
      const chartData = trend.map((v, i) => ({ i, v }));
      return (
        <div className="mt-3 flex items-end gap-4">
          <Metric
            label={String(d.subject ?? alert.title)}
            value={`${d.direction === "up" ? "+" : "-"}${d.change}%`}
            green={d.direction === "up"}
            accent={d.direction !== "up"}
          />
          <span className="text-[12px] text-muted-foreground">{String(d.location)}</span>
          {chartData.length > 0 && (
            <div className="h-10 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#0891b2"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    case "risk":
      if (d.riskType === "repair") {
        return (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50/50 p-3">
            <p className="text-[12px] font-semibold text-red-700">Repair Risk High</p>
            <p className="mt-1 font-mono text-[14px] font-semibold tabular-nums text-red-800">
              Est. Repairs {formatCurrency(Number(d.estimatedRepairs))}
            </p>
          </div>
        );
      }
      return (
        <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50/50 p-3">
          <p className="text-[12px] font-semibold text-orange-700">Holding Time</p>
          <p className="mt-1 text-[13px]">
            <span className="font-mono font-semibold tabular-nums">{String(d.holdingDays)}</span> days · Above
            target ({String(d.targetDays)})
          </p>
        </div>
      );

    default:
      return null;
  }
}

function Metric({
  label,
  value,
  green,
  accent,
}: {
  label: string;
  value: string;
  green?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-[#f8fafc] px-2.5 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-mono text-[13px] font-semibold tabular-nums",
          green && "text-[#16a34a]",
          accent && "text-primary"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MiniCompareChart({ current, market }: { current: number; market: number }) {
  const data = [
    { name: "Listed", value: current, fill: "#16a34a" },
    { name: "Market", value: market, fill: "#94a3b8" },
  ];
  return (
    <div className="h-14 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20}>
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
  active,
}: {
  icon: typeof Eye;
  label: string;
  onClick: () => void;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
        primary
          ? "bg-primary text-white hover:bg-[#1d4ed8]"
          : active
            ? "bg-primary/10 text-primary"
            : "border border-border bg-white text-muted-foreground hover:bg-surface hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
