"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { getAcquisitionOpportunities } from "@/lib/mock-data/intelligence";
import { getTodayScrapeCount } from "@/lib/mock-data/scrape-activity";
import { formatCurrency } from "@/lib/format";

const PROMPTS = [
  "What vehicles should I buy today?",
  "Which markets are growing?",
  "Which inventory should I discount?",
  "Where are competitors underpricing inventory?",
  "Show trucks with the highest resale potential.",
  "Summarize today's scraping activity.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAnalysisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm your AutoIntel assistant. Ask about acquisitions, pricing, inventory, competitors, or market trends.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: getResponse(text) }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <PageHeader title="AI Assistant" description="Natural language intelligence across your automotive data" />

      <div className="flex min-h-0 flex-1 gap-8">
        <div className="hidden w-56 shrink-0 md:block">
          <p className="mb-3 text-label">Suggested</p>
          <div className="space-y-0.5">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="w-full rounded-md px-2 py-2 text-left text-[13px] leading-snug text-muted-foreground hover:bg-[#fafafa] hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-md border border-border">
          <ScrollArea className="flex-1 p-6">
            <div className="mx-auto max-w-2xl space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[85%] rounded-md bg-[#f4f4f5] px-4 py-3 text-[13px] leading-relaxed"
                        : "max-w-[90%] text-[13px] leading-relaxed text-foreground whitespace-pre-wrap"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && <p className="text-label">Analyzing...</p>}
            </div>
          </ScrollArea>
          <div className="border-t border-border p-4">
            <div className="mx-auto flex max-w-2xl gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask a question..."
                className="h-9 border-border text-[13px] shadow-none"
                disabled={loading}
              />
              <Button size="sm" className="h-9 px-3" onClick={() => send(input)} disabled={loading || !input.trim()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  const top = getAcquisitionOpportunities().slice(0, 3);

  if (lower.includes("buy today") || lower.includes("should i buy")) {
    return `Executive summary — top acquisitions today:\n\n${top
      .map(
        (v, i) =>
          `${i + 1}. ${v.title} — ${v.location}\n   Score ${v.acquisitionScore} · Margin ${formatCurrency(v.expectedProfit)} · ${v.acquisitionRecommendation.replace(/_/g, " ")}`
      )
      .join("\n\n")}\n\nRecommendation: Contact private-seller trucks first — highest margin velocity in Southwest.`;
  }
  if (lower.includes("market") && lower.includes("grow")) {
    return "Growing markets:\n\n· Southwest pickups — demand +18%, inventory -14%\n· Southeast SUVs — demand +11%\n· EV segment — demand +12% over 90 days\n\nTexas and Arizona show strongest acquisition-to-resale spreads.";
  }
  if (lower.includes("discount") || lower.includes("inventory")) {
    return "Discount candidates:\n\n· 2019 BMW X5 — 91 days in stock, wholesale candidate\n· 2020 Honda Accord — 67 days, margin compressing\n· Sedan mix 34% vs 22% benchmark — rebalance via targeted discounts\n\nAction: 3–5% reduction on aged sedans, hold truck pricing.";
  }
  if (lower.includes("competitor") || lower.includes("underpric")) {
    return "Competitor underpricing:\n\n· Lone Star Motors — F-150 avg $1,200 below your retail\n· Gulf Coast Auto — Silverado inventory +8% with flat pricing\n\nOpportunity: Acquire from private sellers where dealers are pulling back inventory.";
  }
  if (lower.includes("truck") && lower.includes("resale")) {
    return "Highest resale potential — trucks:\n\n1. 2022 Toyota Tacoma — 14-day avg sell-through, +22% demand\n2. 2021 Ford F-150 — $3,200 avg margin, 14-day velocity\n3. 2020 Chevy Silverado — strong Southwest private-seller supply\n\nConfidence: 91% based on 30-day demand forecast.";
  }
  if (lower.includes("summarize") || lower.includes("today")) {
    const today = getTodayScrapeCount();
    return `Today's executive summary:\n\n· ${today} new vehicles discovered\n· 41 undervalued listings flagged\n· 17 acquisition opportunities\n· Truck demand up 18% in Southwest\n· Average listing price down 2.4%\n\n2 active scrapers · inventory health 78/100`;
  }
  return "Southwest pickup trucks show the strongest signals. I recommend reviewing the Acquisition page for scored opportunities and the Market Intelligence page for regional trends.";
}
