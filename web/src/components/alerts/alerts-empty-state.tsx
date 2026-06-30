"use client";

import { BellOff } from "lucide-react";

export function AlertsEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[#fafafa] px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card">
        <BellOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold">No alerts match your filters</h3>
      <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
        Try adjusting your search, date range, or category to see more acquisition signals.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-lg bg-[#2563eb] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#1d4ed8]"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
