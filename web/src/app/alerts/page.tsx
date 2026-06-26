import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import { AlertSeverityBadge } from "@/components/shared/status-badge";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import { ALERTS, getPageInsights } from "@/lib/mock-data/intelligence";

export default function AlertsPage() {
  const unread = ALERTS.filter((a) => !a.read).length;

  return (
    <div>
      <PageHeader title="Alerts" description={`${unread} unread · intelligent monitoring`} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Notification channels</SectionTitle>
            <div className="flex flex-wrap gap-2 text-[13px] text-muted-foreground">
              {["Email", "Slack", "SMS", "In-app"].map((c) => (
                <span key={c} className="rounded-md border border-border px-3 py-1.5">{c} · enabled</span>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>Recent alerts</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Alert</DataTableHeaderCell>
                  <DataTableHeaderCell>Category</DataTableHeaderCell>
                  <DataTableHeaderCell>Severity</DataTableHeaderCell>
                  <DataTableHeaderCell>Time</DataTableHeaderCell>
                  <DataTableHeaderCell>Channels</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {ALERTS.map((a) => (
                  <DataTableRow key={a.id}>
                    <DataTableCell>
                      <p className="font-medium">{a.title}</p>
                      <p className="mt-0.5 text-label">{a.description}</p>
                    </DataTableCell>
                    <DataTableCell className="text-muted-foreground">{a.category}</DataTableCell>
                    <DataTableCell><AlertSeverityBadge severity={a.severity} /></DataTableCell>
                    <DataTableCell className="text-muted-foreground">{a.timestamp}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{a.channels.join(", ")}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{a.read ? "Read" : "Unread"}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("alerts")} />
      </div>
    </div>
  );
}
