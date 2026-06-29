import { Sparkles } from "lucide-react";
import type { AiInsight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "./card";

interface AiInsightsPanelProps {
  insights: AiInsight[] | string[];
  title?: string;
  className?: string;
}

function isStructured(insight: AiInsight | string): insight is AiInsight {
  return typeof insight === "object";
}

export function AiInsightsPanel({
  insights,
  title = "AI Insights",
  className,
}: AiInsightsPanelProps) {
  return (
    <Card className={cn("sticky top-20", className)}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#eff6ff]">
          <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" strokeWidth={1.75} />
        </div>
        <h3 className="text-card-title font-medium">{title}</h3>
      </div>
      <div className="space-y-5">
        {insights.map((insight, i) =>
          isStructured(insight) ? (
            <div key={i} className="border-t border-border pt-5 first:border-0 first:pt-0">
              <p className="text-[13px] font-medium leading-snug text-foreground">{insight.what}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{insight.why}</p>
              <div className="mt-3 space-y-1.5">
                <p className="text-[12px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">Impact</span> — {insight.impact}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">Action</span> — {insight.action}
                </p>
              </div>
              <div className="mt-3 inline-flex items-center rounded-md bg-[#fafafa] px-2 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {insight.confidence}% confidence
              </div>
            </div>
          ) : (
            <p key={i} className="text-[13px] leading-relaxed text-muted-foreground">
              {insight}
            </p>
          )
        )}
      </div>
    </Card>
  );
}
