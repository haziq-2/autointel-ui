"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateVin } from "@/lib/vin/validation";
import { decodeVin } from "@/lib/vin/client";
import type { DecodedVehicle } from "@/lib/vin/types";
import { VinVehicleDetails } from "./vin-vehicle-details";
import { cn } from "@/lib/utils";

interface VinLookupFormProps {
  initialVin?: string;
  className?: string;
}

export function VinLookupForm({ initialVin = "", className }: VinLookupFormProps) {
  const [vin, setVin] = useState(initialVin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicle | null>(null);

  const validation = useMemo(() => validateVin(vin), [vin]);
  const canSubmit = validation.valid && !loading;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validation.valid || !validation.normalized) return;

    setLoading(true);
    setError(null);

    try {
      const decoded = await decodeVin(validation.normalized);
      setVehicle(decoded);
    } catch (err) {
      setVehicle(null);
      setError(err instanceof Error ? err.message : "Unable to decode VIN.");
    } finally {
      setLoading(false);
    }
  }

  function handleVinChange(value: string) {
    const normalized = value.toUpperCase().replace(/\s+/g, "");
    setVin(normalized);
    if (error) setError(null);
  }

  return (
    <div className={cn("space-y-6", className)}>
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5">
        <label htmlFor="vin-input" className="text-[13px] font-semibold">
          Vehicle identification number
        </label>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Enter a 17-character VIN. Letters I, O, and Q are not valid.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            id="vin-input"
            value={vin}
            onChange={(event) => handleVinChange(event.target.value)}
            placeholder="1HGCM82633A004352"
            maxLength={17}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={vin.length > 0 && !validation.valid}
            className="h-10 font-mono text-[14px] tracking-wide uppercase"
          />
          <Button type="submit" disabled={!canSubmit} className="h-10 shrink-0 sm:px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Decode VIN
              </>
            )}
          </Button>
        </div>

        {vin.length > 0 && !validation.valid && (
          <p className="mt-3 text-[12px] text-[#dc2626]" role="alert">
            {validation.message}
          </p>
        )}

        {error && (
          <p className="mt-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#dc2626]" role="alert">
            {error}
          </p>
        )}
      </form>

      {loading && !vehicle && (
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-[13px] text-muted-foreground">Decoding vehicle information...</p>
        </div>
      )}

      {vehicle && !loading && <VinVehicleDetails vehicle={vehicle} />}
    </div>
  );
}
