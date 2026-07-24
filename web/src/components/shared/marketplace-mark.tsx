const MARKETPLACE_INITIALS: Record<string, string> = {
  facebook: "F",
  craigslist: "CL",
  cargurus: "CG",
};

export function MarketplaceMark({ id, name }: { id: string; name: string }) {
  const initial = MARKETPLACE_INITIALS[id] ?? name.charAt(0);
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface text-[10px] font-semibold text-foreground">
      {initial}
    </div>
  );
}
