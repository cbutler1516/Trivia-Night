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
      className={`arcade-badge arcade-btn--ghost px-3 py-1.5 text-[10px] tracking-[0.15em] text-slate-400 hover:text-slate-200 ${className}`}
    >
      {muted ? "🔇 Muted" : "🔊 Sound On"}
    </button>
  );
}
