import { OPPORTUNITY_LABEL_DISPLAY } from "@/lib/mock-data/ai-intelligence";
import type { OpportunityLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OpportunityLabelBadge({ label, className }: { label: OpportunityLabel; className?: string }) {
  const meta = OPPORTUNITY_LABEL_DISPLAY[label];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium",
        meta.className,
        className
      )}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
