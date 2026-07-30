"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Shield, Target, MapPin, Store } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_ALERT_RULES, VEHICLE_MAKES } from "@/lib/mock-data/ai-intelligence";
import { ALERT_CITIES, ALERT_MARKETPLACES } from "@/lib/mock-data/alerts";
import type { AlertRulesConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Truck", "SUV", "Sedan", "Coupe", "Electric", "Van"];
const MODELS = ["F-150", "Tacoma", "Silverado", "CR-V", "Civic", "RAV4", "Camry", "Model Y"];

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRulesConfig>(DEFAULT_ALERT_RULES);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof AlertRulesConfig, value: string) => {
    const arr = rules[key] as string[];
    if (!Array.isArray(arr)) return;
    setRules((r) => ({
      ...r,
      [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link
        href="/alerts"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Alerts
      </Link>

      <PageHeader
        title="Alert Rules"
        description="Configure when instant purchase alerts are triggered across your acquisition pipeline"
      />

      <div className="space-y-5">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-card-title font-medium">Global Settings</h3>
              <p className="text-[12px] text-muted-foreground">Master toggle for all alert channels</p>
            </div>
          </div>
          <ToggleRow
            label="Enable purchase alerts"
            description="Receive in-app, email, and Slack notifications"
            enabled={rules.enabled}
            onToggle={() => setRules((r) => ({ ...r, enabled: !r.enabled }))}
          />
        </Card>

        <Card className="p-5">
          <SectionHeader icon={Target} title="Alert Thresholds" />
          <div className="space-y-6">
            <SliderField
              label="Price Drop Percentage"
              value={rules.priceDropPercent}
              min={2}
              max={20}
              display={`${rules.priceDropPercent}%`}
              onChange={(v) => setRules((r) => ({ ...r, priceDropPercent: v }))}
            />
            <Field label="Minimum Expected Profit">
              <Input
                type="number"
                value={rules.minProfit}
                onChange={(e) => setRules((r) => ({ ...r, minProfit: Number(e.target.value) }))}
                className="h-9"
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={Shield} title="Purchase Limits" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Maximum Purchase Price">
              <Input
                type="number"
                value={rules.maxPurchasePrice}
                onChange={(e) => setRules((r) => ({ ...r, maxPurchasePrice: Number(e.target.value) }))}
                className="h-9"
              />
            </Field>
            <Field label="Maximum Mileage">
              <Input
                type="number"
                value={rules.maxMileage}
                onChange={(e) => setRules((r) => ({ ...r, maxMileage: Number(e.target.value) }))}
                className="h-9"
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Repair Risk Threshold">
              <Select
                value={rules.repairRiskThreshold}
                onValueChange={(v) =>
                  setRules((r) => ({
                    ...r,
                    repairRiskThreshold: v as AlertRulesConfig["repairRiskThreshold"],
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low only</SelectItem>
                  <SelectItem value="Medium">Up to Medium</SelectItem>
                  <SelectItem value="High">All risk levels</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={Store} title="Vehicle Preferences" />
          <Field label="Preferred Makes">
            <ChipRow
              items={VEHICLE_MAKES.slice(0, 12)}
              active={rules.preferredMakes}
              onToggle={(m) => toggle("preferredMakes", m)}
            />
          </Field>
          <Field label="Preferred Models" className="mt-5">
            <ChipRow
              items={MODELS}
              active={rules.preferredModels}
              onToggle={(m) => toggle("preferredModels", m)}
            />
          </Field>
          <Field label="Vehicle Categories" className="mt-5">
            <ChipRow
              items={CATEGORIES}
              active={rules.categories}
              onToggle={(c) => toggle("categories", c)}
            />
          </Field>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={MapPin} title="Geography & Sources" />
          <Field label="Preferred Cities">
            <ChipRow
              items={ALERT_CITIES}
              active={rules.preferredCities}
              onToggle={(c) => toggle("preferredCities", c)}
            />
          </Field>
          <Field label="Marketplaces" className="mt-5">
            <ChipRow
              items={ALERT_MARKETPLACES}
              active={rules.marketplaces}
              onToggle={(m) => toggle("marketplaces", m)}
            />
          </Field>
        </Card>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          {saved ? "Rules saved!" : "Save alert rules"}
        </Button>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof Bell;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <h3 className="text-card-title font-medium">{title}</h3>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[13px] font-medium">{label}</p>
        <p className="text-[12px] text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            enabled ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-[13px] font-medium">{label}</label>
        <span className="font-mono text-[12px] font-semibold text-primary">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[13px] font-medium">{label}</label>
      {children}
    </div>
  );
}

function ChipRow({
  items,
  active,
  onToggle,
}: {
  items: string[];
  active: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={cn(
            "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
            active.includes(item)
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/40"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
