"use client";

import { useEffect, useState } from "react";
import type { MediaStatus } from "@/lib/media";

// Étagère repliable : l'état replié est mémorisé sur l'appareil
export function Shelf({
  status,
  label,
  count,
  storageKey,
  children,
}: {
  status: MediaStatus;
  label: string;
  count: number;
  storageKey: string;
  children: React.ReactNode;
}) {
  const key = `codex:replie:${storageKey}:${status}`;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(key) === "1") setOpen(false);
    } catch {
      // stockage indisponible (navigation privée) : tout reste déplié
    }
  }, [key]);

  function onToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    const next = e.currentTarget.open;
    setOpen(next);
    try {
      if (next) localStorage.removeItem(key);
      else localStorage.setItem(key, "1");
    } catch {}
  }

  return (
    <details className="shelf" data-status={status} open={open} onToggle={onToggle}>
      <summary className="shelf-head">
        <h2>{label}</h2>
        <span className="count">{count}</span>
        <span className="rule" aria-hidden="true" />
      </summary>
      {children}
    </details>
  );
}
