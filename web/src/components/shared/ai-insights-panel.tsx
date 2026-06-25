import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiInsightsPanelProps {
  insights: string[];
  title?: string;
  className?: string;
}

export function AiInsightsPanel({
  insights,
  title = "AI Insights",
  className,
}: AiInsightsPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-card/80 to-blue-500/5 p-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20">
          <Sparkles className="h-4 w-4 text-cyan-400" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="ml-auto rounded-full bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cyan-400">
          Live
        </span>
      </div>
      <ul className="space-y-2.5">
        {insights.map((insight, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
