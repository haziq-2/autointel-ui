"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

const PROMPTS = [
  "Find the best acquisition opportunities.",
  "Show vehicles with highest profit potential.",
  "Which listings are significantly under market value?",
  "Summarize today's scraping activity.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAnalysisPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask about scraped inventory, margins, or acquisition priorities." },
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
      <PageHeader title="AI analysis" description="Acquisition intelligence on your scraped data" />

      <div className="flex min-h-0 flex-1 gap-8">
        <div className="hidden w-52 shrink-0 md:block">
          <p className="mb-3 text-label">Suggested</p>
          <div className="space-y-0.5">
            {PROMPTS.map((p) => (
              <button
                key={p}
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
  if (lower.includes("best") || lower.includes("opportunit")) {
    return "Top opportunities from today's scrape:\n\n1. 2021 Ford F-150 — Dallas — $3,200 below market\n2. 2020 Ram 1500 — Fort Worth — $5,600 margin\n3. 2019 Chevy Silverado — San Antonio — $4,100 margin";
  }
  if (lower.includes("profit") || lower.includes("margin")) {
    return "12 vehicles show margin above $4,000. Trucks account for 8 of the top 12.";
  }
  if (lower.includes("under market") || lower.includes("undervalued")) {
    return "38 listings priced 8%+ below fair market value, concentrated in Texas metros.";
  }
  if (lower.includes("summarize") || lower.includes("today")) {
    return "Today: 142 new vehicles, 2 active scrapers, 6 new saved opportunities.";
  }
  return "Southwest region shows the strongest acquisition signals. Focus on pickup trucks from private sellers on Facebook and Craigslist.";
}
