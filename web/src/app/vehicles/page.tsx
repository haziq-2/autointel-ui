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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Car } from "lucide-react";
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
    <div className="animate-fade-in">
      <PageHeader
        title="Vehicles"
        description={`${TOTAL_VEHICLES.toLocaleString()} live listings from Facebook Marketplace`}
      >
        <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Export
        </button>
      </PageHeader>

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search make, model, location..."
              className="h-8 rounded-lg border-border/60 bg-surface pl-9 text-[13px] shadow-none transition-all focus-visible:border-primary/40 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/15"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <FilterSelect value={marketplace} onChange={(v) => { setMarketplace(v); setPage(1); }} label="Source" width="w-[168px]">
            <SelectItem value="all">All sources</SelectItem>
            {VEHICLE_MARKETPLACES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </FilterSelect>
          <FilterSelect value={make} onChange={(v) => { setMake(v); setPage(1); }} label="Make" width="w-[128px]">
            <SelectItem value="all">All makes</SelectItem>
            {VEHICLE_MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </FilterSelect>
          <FilterSelect value={status} onChange={(v) => { setStatus(v as VehicleStatus | "all"); setPage(1); }} label="Status" width="w-[128px]">
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="saved">Saved</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </FilterSelect>
          <FilterSelect value={sortBy} onChange={(v) => setSortBy(v as typeof sortBy)} label="Sort" width="w-[148px]">
            <SelectItem value="dateFound">Date found</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="opportunityScore">Opportunity</SelectItem>
          </FilterSelect>
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
              <DataTableHeaderCell>
                <span className="inline-flex items-center gap-1.5">
                  Vehicle
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </span>
              </DataTableHeaderCell>
              <DataTableHeaderCell>Year</DataTableHeaderCell>
              <DataTableHeaderCell>Make</DataTableHeaderCell>
              <DataTableHeaderCell>Model</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Price</DataTableHeaderCell>
              <DataTableHeaderCell align="right">Mileage</DataTableHeaderCell>
              <DataTableHeaderCell>Location</DataTableHeaderCell>
              <DataTableHeaderCell>Source</DataTableHeaderCell>
              <DataTableHeaderCell>Found</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {vehicles.map((v) => (
              <DataTableRow key={v.id}>
                <DataTableCell>
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="group flex items-center gap-3"
                  >
                    <VehicleImage
                      title={v.title}
                      bodyStyle={v.bodyStyle}
                      imageUrl={v.imageUrl}
                      className="h-9 w-12 shrink-0 rounded-md border border-border"
                      iconClassName="h-4 w-4"
                    />
                    <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                      {v.title}
                    </span>
                  </Link>
                </DataTableCell>
                <DataTableCell className="font-mono tabular-nums text-muted-foreground">{v.year}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{v.make}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{v.model}</DataTableCell>
                <DataTableCell align="right" className="font-mono font-medium tabular-nums">{formatCurrency(v.price)}</DataTableCell>
                <DataTableCell align="right" className="font-mono tabular-nums text-muted-foreground">{formatMileage(v.mileage)}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{v.location}</DataTableCell>
                <DataTableCell className="text-muted-foreground">{v.marketplace}</DataTableCell>
                <DataTableCell className="font-mono text-muted-foreground tabular-nums">{v.dateFound}</DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      )}

      {!loading && vehicles.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-helper">
            Showing {from}–{to} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 w-8 p-0")}
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
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 w-8 p-0")}
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
  width,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "all")}>
      <SelectTrigger className={cn("h-8 rounded-lg border-border bg-card text-[13px] shadow-none", width)}>
        <span className="flex w-full items-center gap-1.5 overflow-hidden">
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span className="shrink-0 text-border">·</span>
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
