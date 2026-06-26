import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { MetricsGrid } from "@/components/shared/metrics-grid";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import { DailyScrapeChart } from "@/components/dashboard/daily-scrape-chart";
import { DATA_SOURCES, SYNC_LOGS, getPageInsights } from "@/lib/mock-data/intelligence";
import { getDailyScrapeCounts } from "@/lib/mock-data/scrape-activity";

export default function DataSourcesPage() {
  const syncChart = getDailyScrapeCounts(14);
  const totalRecords = DATA_SOURCES.reduce((s, d) => s + d.recordsImported, 0);

  return (
    <div>
      <PageHeader title="Data Sources" description="Unified data layer — every connected source" />

      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <MetricsGrid
            metrics={[
              { label: "Active sources", value: DATA_SOURCES.filter((d) => d.status === "running").length },
              { label: "Total records", value: totalRecords.toLocaleString() },
              { label: "Avg daily imports", value: DATA_SOURCES.reduce((s, d) => s + d.avgDailyRecords, 0).toLocaleString() },
              { label: "Degraded", value: DATA_SOURCES.filter((d) => d.connectionHealth === "degraded").length },
            ]}
          />

          <section>
            <SectionTitle>Active sources</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Source</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                  <DataTableHeaderCell>Last sync</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Records</DataTableHeaderCell>
                  <DataTableHeaderCell>Frequency</DataTableHeaderCell>
                  <DataTableHeaderCell>Health</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Daily avg</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {DATA_SOURCES.map((s) => (
                  <DataTableRow key={s.id}>
                    <DataTableCell className="font-medium">{s.name}</DataTableCell>
                    <DataTableCell><StatusBadge status={s.status} /></DataTableCell>
                    <DataTableCell className="text-muted-foreground">{s.lastSync}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{s.recordsImported.toLocaleString()}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{s.syncFrequency}</DataTableCell>
                    <DataTableCell className="capitalize text-muted-foreground">{s.connectionHealth}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{s.avgDailyRecords}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>Historical sync volume</SectionTitle>
            <div className="rounded-md border border-border p-4">
              <DailyScrapeChart data={syncChart} />
            </div>
          </section>

          <section>
            <SectionTitle>Connection logs</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Source</DataTableHeaderCell>
                  <DataTableHeaderCell>Time</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Records</DataTableHeaderCell>
                  <DataTableHeaderCell>Message</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {SYNC_LOGS.map((log) => (
                  <DataTableRow key={log.id}>
                    <DataTableCell className="font-medium">{log.source}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{log.timestamp}</DataTableCell>
                    <DataTableCell className="capitalize">{log.status}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{log.records}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{log.message}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("data-sources")} />
      </div>
    </div>
  );
}
