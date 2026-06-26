import { Sparkles } from "lucide-react";
import type { AiInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    <div className={cn("rounded-md border border-border bg-[#fafafa] p-4", className)}>
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-card-title">{title}</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight, i) =>
          isStructured(insight) ? (
            <div key={i} className="border-t border-border pt-4 first:border-0 first:pt-0">
              <p className="text-[13px] font-medium text-foreground">{insight.what}</p>
              <dl className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
                <div>
                  <dt className="text-label inline">Why · </dt>
                  <dd className="inline">{insight.why}</dd>
                </div>
                <div>
                  <dt className="text-label inline">Impact · </dt>
                  <dd className="inline">{insight.impact}</dd>
                </div>
                <div>
                  <dt className="text-label inline">Action · </dt>
                  <dd className="inline">{insight.action}</dd>
                </div>
              </dl>
              <p className="mt-2 font-mono text-label tabular-nums">
                Confidence {insight.confidence}%
              </p>
            </div>
          ) : (
            <p key={i} className="text-[13px] leading-relaxed text-muted-foreground">
              {insight}
            </p>
          )
        )}
      </div>
    </div>
  );
}
