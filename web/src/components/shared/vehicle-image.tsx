"use client";

import { useState } from "react";
import { Car, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  Black: "#1f2937",
  White: "#e5e7eb",
  Silver: "#c3c8cf",
  Gray: "#6b7280",
  Blue: "#2563eb",
  Red: "#dc2626",
  Green: "#16a34a",
  Brown: "#78350f",
  Beige: "#cbb992",
  Orange: "#ea580c",
  "Pearl White": "#eceef1",
  "Midnight Blue": "#1e3a5f",
  Burgundy: "#7c1d3a",
  Champagne: "#cdb78d",
};

function parseColor(title: string): string {
  const idx = title.lastIndexOf("·");
  return idx >= 0 ? title.slice(idx + 1).trim() : "";
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

function shade(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const adjust = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + (percent / 100) * 255)));
  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
}

interface VehicleImageProps {
  title: string;
  bodyStyle: string;
  imageUrl?: string;
  className?: string;
  iconClassName?: string;
}

export function VehicleImage({ title, bodyStyle, imageUrl, className, iconClassName }: VehicleImageProps) {
  const [errored, setErrored] = useState(false);

  if (imageUrl && !errored) {
    return (
      <div className={cn("relative overflow-hidden bg-surface", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  const color = parseColor(title);
  const base = COLOR_MAP[color] ?? "#6b7280";
  const light = isLight(base);
  const Icon = bodyStyle === "Truck" ? Truck : Car;

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${shade(base, 6)}, ${shade(base, -16)})` }}
      aria-hidden
    >
      <Icon
        strokeWidth={1.25}
        className={cn(light ? "text-black/30" : "text-white/60", iconClassName)}
      />
    </div>
  );
}
