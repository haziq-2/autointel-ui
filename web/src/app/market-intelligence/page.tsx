import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { MetricsGrid } from "@/components/shared/metrics-grid";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import {
  FAST_SELLING_MODELS,
  MARKET_TRENDS,
  SLOW_SELLING_MODELS,
  getPageInsights,
} from "@/lib/mock-data/intelligence";

export default function MarketIntelligencePage() {
  return (
    <div>
      <PageHeader title="Market Intelligence" description="AI-analyzed trends across all scraped vehicles" />

      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Market trends</SectionTitle>
            <div className="space-y-3">
              {MARKET_TRENDS.map((t) => (
                <div key={t.metric} className="rounded-md border border-border p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-card-title">{t.metric}</p>
                    <p className="font-mono text-[15px] font-semibold tabular-nums">{t.value}</p>
                  </div>
                  <p className="mt-1 font-mono text-label tabular-nums">
                    {t.change > 0 ? "+" : ""}{t.change}% vs prior period
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{t.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>Fast selling models</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Model</DataTableHeaderCell>
                  <DataTableHeaderCell>Region</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Days to sell</DataTableHeaderCell>
                  <DataTableHeaderCell>Demand</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {FAST_SELLING_MODELS.map((m) => (
                  <DataTableRow key={m.model}>
                    <DataTableCell className="font-medium">{m.model}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{m.region}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.daysToSell}</DataTableCell>
                    <DataTableCell className="text-[#16a34a]">{m.change}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>Slow selling models</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Model</DataTableHeaderCell>
                  <DataTableHeaderCell>Region</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Days to sell</DataTableHeaderCell>
                  <DataTableHeaderCell>Demand</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {SLOW_SELLING_MODELS.map((m) => (
                  <DataTableRow key={m.model}>
                    <DataTableCell className="font-medium">{m.model}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{m.region}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{m.daysToSell}</DataTableCell>
                    <DataTableCell className="text-[#dc2626]">{m.change}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>Regional & seasonality</SectionTitle>
            <MetricsGrid
              metrics={[
                { label: "Texas avg price", value: "$29,840", change: 1.2 },
                { label: "Southwest supply", value: "1,842", change: -8.4 },
                { label: "Southeast demand", value: "High", change: 6.8 },
                { label: "Seasonal index", value: "1.14", change: 4.2 },
              ]}
            />
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Used Toyota Tacomas in Texas have increased 6.8% over the past 30 days while inventory has fallen 18%, indicating increasing demand. Spring seasonality is driving faster turnover in trucks and SUVs across the Southwest.
            </p>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("market-intelligence")} />
      </div>
    </div>
  );
}
