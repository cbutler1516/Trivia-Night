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
        className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-black/40 to-blue-950/40 shadow-[inset_0_0_30px_rgba(168,85,247,0.08)] sm:aspect-video"
        role="img"
        aria-label={alt ?? "Question image placeholder"}
      >
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_3px] opacity-40" />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/50 shadow-[0_0_24px_rgba(168,85,247,0.25)]">
            <span className="text-3xl opacity-70" aria-hidden>
              🖼️
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
            Visual Clue
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
            {alt ?? "Image coming soon — read the question and trust your nostalgia!"}
          </p>
          {category && (
            <span className="mt-3 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {category}
            </span>
          )}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
        />
      </div>
    );
  }

  return (
    <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-[0_0_30px_rgba(96,165,250,0.12)] sm:aspect-video">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.06)_50%)] bg-[length:100%_3px] opacity-30 pointer-events-none z-10" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? "Question image"}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#030014]/80 to-transparent z-10"
      />
    </div>
  );
}
