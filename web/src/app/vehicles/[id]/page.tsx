import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { RecommendationBadge, ScoreBadge } from "@/components/shared/status-badge";
import { getVehicleById, getAllVehicles } from "@/lib/mock-data/generate-vehicles";
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

  const similar = getAllVehicles()
    .filter((v) => v.make === vehicle.make && v.id !== vehicle.id)
    .slice(0, 4);

  const marketDelta = (vehicle.fairMarketValue ?? vehicle.price) - vehicle.price;

  return (
    <div>
      <Link
        href="/vehicles"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Vehicles
      </Link>

      <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-md border border-border bg-[#fafafa]">
            <Image src={vehicle.image} alt={vehicle.title} fill className="object-cover" unoptimized priority />
          </div>
          <div className="mb-2 flex gap-2">
            {[vehicle.image].map((src, i) => (
              <div key={i} className="relative h-14 w-20 overflow-hidden rounded border border-border">
                <Image src={src} alt="" fill className="object-cover opacity-80" unoptimized />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-page-title">{vehicle.title}</h1>
            <p className="mt-2 text-body text-muted-foreground">
              {vehicle.marketplace} · Found {vehicle.dateFound}
            </p>
            <p className="mt-4 font-mono text-2xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(vehicle.price)}
            </p>
          </div>
          <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>
            Save opportunity
          </button>
          <div className="rounded-md border border-border p-4">
            <p className="text-label">Acquisition recommendation</p>
            <div className="mt-2">
              {vehicle.recommendation && <RecommendationBadge recommendation={vehicle.recommendation} />}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {vehicle.recommendation === "buy_now" && "Strong margin and demand signals. Prioritize contact."}
              {vehicle.recommendation === "negotiate" && "Viable opportunity. Target 3–5% below asking."}
              {vehicle.recommendation === "monitor" && "Track listing for price movement over 48–72 hours."}
              {vehicle.recommendation === "ignore" && "Limited margin at current price point."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
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
          </section>

          <section>
            <SectionTitle>Price analysis</SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBlock label="Asking price" value={formatCurrency(vehicle.price)} />
              <StatBlock label="Fair market value" value={formatCurrency(vehicle.fairMarketValue ?? 0)} />
              <StatBlock label="Est. resale" value={formatCurrency(vehicle.estimatedResale ?? 0)} />
              <StatBlock
                label="Margin potential"
                value={`+${formatCurrency(vehicle.marginPotential ?? 0)}`}
                highlight={marketDelta > 0}
              />
            </div>
          </section>

          <section>
            <SectionTitle>Market comparison</SectionTitle>
            <p className="text-[13px] text-muted-foreground">
              Listed {marketDelta > 0 ? `${formatCurrency(marketDelta)} below` : "at"} regional market average for {vehicle.year} {vehicle.make} {vehicle.model}.
              Comparable units in {vehicle.location.split(",")[1]?.trim() ?? "region"} average {formatCurrency(vehicle.fairMarketValue ?? vehicle.price)}.
            </p>
          </section>

          <section>
            <SectionTitle>Seller details</SectionTitle>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Seller" value={vehicle.seller} />
              <Field label="Type" value={vehicle.sellerType} />
            </dl>
          </section>

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
                  <div className="relative h-10 w-14 overflow-hidden rounded border border-border">
                    <Image src={v.image} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
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
          <div className="rounded-md border border-border p-5">
            <SectionTitle>AI insights</SectionTitle>
            <div className="mt-4 grid grid-cols-2 gap-4 border-b border-border pb-4">
              <div>
                <p className="text-label">AI score</p>
                <p className="mt-1"><ScoreBadge score={vehicle.aiScore} /></p>
              </div>
              <div>
                <p className="text-label">Opportunity score</p>
                <p className="mt-1"><ScoreBadge score={vehicle.opportunityScore} /></p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              {vehicle.marginPotential && vehicle.marginPotential > 2000
                ? "Pricing indicates acquisition upside relative to market comparables."
                : "Pricing aligns with current market conditions."}
              {vehicle.opportunityScore >= 80 && " Demand velocity supports a short hold period."}
            </p>
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
    <div className="rounded-md border border-border p-3">
      <p className="text-label">{label}</p>
      <p className={cn("mt-1 font-mono text-[15px] font-semibold tabular-nums", highlight && "text-[#16a34a]")}>
        {value}
      </p>
    </div>
  );
}
