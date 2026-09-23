import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

const TINTS = [
  "var(--chart-8)",
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-6)",
  "var(--chart-5)",
];

function hashSeed(id: string) {
  return id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
}

export function VehicleImagePlaceholder({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const tint = TINTS[hashSeed(seed) % TINTS.length];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border",
        className
      )}
      style={{
        background: `linear-gradient(140deg, color-mix(in oklab, ${tint} 14%, var(--card)) 0%, color-mix(in oklab, ${tint} 6%, var(--card)) 100%)`,
      }}
    >
      <Car className="h-6 w-6 opacity-45" style={{ color: tint }} strokeWidth={1.5} />
    </div>
  );
}
