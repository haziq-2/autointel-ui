"use client";

import Link from "next/link";
import {
  Bookmark,
  ExternalLink,
  X,
  Clock,
  TrendingDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatMileage } from "@/lib/format";
import type { IntelligenceAlert } from "@/lib/types";
import { getVehicleById } from "@/lib/mock-data/generate-vehicles";
import { INTELLIGENCE_ALERTS } from "@/lib/mock-data/alerts";
import { ALERT_TYPE_STYLES, HIDDEN_ALERT_TYPES } from "./alert-config";
import { VehicleImagePlaceholder } from "./vehicle-image-placeholder";
import { PriorityBadge } from "./alerts-toolbar";

interface AlertDetailDrawerProps {
  alert: IntelligenceAlert | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AlertDetailDrawer({
  alert,
  open,
  onClose,
  onSave,
  onDismiss,
}: AlertDetailDrawerProps) {
  if (!alert) return null;

  const vehicle = alert.vehicleId ? getVehicleById(alert.vehicleId) : null;
  const related = INTELLIGENCE_ALERTS.filter(
    (a) =>
      a.id !== alert.id &&
      !HIDDEN_ALERT_TYPES.includes(a.type) &&
      (alert.relatedAlertIds.includes(a.id) ||
        (a.vehicleId && a.vehicleId === alert.vehicleId))
  ).slice(0, 3);

  const style = ALERT_TYPE_STYLES[alert.type];
  const priceHistory =
    (alert.data.priceHistory as { date: string; price: number }[]) ??
    vehicle?.priceHistory;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()} modal="trap-focus">
      <SheetContent
        className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton
      >
        <SheetHeader className="shrink-0 gap-1 border-b border-border px-5 pb-4 pt-5">
          <div className="flex items-center gap-2 pr-8">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${style.badgeClass}`}>
              {style.badge}
            </span>
            <PriorityBadge priority={alert.priority} />
          </div>
          <SheetTitle className="text-left text-[17px]">{alert.title}</SheetTitle>
          <p className="text-left text-[12px] text-muted-foreground">{alert.postedAgo}</p>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {vehicle && (
            <div className="flex gap-4">
              <VehicleImagePlaceholder seed={vehicle.id} className="h-24 w-32" />
              <div>
                <p className="text-[13px] font-semibold">{vehicle.title}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {formatMileage(vehicle.mileage)} · {vehicle.location}
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">{vehicle.marketplace}</p>
                <p className="mt-2 font-mono text-[18px] font-semibold tabular-nums">
                  {formatCurrency(vehicle.price)}
                </p>
              </div>
            </div>
          )}

          {alert.aiSummary && (
            <p className="text-[13px] leading-relaxed text-muted-foreground">{alert.aiSummary}</p>
          )}

          {priceHistory && priceHistory.length > 1 && (
            <div>
              <h4 className="flex items-center gap-2 text-[13px] font-semibold">
                <TrendingDown className="h-4 w-4 text-primary" />
                Price History
              </h4>
              <div className="mt-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {vehicle && (
            <div>
              <h4 className="flex items-center gap-2 text-[13px] font-semibold">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Vehicle Timeline
              </h4>
              <ul className="mt-2 space-y-2 border-l-2 border-border pl-4">
                <TimelineItem label="Listed" value={`${vehicle.daysListed} days ago`} />
                <TimelineItem label="First indexed" value={vehicle.dateFound} />
                <TimelineItem label="Source" value={vehicle.marketplace} />
                <TimelineItem label="Status" value={vehicle.status} />
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h4 className="text-[13px] font-semibold">Related Alerts</h4>
              <ul className="mt-2 space-y-2">
                {related.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border border-border px-3 py-2 text-[12px]"
                  >
                    <p className="font-medium">{r.title}</p>
                    <p className="text-muted-foreground">{r.postedAgo}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            {vehicle && (
              <Link
                href={`/vehicles/${vehicle.id}`}
                className={buttonVariants({ size: "sm" })}
              >
                View Vehicle
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave(alert.id)}
            >
              <Bookmark className="mr-1.5 h-3.5 w-3.5" />
              {alert.saved ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              View Listing
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDismiss(alert.id);
                onClose();
              }}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Dismiss
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TimelineItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="relative text-[12px]">
      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-2 font-medium">{value}</span>
    </li>
  );
}
