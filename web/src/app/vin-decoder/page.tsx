import { PageHeader } from "@/components/shared/page-header";
import { VinLookupForm } from "@/components/vin/vin-lookup-form";

export default async function VinDecoderPage({
  searchParams,
}: {
  searchParams: Promise<{ vin?: string }>;
}) {
  const { vin } = await searchParams;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="VIN Decoder"
        description="Validate a VIN, decode vehicle specifications, and reuse cached results on repeat lookups."
      />

      <div className="max-w-3xl">
        <VinLookupForm initialVin={vin?.toUpperCase() ?? ""} />
      </div>
    </div>
  );
}
