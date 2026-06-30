"use client";

import {
  OpportunityScoreCard,
  AiExplanationCard,
} from "@/components/intelligence/opportunity-score-card";
import { NegotiationIntelligence } from "@/components/intelligence/negotiation-intelligence";
import { ProfitPredictionCard } from "@/components/intelligence/profit-prediction";
import { OpportunityLabelBadge } from "@/components/intelligence/opportunity-label-badge";
import {
  getVehicleOpportunityIntel,
  getNegotiationIntel,
  getProfitAnalysis,
} from "@/lib/mock-data/ai-intelligence";

export function VehicleIntelligenceSection({ vehicleId }: { vehicleId: string }) {
  const opportunity = getVehicleOpportunityIntel(vehicleId);
  const negotiation = getNegotiationIntel(vehicleId);
  const profit = getProfitAnalysis(vehicleId);

  if (!opportunity) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <OpportunityLabelBadge label={opportunity.label} />
      </div>
      <OpportunityScoreCard intel={opportunity} />
      <AiExplanationCard bullets={opportunity.explanationBullets} />
      {negotiation && <NegotiationIntelligence intel={negotiation} />}
      {profit && <ProfitPredictionCard analysis={profit} />}
    </div>
  );
}
