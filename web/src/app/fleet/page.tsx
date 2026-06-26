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
import { FLEET_VEHICLES, getPageInsights } from "@/lib/mock-data/intelligence";
import { formatCurrency, formatMileage } from "@/lib/format";

export default function FleetPage() {
  const fleetValue = FLEET_VEHICLES.reduce((s, v) => s + v.residualValue, 0);
  const avgAge = Math.round(FLEET_VEHICLES.reduce((s, v) => s + (2026 - v.year), 0) / FLEET_VEHICLES.length);
  const avgUtil = Math.round(FLEET_VEHICLES.reduce((s, v) => s + v.utilization, 0) / FLEET_VEHICLES.length);

  return (
    <div>
      <PageHeader title="Fleet Analytics" description="Fleet value, utilization, and replacement planning" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <MetricsGrid
            metrics={[
              { label: "Fleet value", value: formatCurrency(fleetValue) },
              { label: "Avg vehicle age", value: `${avgAge} yrs` },
              { label: "Avg utilization", value: `${avgUtil}%` },
              { label: "Maintenance (annual)", value: formatCurrency(20600) },
              { label: "Fuel (annual)", value: formatCurrency(35200) },
              { label: "Replacement due", value: "2 units" },
            ]}
          />

          <section>
            <SectionTitle>Fleet units</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Unit</DataTableHeaderCell>
                  <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Mileage</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Utilization</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Maintenance</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Residual</DataTableHeaderCell>
                  <DataTableHeaderCell>Replace by</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {FLEET_VEHICLES.map((v) => (
                  <DataTableRow key={v.id}>
                    <DataTableCell className="font-mono">{v.unit}</DataTableCell>
                    <DataTableCell className="font-medium">{v.year} {v.make} {v.model}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatMileage(v.mileage)}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{v.utilization}%</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(v.maintenanceCost)}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(v.residualValue)}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{v.replacementDue}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>AI recommendations</SectionTitle>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Replace vehicles exceeding 170,000 miles over the next quarter. FL-1088 and FL-1114 have maintenance costs exceeding replacement threshold. FL-1102 shows strong utilization — extend lifecycle to Q1 2028.
            </p>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("fleet")} />
      </div>
    </div>
  );
}
