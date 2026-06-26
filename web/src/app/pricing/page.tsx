import Link from "next/link";
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
import { getPageInsights, getVehiclePricingIntelligence } from "@/lib/mock-data/intelligence";
import { getRecentVehicles } from "@/lib/mock-data/generate-vehicles";
import { formatCurrency } from "@/lib/format";

export default function PricingPage() {
  const vehicles = getRecentVehicles(12);

  return (
    <div>
      <PageHeader title="Pricing Intelligence" description="AI pricing recommendations across tracked inventory" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Recent pricing analysis</SectionTitle>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Asking</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Market value</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Suggested buy</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Est. profit</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">ROI</DataTableHeaderCell>
                  <DataTableHeaderCell align="right">Confidence</DataTableHeaderCell>
                  <DataTableHeaderCell>Position</DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {vehicles.map((v) => {
                  const p = getVehiclePricingIntelligence(v.id);
                  if (!p) return null;
                  return (
                    <DataTableRow key={v.id}>
                      <DataTableCell>
                        <Link href={`/vehicles/${v.id}`} className="font-medium hover:underline">{v.title}</Link>
                      </DataTableCell>
                      <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(v.price)}</DataTableCell>
                      <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(p.estimatedMarketValue)}</DataTableCell>
                      <DataTableCell align="right" className="font-mono tabular-nums">{formatCurrency(p.suggestedPurchasePrice)}</DataTableCell>
                      <DataTableCell align="right" className="font-mono tabular-nums text-[#16a34a]">{formatCurrency(p.expectedGrossProfit)}</DataTableCell>
                      <DataTableCell align="right" className="font-mono tabular-nums">{p.expectedRoi}%</DataTableCell>
                      <DataTableCell align="right"><ScoreBadge score={p.confidenceScore} /></DataTableCell>
                      <DataTableCell className="capitalize text-muted-foreground">{p.pricePosition}</DataTableCell>
                    </DataTableRow>
                  );
                })}
              </tbody>
            </DataTable>
          </section>
        </div>

        <AiInsightsPanel insights={getPageInsights("pricing")} />
      </div>
    </div>
  );
}
