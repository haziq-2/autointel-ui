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
import { SELLER_PROFILES, getPageInsights } from "@/lib/mock-data/intelligence";
import { formatCurrency } from "@/lib/format";

export default function SellersPage() {
  return (
    <div>
      <PageHeader title="Seller Intelligence" description="AI profiles for every seller in the network" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Seller profiles</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Seller</DataTableHeaderCell>
                  <DataTableHeaderCell>Type</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Rating</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Avg price</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Avg days listed</DataTableHeaderCell>
                  <DataTableHeaderCell>Response</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Pricing accuracy</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Listings</DataTableHeaderCell>
                  <DataTableHeaderCell>Risk</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {SELLER_PROFILES.map((s) => (
                  <DataTableRow key={s.id}>
                    <DataTableCell className="font-medium">{s.name}</DataTableCell>
                    <DataTableCell className="capitalize text-muted-foreground">{s.type}</DataTableCell>
                    <DataTableCell align="right"><ScoreBadge score={Math.round(s.rating * 20)} /></DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(s.avgPrice)}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{s.avgDaysListed}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">{s.responseSpeed}</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{s.pricingAccuracy}%</DataTableCell>
                    <DataTableCell align="right" className="font-mono tabular-nums">{s.listingCount}</DataTableCell>
                    <DataTableCell className="text-muted-foreground">
                      {s.riskIndicators.length ? s.riskIndicators.join(", ") : "None"}
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </tbody>
            </DataTable>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("sellers")} />
      </div>
    </div>
  );
}
