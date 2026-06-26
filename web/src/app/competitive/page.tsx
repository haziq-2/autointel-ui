import { PageHeader, SectionTitle } from "@/components/shared/page-header";
import { AiInsightsPanel } from "@/components/shared/ai-insights-panel";
import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/shared/data-table";
import { COMPETITORS, getPageInsights } from "@/lib/mock-data/intelligence";
import { formatCurrency } from "@/lib/format";

export default function CompetitivePage() {
  return (
    <div>
      <PageHeader title="Competitive Intelligence" description="Monitor competitor inventory and pricing" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Competitor comparison</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Dealer</DataTableHeaderCell>
                  <DataTableHeaderCell>Region</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Inventory</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Change</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Avg price</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Reductions</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">New listings</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Share</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {COMPETITORS.map((c) => (
                  <DataTableRow key={c.id}>
                    <DataTableCell className="font-medium">{c.name}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{c.region}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{c.inventoryCount}</DataTableCell>
                    <DataTableCell align="right" className={`font-mono tabular-nums ${c.inventoryChange < 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                      {c.inventoryChange > 0 ? "+" : ""}{c.inventoryChange}%
                    </DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(c.avgPrice)}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{c.priceReductions}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{c.newListings}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{c.marketShare}%</DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section>
            <SectionTitle>AI competitive insights</SectionTitle>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Competitor inventory fell 12% this week while yours increased 8%. Lone Star Motors is aggressively clearing aged sedan stock, creating an opening to capture DFW truck market share. Gulf Coast Auto raised average prices 2.1% — monitor for margin expansion opportunity.
            </p>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("competitive")} />
      </div>
    </div>
  );
}
