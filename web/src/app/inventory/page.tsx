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
import { INVENTORY_UNITS, getPageInsights } from "@/lib/mock-data/intelligence";
import { formatCurrency } from "@/lib/format";

export default function InventoryPage() {
  const totalValue = INVENTORY_UNITS.reduce((s, u) => s + u.listPrice, 0);
  const avgDays = Math.round(INVENTORY_UNITS.reduce((s, u) => s + u.daysInInventory, 0) / INVENTORY_UNITS.length);
  const avgMargin = Math.round(INVENTORY_UNITS.reduce((s, u) => s + u.margin, 0) / INVENTORY_UNITS.length);

  return (
    <div>
      <PageHeader title="Inventory" description="Dealership inventory intelligence from DMS feeds" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <MetricsGrid
            metrics={[
              { label: "Inventory count", value: INVENTORY_UNITS.length },
              { label: "Avg days in stock", value: avgDays },
              { label: "Avg margin", value: formatCurrency(avgMargin) },
              { label: "Inventory value", value: formatCurrency(totalValue) },
              { label: "Inventory health", value: "78/100" },
              { label: "Turnover rate", value: "4.2x" },
              { label: "Aged 60+ days", value: 2 },
              { label: "Pending sale", value: 1 },
            ]}
          />

          <section>
            <SectionTitle>Inventory units</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
                  <DataTableHeaderCell>Stock #</DataTableHeaderCell>
                  <DataTableHeaderCell>Location</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Days</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Cost</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">List</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Margin</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {INVENTORY_UNITS.map((u) => (
                  <DataTableRow key={u.id}>
                    <DataTableCell className="font-medium">{u.title}</DataTableCell>
                    <DataTableCell className="font-mono text-muted-foreground">{u.stockNumber}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{u.location}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{u.daysInInventory}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(u.cost)}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(u.listPrice)}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(u.margin)}</DataTableCell>
                    <DataTableCell className="capitalize text-muted-foreground">{u.status}</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>AI recommendations</SectionTitle>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              <li>· Move SUVs in Houston to Dallas — stronger demand index</li>
              <li>· Discount 2019 BMW X5 — 91 days in inventory, wholesale candidate</li>
              <li>· Acquire additional trucks — inventory underweight vs regional benchmark</li>
              <li>· Current mix is 34% sedans vs 22% market average — rebalance acquisitions</li>
            </ul>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("inventory")} />
      </div>
    </div>
  );
}
