import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/page-header";
import { RecommendationBadge } from "@/components/shared/status-badge";
import { getVehicleById, getAllVehicles, dedupeVehicles } from "@/lib/mock-data/generate-vehicles";
import { getVehiclePricingIntelligence } from "@/lib/mock-data/intelligence";
import { VehicleIntelligenceSection } from "@/components/intelligence/vehicle-intelligence-section";
import { formatCurrency, formatMileage } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  DataTableCell,
} from "@/components/shared/data-table";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) notFound();

  const similar = dedupeVehicles(
    getAllVehicles().filter(
      (v) =>
        v.make === vehicle.make &&
        v.model === vehicle.model &&
        v.id !== vehicle.id
    )
  ).slice(0, 4);

  const marketDelta = (vehicle.fairMarketValue ?? vehicle.price) - vehicle.price;
  const pricing = getVehiclePricingIntelligence(id);

  return (
    <div className="animate-fade-in">
      <Link
        href="/vehicles"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Vehicles
      </Link>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-page-title">{vehicle.title}</h1>
          <p className="mt-2 text-body text-muted-foreground">
            {vehicle.marketplace} · Found {vehicle.dateFound}
          </p>
          <p className="mt-4 font-mono text-2xl font-semibold tracking-tight tabular-nums">
            {formatCurrency(vehicle.price)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/pricing-intelligence`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Pricing intel
          </Link>
          <button type="button" className={cn(buttonVariants({ size: "sm" }))}>
            Save opportunity
          </button>
        </div>
      </div>

      <VehicleIntelligenceSection vehicleId={id} />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <SectionTitle>Vehicle information</SectionTitle>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <Field label="Mileage" value={formatMileage(vehicle.mileage)} />
              <Field label="Location" value={vehicle.location} />
              <Field label="Body style" value={vehicle.bodyStyle} />
              <Field label="Fuel type" value={vehicle.fuelType} />
              <Field label="Days listed" value={String(vehicle.daysListed)} />
              <Field label="VIN" value={vehicle.vin ?? "—"} mono />
            </dl>
            {vehicle.description && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">{vehicle.description}</p>
            )}
          </section>

          {pricing && (
            <section>
              <SectionTitle>Quick pricing summary</SectionTitle>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatBlock label="Market value" value={formatCurrency(pricing.estimatedMarketValue)} />
                <StatBlock label="Suggested buy" value={formatCurrency(pricing.suggestedPurchasePrice)} />
                <StatBlock label="Expected ROI" value={`${pricing.expectedRoi}%`} highlight />
                <StatBlock label="Gross profit" value={formatCurrency(pricing.expectedGrossProfit)} highlight />
              </div>
            </section>
          )}

          <section>
            <SectionTitle>Price history</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Date</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Price</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {vehicle.priceHistory?.map((p) => (
                  <DataTableRow key={p.date}>
                    <DataTableCell className="font-mono text-muted-foreground">{p.date}</DataTableCell>
                    <DataTableCell align="right" className="font-mono font-medium tabular-nums">
                      {formatCurrency(p.price)}
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>Similar vehicles</SectionTitle>
            <div className="divide-y divide-border border-y border-border">
              {similar.map((v) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${v.id}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{v.title}</p>
                    <p className="text-label">{v.location}</p>
                  </div>
                  <p className="font-mono text-[13px] tabular-nums">{formatCurrency(v.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <p className="text-label">Recommendation</p>
            <div className="mt-2">
              {vehicle.recommendation && <RecommendationBadge recommendation={vehicle.recommendation} />}
            </div>
            <p className="mt-3 text-[13px] text-muted-foreground">
              Listed {marketDelta > 0 ? `${formatCurrency(marketDelta)} below` : "at"} regional average.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <SectionTitle>Seller</SectionTitle>
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{vehicle.seller}</dd>
              </div>
              <div className="flex justify-between capitalize">
                <dt className="text-muted-foreground">Type</dt>
                <dd>{vehicle.sellerType}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-label">{label}</dt>
      <dd className={cn("mt-1 text-[13px] font-medium capitalize text-foreground", mono && "font-mono normal-case")}>
        {value}
      </dd>
    </div>
  );
}

function StatBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-[#fafafa] p-4">
      <p className="text-helper">{label}</p>
      <p className={cn("mt-1.5 font-mono text-[15px] font-semibold tabular-nums", highlight && "text-[#16a34a]")}>
        {value}
      </p>
    </div>
  );
}
