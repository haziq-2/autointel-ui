"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export function Sparkline({ data, className, color = "var(--primary)" }: SparklineProps) {
  const gradientId = useId();

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const padding = 2;

  const coords = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const points = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="1.75" fill={color} />
    </svg>
  );
}
