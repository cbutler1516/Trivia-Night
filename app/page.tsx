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
  color: i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#a78bfa" : "#f472b6",
}));

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-24px) translateX(8px); opacity: 0.85; }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.04); }
        }
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(96,165,250,0.5)) drop-shadow(0 0 40px rgba(167,139,250,0.3)); }
          50% { filter: drop-shadow(0 0 32px rgba(96,165,250,0.8)) drop-shadow(0 0 60px rgba(167,139,250,0.5)); }
        }
        .particle {
          animation: float-up var(--dur) ease-in-out var(--delay) infinite;
        }
        .title-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .btn-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        .scanline::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            transparent 50%,
            rgba(0, 0, 0, 0.08) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className="scanline relative flex min-h-screen flex-col overflow-hidden bg-[#030014] text-white">
        {/* Ambient gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]"
          style={{ animation: "pulse-ring 6s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-purple-600/25 blur-[90px]"
          style={{ animation: "pulse-ring 8s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[80px]"
          style={{ animation: "pulse-ring 7s ease-in-out infinite 0.5s" }}
        />

        {/* Floating particles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle absolute rounded-full"
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

        {/* Subtle moving scan beam */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          style={{ animation: "scanline 8s linear infinite" }}
        />

        <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
          {/* Logo badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                Live Game Show
              </span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
            </div>
          </div>

          {/* Title */}
          <header className="title-glow mb-6 text-center">
            <h1 className="bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300 bg-clip-text text-4xl font-black uppercase leading-[1.05] tracking-tight text-transparent sm:text-5xl">
              The Millennial
              <br />
              Showdown
            </h1>
          </header>

          {/* VS badge */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
            <div className="rounded-lg border border-blue-400/40 bg-blue-950/50 px-5 py-2 shadow-[0_0_20px_rgba(96,165,250,0.25)] backdrop-blur-sm">
              <p className="text-center text-lg font-bold tracking-wide text-blue-100 sm:text-xl">
                Husbands{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  vs
                </span>{" "}
                Wives
              </p>
            </div>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          {/* Tagline */}
          <p className="mb-10 text-center text-base leading-relaxed text-slate-300 sm:text-lg">
            A battle of nostalgia, Disney, movies, music, sports, and
            questionable memories.
          </p>

          {/* CTA buttons */}
          <div className="mb-12 flex flex-col gap-4">
            <button
              type="button"
              className="group relative overflow-hidden rounded-2xl border border-blue-400/50 bg-gradient-to-r from-blue-600/80 to-blue-500/80 px-6 py-5 text-lg font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/70 hover:shadow-[0_0_50px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98]"
            >
              <span
                aria-hidden
                className="btn-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative flex items-center justify-center gap-3">
                <span className="text-2xl" aria-hidden>
                  👨
                </span>
                Join Husbands
              </span>
            </button>

            <button
              type="button"
              className="group relative overflow-hidden rounded-2xl border border-purple-400/50 bg-gradient-to-r from-purple-600/80 to-pink-500/80 px-6 py-5 text-lg font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(168,85,247,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-purple-300/70 hover:shadow-[0_0_50px_rgba(168,85,247,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98]"
            >
              <span
                aria-hidden
                className="btn-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative flex items-center justify-center gap-3">
                <span className="text-2xl" aria-hidden>
                  👩
                </span>
                Join Wives
              </span>
            </button>
          </div>

          {/* Categories */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              Categories
            </h2>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {categories.map((category) => (
                <li
                  key={category}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/30 px-3.5 py-2.5 text-sm text-slate-200 transition-colors hover:border-purple-500/30 hover:bg-purple-950/30"
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_0_6px_#a78bfa]"
                  />
                  {category}
                </li>
              ))}
            </ul>
          </section>

          {/* Footer flair */}
          <p className="mt-8 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
            Insert coin to begin
          </p>
        </main>
      </div>
    </>
  );
}
