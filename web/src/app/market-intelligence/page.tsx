import { PageHeader } from "@/components/shared/page-header";
import { MarketCharts } from "@/components/market-intelligence/market-charts";

export default function MarketIntelligencePage() {
  return (
    <div>
      <PageHeader title="Market Intelligence" description="AI-analyzed trends across all scraped vehicles" />
      <MarketCharts />
    </div>
  );
}
