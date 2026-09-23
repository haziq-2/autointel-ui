const MARKETPLACE_INITIALS: Record<string, string> = {
  facebook: "F",
  craigslist: "CL",
  cargurus: "CG",
};

export function MarketplaceMark({ id, name }: { id: string; name: string }) {
  const initial = MARKETPLACE_INITIALS[id] ?? name.charAt(0);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-[11px] font-semibold text-foreground ring-1 ring-border">
      {initial}
    </div>
  );
}
