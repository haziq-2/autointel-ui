"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore persistence failures (private mode, etc.)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
    >
      {isDark ? (
        <Moon className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Sun className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
