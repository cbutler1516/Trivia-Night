"use client";

import {
  disableHomeMusic,
  enableHomeMusic,
  isHomeMusicEnabled,
} from "@/lib/home-music";
import { useEffect, useState } from "react";

export function HomeMusicToggle({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isHomeMusicEnabled());
  }, []);

  async function handleToggle() {
    if (enabled) {
      disableHomeMusic();
      setEnabled(false);
      return;
    }

    const started = await enableHomeMusic();
    setEnabled(started);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Turn background music off" : "Turn background music on"}
      aria-pressed={enabled}
      className={`arcade-badge arcade-btn--ghost px-3 py-1.5 text-[10px] tracking-[0.15em] text-slate-400 hover:text-slate-200 ${className}`}
    >
      {enabled ? "🎵 Music On" : "🎵 Music Off"}
    </button>
  );
}
