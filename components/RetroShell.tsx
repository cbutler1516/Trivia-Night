"use client";

import type { CSSProperties, ReactNode } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 5) % 100}%`,
  top: `${(i * 27 + 9) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.6) % 5}s`,
  duration: `${5 + (i % 4)}s`,
  color: i % 3 === 0 ? "#4da6ff" : i % 3 === 1 ? "#b87cff" : "#ff6bcb",
}));

export function RetroShell({ children }: { children: ReactNode }) {
  return (
    <div className="arcade-page flex min-h-screen flex-col">
      <BackgroundVideo />
      <div className="arcade-orb arcade-orb--blue" aria-hidden />
      <div className="arcade-orb arcade-orb--purple" aria-hidden />
      <div className="arcade-orb arcade-orb--pink" aria-hidden />
      <div className="arcade-scan-beam" aria-hidden />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        {particles.map((p) => (
          <span
            key={p.id}
            className="arcade-particle"
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
                "--delay": p.delay,
                "--dur": p.duration,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <main className="arcade-main">{children}</main>
    </div>
  );
}
