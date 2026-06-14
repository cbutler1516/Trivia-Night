"use client";

import { useState } from "react";
import {
  getSoundPath,
  playSoundWithResult,
  type SoundEvent,
} from "@/lib/sounds";

const TEST_SOUNDS: { label: string; event: SoundEvent }[] = [
  { label: "Test Submit", event: "answerSubmitted" },
  { label: "Test Reveal", event: "answerRevealed" },
  { label: "Test Countdown", event: "countdownWarning" },
  { label: "Test Timer Expired", event: "timerExpired" },
  { label: "Test Points Awarded", event: "pointsAwarded" },
  { label: "Test Game Complete", event: "gameComplete" },
];

type TestStatus = {
  label: string;
  path: string;
  ok: boolean;
  reason?: string;
};

export function SoundTestPanel() {
  const [status, setStatus] = useState<TestStatus | null>(null);

  function handleTest(label: string, event: SoundEvent) {
    const path = getSoundPath(event);
    console.log(`[sounds] test panel path: ${path}`);

    void playSoundWithResult(event).then((result) => {
      setStatus({
        label,
        path: result.path,
        ok: result.ok,
        reason: result.reason,
      });
    });
  }

  return (
    <section className="arcade-card mt-6 p-4">
      <p className="arcade-eyebrow mb-3 text-slate-500">Sound Test</p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TEST_SOUNDS.map(({ label, event }) => (
          <button
            key={event}
            type="button"
            onClick={() => handleTest(label, event)}
            className="arcade-btn arcade-btn--ghost py-2.5 text-[10px]"
          >
            {label}
          </button>
        ))}
      </div>

      {status && (
        <div
          className={`mt-4 rounded-xl border px-3 py-3 ${
            status.ok
              ? "border-green-500/40 bg-green-950/25"
              : "border-red-500/40 bg-red-950/25"
          }`}
        >
          <p
            className={`arcade-eyebrow mb-1 ${
              status.ok ? "text-green-400" : "text-red-400"
            }`}
          >
            {status.ok ? "Success" : "Failed"} — {status.label}
          </p>
          <p className="font-mono text-xs text-slate-300">{status.path}</p>
          {status.reason && (
            <p className="mt-1 text-xs text-slate-400">{status.reason}</p>
          )}
        </div>
      )}
    </section>
  );
}
