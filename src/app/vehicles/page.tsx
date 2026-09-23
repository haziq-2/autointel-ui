"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { VehicleImage } from "@/components/shared/vehicle-image";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Card } from "@/components/shared/card";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  DataTableCell,
} from "@/components/shared/data-table";
import {
  queryVehicles,
  TOTAL_VEHICLES,
  VEHICLE_MAKES,
  VEHICLE_MARKETPLACES,
} from "@/lib/mock-data/generate-vehicles";
import { formatCurrency, formatMileage } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/lib/types";

const PAGE_SIZE = 50;

export default function VehiclesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("all");
  const [make, setMake] = useState("all");
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"dateFound" | "price" | "opportunityScore">("dateFound");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [search, marketplace, make, status, sortBy, page]);

  const { vehicles, total } = useMemo(
    () =>
      queryVehicles(
        { search, marketplace, make, status, sortBy, sortDir: "desc" },
        page,
        PAGE_SIZE
      ),
    [search, marketplace, make, status, sortBy, page]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="animate-fade-in min-w-0">
      <PageHeader
        title="Vehicles"
        description={`${TOTAL_VEHICLES.toLocaleString()} live listings across ${VEHICLE_MARKETPLACES.length} sources`}
      >
        <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Export
        </button>
      </PageHeader>

      <Card className="mb-5" padding={false}>
        <div className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative min-w-0 flex-1 basis-full sm:min-w-[220px] sm:basis-auto">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search make, model, location..."
              className="h-9 border-transparent bg-surface pl-9 text-[13px] shadow-none transition-all focus-visible:bg-card"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <FilterSelect
            value={marketplace}
            onChange={(v) => { setMarketplace(v); setPage(1); }}
            label="Source"
            options={[
              { value: "all", label: "All sources" },
              ...VEHICLE_MARKETPLACES.map((m) => ({ value: m, label: m })),
            ]}
          />
          <FilterSelect
            value={make}
            onChange={(v) => { setMake(v); setPage(1); }}
            label="Make"
            options={[
              { value: "all", label: "All makes" },
              ...VEHICLE_MAKES.map((m) => ({ value: m, label: m })),
            ]}
          />
          <FilterSelect
            value={status}
            onChange={(v) => { setStatus(v as VehicleStatus | "all"); setPage(1); }}
            label="Status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "new", label: "New" },
              { value: "reviewed", label: "Reviewed" },
              { value: "saved", label: "Saved" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <FilterSelect
            value={sortBy}
            onChange={(v) => setSortBy(v as typeof sortBy)}
            label="Sort"
            options={[
              { value: "dateFound", label: "Date found" },
              { value: "price", label: "Price" },
              { value: "opportunityScore", label: "Opportunity" },
            ]}
          />
        </div>
      </Card>

      {loading ? (
        <TableSkeleton rows={10} cols={9} />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No vehicles found"
          description="Try adjusting your search or filters to find listings across connected marketplaces."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch("");
            setMarketplace("all");
            setMake("all");
            setStatus("all");
            setPage(1);
          }}
        />
      ) : (
        <DataTable maxHeight="calc(100vh - 300px)">
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
              <DataTableHeaderCell align="right" className="w-[6.25rem]">Price</DataTableHeaderCell>
              <DataTableHeaderCell align="right" className="hidden w-[6.5rem] sm:table-cell">Mileage</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden w-[9.5rem] lg:table-cell">Location</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden w-[11.5rem] md:table-cell">Source</DataTableHeaderCell>
              <DataTableHeaderCell className="hidden w-[8rem] xl:table-cell">Found</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {vehicles.map((v) => (
              <DataTableRow key={v.id}>
                <DataTableCell>
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="group flex w-full min-w-0 items-center gap-3"
                  >
                    <VehicleImage
                      title={v.title}
                      bodyStyle={v.bodyStyle}
                      imageUrl={v.imageUrl}
                      className="h-9 w-12 shrink-0 rounded-lg ring-1 ring-border"
                      iconClassName="h-4 w-4"
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground transition-colors group-hover:text-primary">
                      {v.title}
                    </span>
                  </Link>
                </DataTableCell>
                <DataTableCell align="right" className="text-metric whitespace-nowrap text-[13px]">
                  {v.price > 0 ? formatCurrency(v.price) : "—"}
                </DataTableCell>
                <DataTableCell align="right" className="hidden whitespace-nowrap font-mono tabular-nums text-muted-foreground sm:table-cell">
                  {v.mileage > 0 ? formatMileage(v.mileage) : "—"}
                </DataTableCell>
                <DataTableCell className="hidden truncate text-muted-foreground lg:table-cell">{v.location}</DataTableCell>
                <DataTableCell className="hidden truncate text-muted-foreground md:table-cell">{v.marketplace}</DataTableCell>
                <DataTableCell className="hidden whitespace-nowrap font-mono text-muted-foreground tabular-nums xl:table-cell">{v.dateFound}</DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      )}

      {!loading && vehicles.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-helper">
            Showing {from}–{to} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "size-8 p-0")}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[88px] text-center text-[13px] text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "size-8 p-0")}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  const selected = options.find((option) => option.value === value)?.label ?? value;

  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? options[0]?.value ?? "all")}>
      <SelectTrigger className="h-9 w-full min-w-0 max-w-full border-transparent bg-surface text-[13px] shadow-none hover:bg-surface-hover sm:w-auto">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span className="shrink-0 text-border-strong">·</span>
          <span className="truncate text-foreground">{selected}</span>
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
