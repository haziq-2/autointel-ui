import { Suspense } from "react";
import LiveScrapingPageClient from "./live-client";

export default function LiveScrapingPage() {
  return (
    <Suspense fallback={<div className="text-[13px] text-muted-foreground">Loading...</div>}>
      <LiveScrapingPageClient />
    </Suspense>
  );
}
