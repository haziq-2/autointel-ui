"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { ScoreBadge, VehicleStatusBadge } from "@/components/shared/status-badge";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  DataTableCell,
} from "@/components/shared/data-table";
import { queryVehicles, TOTAL_VEHICLES } from "@/lib/mock-data/generate-vehicles";
import { formatCurrency, formatMileage } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MARKETPLACES } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/lib/types";

const PAGE_SIZE = 50;
const MAKES = ["Ford", "Toyota", "Honda", "Chevrolet", "Ram", "Tesla", "BMW", "Jeep"];

export default function VehiclesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState("all");
  const [make, setMake] = useState("all");
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"dateFound" | "price" | "opportunityScore">("dateFound");

  const { vehicles, total } = useMemo(
    () =>
      queryVehicles(
        { search, marketplace, make, status, sortBy, sortDir: "desc" },
        page,
        PAGE_SIZE
      ),
    [search, marketplace, make, status, sortBy, page]
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <PageHeader
        title="Vehicles"
        description={`${TOTAL_VEHICLES.toLocaleString()} records indexed`}
      >
        <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Export
        </button>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search make, model, location..."
            className="h-8 border-border bg-white pl-8 text-[13px] shadow-none"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <FilterSelect value={marketplace} onChange={(v) => { setMarketplace(v); setPage(1); }} placeholder="Source" width="w-[148px]">
          <SelectItem value="all">All sources</SelectItem>
          {MARKETPLACES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </FilterSelect>
        <FilterSelect value={make} onChange={(v) => { setMake(v); setPage(1); }} placeholder="Make" width="w-[108px]">
          <SelectItem value="all">All makes</SelectItem>
          {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </FilterSelect>
        <FilterSelect value={status} onChange={(v) => { setStatus(v as VehicleStatus | "all"); setPage(1); }} placeholder="Status" width="w-[108px]">
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="reviewed">Reviewed</SelectItem>
          <SelectItem value="saved">Saved</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </FilterSelect>
        <FilterSelect value={sortBy} onChange={(v) => setSortBy(v as typeof sortBy)} placeholder="Sort" width="w-[128px]">
          <SelectItem value="dateFound">Date found</SelectItem>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="opportunityScore">Opportunity</SelectItem>
        </FilterSelect>
      </div>

      <DataTable maxHeight="calc(100vh - 320px)">
        <DataTableHead>
          <tr>
            <DataTableHeaderCell>
              <span className="inline-flex items-center gap-1">Vehicle <ArrowUpDown className="h-3 w-3 opacity-40" /></span>
            </DataTableHeaderCell>
            <DataTableHeaderCell>Year</DataTableHeaderCell>
            <DataTableHeaderCell>Make</DataTableHeaderCell>
            <DataTableHeaderCell>Model</DataTableHeaderCell>
            <DataTableHeaderCell align="right">Price</DataTableHeaderCell>
            <DataTableHeaderCell align="right">Mileage</DataTableHeaderCell>
            <DataTableHeaderCell>Location</DataTableHeaderCell>
            <DataTableHeaderCell>Source</DataTableHeaderCell>
            <DataTableHeaderCell>Found</DataTableHeaderCell>
            <DataTableHeaderCell align="right">AI</DataTableHeaderCell>
            <DataTableHeaderCell align="right">Opp</DataTableHeaderCell>
            <DataTableHeaderCell>Status</DataTableHeaderCell>
          </tr>
        </DataTableHead>
        <tbody>
          {vehicles.map((v) => (
            <DataTableRow key={v.id}>
              <DataTableCell>
                <Link href={`/vehicles/${v.id}`} className="font-medium text-foreground hover:underline">
                  {v.title}
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
              <DataTableCell align="right"><ScoreBadge score={v.aiScore} /></DataTableCell>
              <DataTableCell align="right"><ScoreBadge score={v.opportunityScore} /></DataTableCell>
              <DataTableCell><VehicleStatusBadge status={v.status} /></DataTableCell>
            </DataTableRow>
          ))}
        </tbody>
      </DataTable>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="text-label">
          {from}–{to} of {total.toLocaleString()}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 px-2")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[80px] text-center text-label">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 px-2")}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  width,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "all")}>
      <SelectTrigger className={cn("h-8 border-border text-[13px] shadow-none", width)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
