"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MARKETPLACES } from "@/lib/constants";

export default function NewScraperPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [city, setCity] = useState("Dallas, TX");

  const handleStart = () => {
    if (!city.trim()) return;
    setSaving(true);
    const q = encodeURIComponent(city.trim());
    setTimeout(() => router.push(`/scrapers/job-1/live?city=${q}`), 400);
  };

  return (
    <div>
      <PageHeader title="New scraper" description="Configure search criteria and schedule" />

      <div className="max-w-md space-y-6">
        <FormField label="Marketplace">
          <Select defaultValue={MARKETPLACES[0]}>
            <SelectTrigger className="h-9 border-border text-[13px] shadow-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MARKETPLACES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="City">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Dallas, TX"
            className="h-9 border-border text-[13px] shadow-none"
          />
        </FormField>

        <FormField label="Radius (miles)">
          <Input type="number" defaultValue="50" className="h-9 border-border text-[13px] shadow-none" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Make">
            <Input defaultValue="Ford" className="h-9 border-border text-[13px] shadow-none" />
          </FormField>
          <FormField label="Model">
            <Input defaultValue="F-150" className="h-9 border-border text-[13px] shadow-none" />
          </FormField>
        </div>

        <FormField label="Year range">
          <div className="flex gap-2">
            <Input type="number" defaultValue="2018" className="h-9 border-border text-[13px] shadow-none" />
            <Input type="number" defaultValue="2024" className="h-9 border-border text-[13px] shadow-none" />
          </div>
        </FormField>

        <FormField label="Price range">
          <div className="flex gap-2">
            <Input type="number" defaultValue="15000" className="h-9 border-border text-[13px] shadow-none" />
            <Input type="number" defaultValue="45000" className="h-9 border-border text-[13px] shadow-none" />
          </div>
        </FormField>

        <FormField label="Max mileage">
          <Input type="number" defaultValue="80000" className="h-9 border-border text-[13px] shadow-none" />
        </FormField>

        <FormField label="Keywords">
          <Input placeholder="Optional" className="h-9 border-border text-[13px] shadow-none" />
        </FormField>

        <FormField label="Seller type">
          <Select defaultValue="all">
            <SelectTrigger className="h-9 border-border text-[13px] shadow-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="dealer">Dealer</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Sort order">
          <Select defaultValue="newest">
            <SelectTrigger className="h-9 border-border text-[13px] shadow-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="price_asc">Price: low to high</SelectItem>
              <SelectItem value="price_desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Frequency">
          <Select defaultValue="30min">
            <SelectTrigger className="h-9 border-border text-[13px] shadow-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30min">Every 30 minutes</SelectItem>
              <SelectItem value="1hr">Every hour</SelectItem>
              <SelectItem value="2hr">Every 2 hours</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Maximum results">
          <Input type="number" defaultValue="500" className="h-9 border-border text-[13px] shadow-none" />
        </FormField>

        <div className="flex gap-2 border-t border-border pt-6">
          <Button variant="outline" size="sm">Save</Button>
          <Button size="sm" onClick={handleStart} disabled={saving}>
            {saving ? "Starting..." : "Start scraping"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-label">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
