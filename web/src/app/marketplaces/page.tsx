import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { ScoreBadge } from "@/components/shared/status-badge";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import { MARKETPLACE_METRICS, getPageInsights } from "@/lib/mock-data/intelligence";
import { getDailyScrapeCounts } from "@/lib/mock-data/scrape-activity";
import { DailyScrapeChart } from "@/components/dashboard/daily-scrape-chart";

export default function MarketplacesPage() {
  const volume = getDailyScrapeCounts(14);

  return (
    <div>
      <PageHeader title="Marketplace Intelligence" description="Health and performance across all marketplaces" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Marketplace health</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Marketplace</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Listings</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Growth</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Price Δ</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Quality</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Duplicates</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Regions</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Daily vol</DataTableHeaderCell>
                  <DataTableHeaderCell>Health</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {MARKETPLACE_METRICS.map((m) => (
                  <DataTableRow key={m.id}>
                    <DataTableCell className="font-medium">{m.name}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.listings.toLocaleString()}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.growthRate > 0 ? "+" : ""}{m.growthRate}%</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.avgPriceChange}%</DataTableCell>
                    <DataTableCell align="right"><ScoreBadge score={m.qualityScore} /></DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.duplicateRate}%</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.regionsCovered}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.dailyVolume}</DataTableCell>
                    <DataTableCell className="capitalize text-muted-foreground">{m.health}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>Daily scraping volume</SectionTitle>
            <div className="rounded-md border border-border p-4">
              <DailyScrapeChart data={volume} />
            </div>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("marketplaces")} />
      </div>
    </div>
  );
}
