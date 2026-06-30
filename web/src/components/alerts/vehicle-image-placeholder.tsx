import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-slate-100 to-slate-200",
  "from-blue-50 to-blue-100",
  "from-emerald-50 to-emerald-100",
  "from-amber-50 to-amber-100",
  "from-violet-50 to-violet-100",
  "from-rose-50 to-rose-100",
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
  const gradient = GRADIENTS[hashSeed(seed) % GRADIENTS.length];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <Car className="h-6 w-6 text-[#64748b]/60" strokeWidth={1.5} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.03] to-transparent" />
    </div>
  );
}
