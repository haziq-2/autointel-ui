"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  ExternalLink,
  X,
  Sparkles,
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
import {
  getVehicleOpportunityIntel,
  getNegotiationIntel,
  getPricingIntelExtended,
} from "@/lib/mock-data/ai-intelligence";
import { INTELLIGENCE_ALERTS } from "@/lib/mock-data/alerts";
import { ScoreRing } from "@/components/intelligence/score-ring";
import { ALERT_TYPE_STYLES } from "./alert-config";
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
  const opportunity = alert.vehicleId ? getVehicleOpportunityIntel(alert.vehicleId) : null;
  const negotiation = alert.vehicleId ? getNegotiationIntel(alert.vehicleId) : null;
  const pricing = alert.vehicleId ? getPricingIntelExtended(alert.vehicleId) : null;
  const related = INTELLIGENCE_ALERTS.filter(
    (a) =>
      a.id !== alert.id &&
      (alert.relatedAlertIds.includes(a.id) ||
        (a.vehicleId && a.vehicleId === alert.vehicleId))
  ).slice(0, 3);

  const style = ALERT_TYPE_STYLES[alert.type];
  const priceHistory =
    (alert.data.priceHistory as { date: string; price: number }[]) ??
    vehicle?.priceHistory ??
    pricing?.priceTrend.map((p) => ({ date: p.month, price: p.price }));

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

          <div className="rounded-xl bg-[#f8fafc] p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#2563eb]" />
              <p className="text-[12px] font-semibold">AI Summary</p>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{alert.aiSummary}</p>
          </div>

          {opportunity && (
            <div className="flex items-center gap-4 rounded-xl border border-border p-4">
              <ScoreRing score={opportunity.score} size={72} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Opportunity Score
                </p>
                <p className="font-mono text-[22px] font-semibold tabular-nums">
                  {opportunity.score}
                  <span className="text-[14px] text-muted-foreground"> / 100</span>
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {opportunity.confidence}% confidence
                </p>
              </div>
            </div>
          )}

          {pricing && vehicle && (
            <div className="grid grid-cols-2 gap-3">
              <DrawerMetric label="Market Value" value={formatCurrency(pricing.marketValue)} />
              <DrawerMetric label="Expected Profit" value={formatCurrency(pricing.expectedGrossProfit)} green />
              <DrawerMetric label="Recommended Buy" value={formatCurrency(pricing.recommendedPurchase)} />
              <DrawerMetric label="Max Purchase" value={formatCurrency(pricing.maxPurchase)} />
            </div>
          )}

          {negotiation && (
            <div>
              <h4 className="text-[13px] font-semibold">Negotiation Recommendation</h4>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <DrawerMetric label="First Offer" value={formatCurrency(negotiation.firstOffer)} />
                <DrawerMetric
                  label="Acceptance Probability"
                  value={`${negotiation.acceptanceProbability}%`}
                  accent
                />
                <DrawerMetric label="Max Offer" value={formatCurrency(negotiation.maxOffer)} />
                <DrawerMetric label="Difficulty" value={negotiation.difficulty} />
              </div>
              <ul className="mt-3 space-y-1">
                {negotiation.reasoningBullets.map((b) => (
                  <li key={b} className="text-[12px] text-muted-foreground">
                    · {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {alert.explanationBullets.length > 0 && (
            <div>
              <h4 className="text-[13px] font-semibold">AI Explanation</h4>
              <ul className="mt-2 space-y-1.5">
                {alert.explanationBullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[12px] text-muted-foreground">
                    <span className="text-[#2563eb]">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {priceHistory && priceHistory.length > 1 && (
            <div>
              <h4 className="flex items-center gap-2 text-[13px] font-semibold">
                <TrendingDown className="h-4 w-4 text-[#2563eb]" />
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

          {pricing && pricing.comparables.length > 0 && (
            <div>
              <h4 className="text-[13px] font-semibold">Comparable Vehicles</h4>
              <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
                {pricing.comparables.slice(0, 4).map((c) => (
                  <li key={c.id} className="flex items-center justify-between px-3 py-2.5 text-[12px]">
                    <div>
                      <p className="font-medium">{c.vehicle}</p>
                      <p className="text-muted-foreground">
                        {c.year} · {formatMileage(c.mileage)} · {c.distance}
                      </p>
                    </div>
                    <p className="font-mono font-semibold tabular-nums">{formatCurrency(c.price)}</p>
                  </li>
                ))}
              </ul>
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

function DrawerMetric({
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
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={`mt-0.5 font-mono text-[14px] font-semibold tabular-nums ${
          green ? "text-[#16a34a]" : accent ? "text-[#2563eb]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TimelineItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="relative text-[12px]">
      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#2563eb]" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-2 font-medium">{value}</span>
    </li>
  );
}
