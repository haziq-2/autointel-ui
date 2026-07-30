"use client";

import { useParams, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LiveScrapePanel } from "@/components/scraping/live-scrape-panel";
import { resolveScrapeContext } from "@/lib/scraping/scraper-config";

export default function LiveScrapingPageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const initialCity = searchParams.get("city") ?? undefined;
  const context = resolveScrapeContext(id);

  return (
    <div>
      <PageHeader
        title="Live scrape"
        description={`${context.title} · ${context.marketplace}`}
      />
      <LiveScrapePanel context={context} initialCity={initialCity} />
    </div>
  );
}
