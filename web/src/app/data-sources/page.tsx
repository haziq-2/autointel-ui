import { PageHeader, SectionTitle } from "@/components/shared/page-header";
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
import { DATA_SOURCES, SYNC_LOGS } from "@/lib/mock-data/intelligence";
import {
  getAverageDailyScrapeByMarketplace,
  getAverageDailyScrapeCount,
  getDailyScrapeCounts,
} from "@/lib/mock-data/scrape-activity";

export default function DataSourcesPage() {
  const syncChart = getDailyScrapeCounts(14);
  const totalRecords = DATA_SOURCES.reduce((s, d) => s + d.recordsImported, 0);
  const avgDailyImports = getAverageDailyScrapeCount(30);
  const dailyByMarketplace = getAverageDailyScrapeByMarketplace(30);

  return (
    <div>
      <PageHeader title="Data Sources" description="Facebook Marketplace, Craigslist, and AutoTrader connectors" />

      <div className="mb-10 space-y-10">
          <MetricsGrid
            metrics={[
              { label: "Active sources", value: DATA_SOURCES.filter((d) => d.status === "running").length },
              { label: "Total records", value: totalRecords.toLocaleString() },
              { label: "Avg daily imports", value: avgDailyImports.toLocaleString() },
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
                    <DataTableCell align="right" className="font-mono tabular-nums">{dailyByMarketplace[s.name] ?? 0}</DataTableCell>
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
    </div>
  );
}
