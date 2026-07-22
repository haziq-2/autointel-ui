"use client";

import { BellOff } from "lucide-react";

export function AlertsEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-8 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary-soft text-primary shadow-card">
        <BellOff className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold">No alerts match your filters</h3>
      <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
        Try adjusting your search, date range, or category to see more acquisition signals.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
