"use client";

import { isMuted, toggleMuted } from "@/lib/sounds";
import { useEffect, useState } from "react";

export function MuteToggle({ className = "" }: { className?: string }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  function handleToggle() {
    setMutedState(toggleMuted());
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      className={`rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:border-white/20 hover:text-slate-300 ${className}`}
    >
      {muted ? "🔇 Muted" : "🔊 Sound"}
    </button>
  );
}
