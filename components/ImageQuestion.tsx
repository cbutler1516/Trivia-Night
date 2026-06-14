"use client";

import { useState } from "react";

export interface ImageQuestionProps {
  src?: string;
  alt?: string;
  category?: string;
}

export function ImageQuestion({ src, alt, category }: ImageQuestionProps) {
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !src || hasError;

  if (showPlaceholder) {
    return (
      <div
        className="arcade-image-frame border-dashed border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-black/40 to-blue-950/40 shadow-[inset_0_0_30px_rgba(168,85,247,0.08)]"
        role="img"
        aria-label={alt ?? "Question image placeholder"}
      >
        <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/50 shadow-[0_0_24px_rgba(168,85,247,0.25)]">
            <span className="text-3xl opacity-70" aria-hidden>
              🖼️
            </span>
          </div>
          <p className="arcade-eyebrow">Visual Clue</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
            {alt ?? "Image coming soon — read the question and trust your nostalgia!"}
          </p>
          {category && (
            <span className="arcade-badge mt-3 text-[10px]">{category}</span>
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
        />
      </div>
    );
  }

  return (
    <div className="arcade-image-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? "Question image"}
        className="relative z-0 h-full w-full object-cover"
        onError={() => setHasError(true)}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-12 bg-gradient-to-t from-[#020010]/85 to-transparent"
      />
    </div>
  );
}
