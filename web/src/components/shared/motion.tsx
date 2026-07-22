"use client";

import { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fades + rises a single block into view on mount.
 * No-ops under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers its direct children into view. Preserves layout by rendering the
 * same grid className passed in; each child is wrapped in a motion item.
 */
export function StaggerGrid({
  children,
  className,
  step = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children).filter(isValidElement);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={(child as { key?: string }).key ?? i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: EASE, delay: i * step }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export function MotionListItem({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE, delay: Math.min(index * 0.03, 0.3) }}
    >
      {children}
    </motion.div>
  );
}
