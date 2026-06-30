"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PricingIntelligenceView } from "@/components/intelligence/pricing-intelligence-view";
import { PricingVehicleSearch } from "@/components/intelligence/pricing-vehicle-search";
import {
  PricingToolbar,
  DEFAULT_PRICING_FILTERS,
  type PricingFilters,
} from "@/components/intelligence/pricing/pricing-toolbar";
import { getPricingWorkspace } from "@/lib/mock-data/ai-intelligence";
import { getSavedOpportunities } from "@/lib/mock-data/generate-vehicles";

function WorkspaceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 rounded-2xl bg-[#f4f4f5]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[120px] rounded-2xl bg-[#f4f4f5]" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-[#f4f4f5]" />
      <div className="h-64 rounded-2xl bg-[#f4f4f5]" />
    </div>
  );
}

export default function PricingIntelligencePage() {
  const defaultVehicleId = getSavedOpportunities()[0]?.id ?? "";
  const [vehicleId, setVehicleId] = useState(defaultVehicleId);
  const [filters, setFilters] = useState<PricingFilters>(DEFAULT_PRICING_FILTERS);
  const [loading, setLoading] = useState(true);

  const workspace = useMemo(
    () => (vehicleId ? getPricingWorkspace(vehicleId) : null),
    [vehicleId]
  );

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [vehicleId]);

  useEffect(() => {
    if (!workspace) return;
    setFilters((f) => ({
      ...f,
      make: workspace.make,
      model: workspace.model,
      marketplace: workspace.marketplace,
      city: workspace.location.split(",")[0],
    }));
  }, [workspace?.vehicleId]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Pricing Intelligence"
        description="What should we pay for this vehicle, and is it worth buying?"
      >
        <PricingVehicleSearch vehicleId={vehicleId} onVehicleChange={setVehicleId} />
      </PageHeader>

      {!workspace ? (
        <div className="rounded-2xl border border-dashed border-border bg-[#fafafa] px-6 py-16 text-center">
          <p className="text-[15px] font-medium">Search for a vehicle</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Find a listing by make, model, year, or location to view AI pricing analysis.
          </p>
        </div>
      ) : loading ? (
        <WorkspaceSkeleton />
      ) : (
        <div className="space-y-6">
          <PricingToolbar workspace={workspace} filters={filters} onFiltersChange={setFilters} />
          <PricingIntelligenceView workspace={workspace} />
        </div>
      )}
    </div>
  );
}
