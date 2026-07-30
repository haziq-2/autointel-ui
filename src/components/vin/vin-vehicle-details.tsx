"use client";

import type { DecodedVehicle } from "@/lib/vin/types";
import { cn } from "@/lib/utils";

const DETAIL_FIELDS: { key: keyof DecodedVehicle; label: string }[] = [
  { key: "year", label: "Year" },
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "trim", label: "Trim" },
  { key: "engine", label: "Engine" },
  { key: "transmission", label: "Transmission" },
  { key: "fuelType", label: "Fuel type" },
  { key: "bodyStyle", label: "Body style" },
  { key: "manufacturer", label: "Manufacturer" },
];

interface VinVehicleDetailsProps {
  vehicle: DecodedVehicle;
  className?: string;
}

export function VinVehicleDetails({ vehicle, className }: VinVehicleDetailsProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-card", className)}>
      <div className="border-b border-border px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Decoded vehicle
        </p>
        <h3 className="mt-1 text-[18px] font-semibold tracking-tight">
          {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle details"}
        </h3>
        <p className="mt-1 font-mono text-[12px] text-muted-foreground">{vehicle.vin}</p>
      </div>

      <dl className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        {DETAIL_FIELDS.map(({ key, label }) => {
          const value = vehicle[key];
          if (!value) return null;
          return (
            <div key={key}>
              <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-[13px] font-medium capitalize text-foreground">{value}</dd>
            </div>
          );
        })}
        {vehicle.driveType && (
          <div>
            <dt className="text-[11px] font-medium text-muted-foreground">Drive type</dt>
            <dd className="mt-1 text-[13px] font-medium uppercase text-foreground">{vehicle.driveType}</dd>
          </div>
        )}
        {vehicle.plant && (
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-medium text-muted-foreground">Assembly plant</dt>
            <dd className="mt-1 text-[13px] font-medium text-foreground">{vehicle.plant}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
