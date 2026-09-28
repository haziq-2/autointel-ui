"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  VEHICLE_BODY_STYLES,
  VEHICLE_FUELS,
  VEHICLE_MAKES,
  VEHICLE_MARKETPLACES,
  VEHICLE_YEAR_MAX,
  VEHICLE_YEAR_MIN,
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

const YEAR_OPTIONS = Array.from(
  { length: VEHICLE_YEAR_MAX - VEHICLE_YEAR_MIN + 1 },
  (_, index) => VEHICLE_YEAR_MAX - index
);

const SORT_OPTIONS = [
  { value: "dateFound:desc", label: "Newest found" },
  { value: "dateFound:asc", label: "Oldest found" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
  { value: "year:desc", label: "Year: newest" },
  { value: "year:asc", label: "Year: oldest" },
  { value: "mileage:asc", label: "Mileage: low to high" },
  { value: "mileage:desc", label: "Mileage: high to low" },
  { value: "opportunityScore:desc", label: "Opportunity" },
] as const;

const MILEAGE_OPTIONS = [
  { value: "all", label: "Any mileage" },
  { value: "30000", label: "Under 30k mi" },
  { value: "60000", label: "Under 60k mi" },
  { value: "100000", label: "Under 100k mi" },
  { value: "150000", label: "Under 150k mi" },
  { value: "150000+", label: "150k+ mi" },
];

function parseMoney(value: string): number | undefined {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return Number(digits);
}

function moneyParam(value: string | null): string {
  if (!value) return "";
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? String(Math.round(n)) : "";
}

export default function VehiclesPage() {
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => params.get("search") ?? "");
  const [marketplace, setMarketplace] = useState(() => params.get("marketplace") ?? "all");
  const [make, setMake] = useState(() => params.get("make") ?? "all");
  const [bodyStyle, setBodyStyle] = useState(() => params.get("bodyStyle") ?? "all");
  const [fuelType, setFuelType] = useState(() => params.get("fuelType") ?? "all");
  const [sellerType, setSellerType] = useState(() => params.get("sellerType") ?? "all");
  const [status, setStatus] = useState<VehicleStatus | "all">(() => (params.get("status") as VehicleStatus) ?? "all");
  const [minYear, setMinYear] = useState(() => params.get("minYear") ?? "all");
  const [maxYear, setMaxYear] = useState(() => params.get("maxYear") ?? "all");
  const [mileage, setMileage] = useState("all");
  const [sort, setSort] = useState(() => {
    const by = params.get("sortBy") ?? "dateFound";
    const dir = params.get("sortDir") ?? "desc";
    const value = `${by}:${dir}`;
    return SORT_OPTIONS.some((option) => option.value === value) ? value : "dateFound:desc";
  });
  const [minPriceText, setMinPriceText] = useState(() => moneyParam(params.get("minPrice")));
  const [maxPriceText, setMaxPriceText] = useState(() => moneyParam(params.get("maxPrice")));
  const [minPrice, setMinPrice] = useState<number | undefined>(() => parseMoney(moneyParam(params.get("minPrice"))));
  const [maxPrice, setMaxPrice] = useState<number | undefined>(() => parseMoney(moneyParam(params.get("maxPrice"))));
  const [loading, setLoading] = useState(true);
  const priceReady = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinPrice(parseMoney(minPriceText));
      setMaxPrice(parseMoney(maxPriceText));
      if (priceReady.current) setPage(1);
      priceReady.current = true;
    }, 250);
    return () => clearTimeout(timer);
  }, [minPriceText, maxPriceText]);

  const [sortBy, sortDir] = sort.split(":") as [
    "dateFound" | "price" | "year" | "mileage" | "opportunityScore",
    "asc" | "desc",
  ];
  const mileageMax = mileage.endsWith("+") ? undefined : mileage === "all" ? undefined : Number(mileage);
  const mileageMin = mileage.endsWith("+") ? Number(mileage.replace("+", "")) : undefined;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [search, marketplace, make, bodyStyle, fuelType, sellerType, status, sort, minYear, maxYear, mileage, minPrice, maxPrice, page]);

  const { vehicles, total } = useMemo(
    () =>
      queryVehicles(
        {
          search,
          marketplace,
          make,
          bodyStyle,
          fuelType,
          sellerType,
          status,
          sortBy,
          sortDir,
          minPrice,
          maxPrice,
          minYear: minYear === "all" ? undefined : Number(minYear),
          maxYear: maxYear === "all" ? undefined : Number(maxYear),
          minMileage: mileageMin,
          maxMileage: mileageMax,
        },
        page,
        PAGE_SIZE
      ),
    [search, marketplace, make, bodyStyle, fuelType, sellerType, status, sortBy, sortDir, minPrice, maxPrice, minYear, maxYear, mileageMin, mileageMax, page]
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
            value={bodyStyle}
            onChange={(v) => { setBodyStyle(v); setPage(1); }}
            label="Body"
            options={[
              { value: "all", label: "All bodies" },
              ...VEHICLE_BODY_STYLES.map((style) => ({ value: style, label: style })),
            ]}
          />
          <FilterSelect
            value={fuelType}
            onChange={(v) => { setFuelType(v); setPage(1); }}
            label="Fuel"
            options={[
              { value: "all", label: "All fuels" },
              ...VEHICLE_FUELS.map((fuel) => ({ value: fuel, label: fuel })),
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
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-3">
          <Input
            inputMode="numeric"
            aria-label="Minimum price"
            placeholder="Min price"
            className="h-9 w-full border-transparent bg-surface text-[13px] shadow-none sm:w-[7.5rem]"
            value={minPriceText}
            onChange={(e) => setMinPriceText(e.target.value)}
          />
          <Input
            inputMode="numeric"
            aria-label="Maximum price"
            placeholder="Max price"
            className="h-9 w-full border-transparent bg-surface text-[13px] shadow-none sm:w-[7.5rem]"
            value={maxPriceText}
            onChange={(e) => setMaxPriceText(e.target.value)}
          />
          <FilterSelect
            value={minYear}
            onChange={(v) => { setMinYear(v); setPage(1); }}
            label="Year from"
            options={[
              { value: "all", label: "Any" },
              ...YEAR_OPTIONS.map((year) => ({ value: String(year), label: String(year) })),
            ]}
          />
          <FilterSelect
            value={maxYear}
            onChange={(v) => { setMaxYear(v); setPage(1); }}
            label="Year to"
            options={[
              { value: "all", label: "Any" },
              ...YEAR_OPTIONS.map((year) => ({ value: String(year), label: String(year) })),
            ]}
          />
          <FilterSelect
            value={mileage}
            onChange={(v) => { setMileage(v); setPage(1); }}
            label="Mileage"
            options={MILEAGE_OPTIONS}
          />
          <FilterSelect
            value={sellerType}
            onChange={(v) => { setSellerType(v); setPage(1); }}
            label="Seller"
            options={[
              { value: "all", label: "Anyone" },
              { value: "dealer", label: "Dealer" },
              { value: "private", label: "Private" },
              { value: "auction", label: "Auction" },
            ]}
          />
          <FilterSelect
            value={sort}
            onChange={(v) => { setSort(v); setPage(1); }}
            label="Sort"
            options={[...SORT_OPTIONS]}
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
            setBodyStyle("all");
            setFuelType("all");
            setSellerType("all");
            setStatus("all");
            setMinYear("all");
            setMaxYear("all");
            setMileage("all");
            setSort("dateFound:desc");
            setMinPriceText("");
            setMaxPriceText("");
            setPage(1);
          }}
        />
      ) : (
        <DataTable maxHeight="calc(100vh - 380px)">
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
