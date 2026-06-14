import type { CSSProperties } from "react";

const categories = [
  "90s & 2000s Nostalgia",
  "Disney",
  "Movies",
  "Music",
  "Pop Culture",
  "Know Your Spouse",
];

const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 4),
  delay: `${(i * 0.7) % 6}s`,
  duration: `${4 + (i % 5)}s`,
  color: i % 3 === 0 ? "#4da6ff" : i % 3 === 1 ? "#b87cff" : "#ff6bcb",
}));

export default function Home() {
  return (
    <div className="arcade-page flex min-h-screen flex-col">
      <div className="arcade-hero-video-wrap" aria-hidden>
        <video
          className="arcade-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/retro-loop.mp4" type="video/mp4" />
        </video>
        <div className="arcade-hero-overlay" />
      </div>

      <div className="arcade-orb arcade-orb--blue" aria-hidden />
      <div className="arcade-orb arcade-orb--purple" aria-hidden />
      <div className="arcade-orb arcade-orb--pink" aria-hidden />
      <div className="arcade-scan-beam" aria-hidden />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
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

      <main className="arcade-main relative z-10">
        <div className="arcade-blockbuster-stripe mb-8" />

        <div className="mb-8 flex justify-center">
          <div className="arcade-badge arcade-badge--live gap-2 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" />
            Live Game Show
            <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400 shadow-[0_0_8px_#b87cff]" />
          </div>
        </div>

        <header className="arcade-title-glow mb-6 text-center">
          <h1 className="arcade-title text-4xl sm:text-5xl">
            The Millennial
            <br />
            Showdown
          </h1>
        </header>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
          <div className="arcade-card px-5 py-2.5">
            <p className="font-display text-center text-lg font-bold tracking-wide text-blue-100 sm:text-xl">
              Husbands{" "}
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                vs
              </span>{" "}
              Wives
            </p>
          </div>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>

        <p className="mb-10 text-center text-base leading-relaxed text-slate-300 sm:text-lg">
          A battle of nostalgia, Disney, movies, music, sports, and questionable
          memories.
        </p>

        <div className="mb-12 flex flex-col gap-4">
          <button
            type="button"
            className="arcade-btn arcade-btn--husbands group px-6 py-5 text-base"
          >
            <span
              aria-hidden
              className="arcade-btn-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <span className="relative flex items-center justify-center gap-3">
              <span className="text-2xl" aria-hidden>👨</span>
              Join Husbands
            </span>
          </button>

          <button
            type="button"
            className="arcade-btn arcade-btn--wives group px-6 py-5 text-base"
          >
            <span
              aria-hidden
              className="arcade-btn-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <span className="relative flex items-center justify-center gap-3">
              <span className="text-2xl" aria-hidden>👩</span>
              Join Wives
            </span>
          </button>
        </div>

        <section className="arcade-card p-6">
          <h2 className="arcade-eyebrow mb-4 text-center">Categories</h2>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {categories.map((category) => (
              <li
                key={category}
                className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/30 px-3.5 py-2.5 text-sm text-slate-200"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_0_6px_#b87cff]"
                />
                {category}
              </li>
            ))}
          </ul>
        </section>

        <p className="arcade-eyebrow mt-8 text-center text-slate-500">
          Insert coin to begin
        </p>
      </main>
    </div>
  );
}
