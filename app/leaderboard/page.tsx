"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { triviaQuestions, totalQuestions } from "@/data/questions";
import {
  GAME_STATE_UPDATED_EVENT,
  getGameState,
  type GameState,
} from "@/lib/game-store";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 11) % 100}%`,
  top: `${(i * 29 + 5) % 100}%`,
  size: 2 + (i % 4),
  delay: `${(i * 0.55) % 5}s`,
  duration: `${4 + (i % 5)}s`,
  color: i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#a78bfa" : "#f472b6",
}));

type Leader = "husbands" | "wives" | "tie";

function getLeader(scores: GameState["scores"]): Leader {
  if (scores.husbands > scores.wives) return "husbands";
  if (scores.wives > scores.husbands) return "wives";
  return "tie";
}

export default function LeaderboardPage() {
  const [gameState, setGameState] = useState<GameState>(() => getGameState());

  useEffect(() => {
    const refresh = () => setGameState(getGameState());
    refresh();
    window.addEventListener(GAME_STATE_UPDATED_EVENT, refresh);
    const poll = setInterval(refresh, 500);
    return () => {
      window.removeEventListener(GAME_STATE_UPDATED_EVENT, refresh);
      clearInterval(poll);
    };
  }, []);

  const currentIndex = Math.min(
    Math.max(0, gameState.currentQuestionIndex),
    totalQuestions - 1,
  );
  const currentQuestion = triviaQuestions[currentIndex];
  const questionNumber = currentIndex + 1;
  const { scores } = gameState;
  const leader = getLeader(scores);

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); opacity: 0.25; }
          50% { transform: translateY(-20px); opacity: 0.75; }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(251,191,36,0.4)); }
          50% { filter: drop-shadow(0 0 40px rgba(251,191,36,0.8)); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes vs-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .particle {
          animation: float-up var(--dur) ease-in-out var(--delay) infinite;
        }
        .winner-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .vs-badge {
          animation: vs-pulse 2s ease-in-out infinite;
        }
        .scanline::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 50%, rgba(0,0,0,0.08) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className="scanline relative flex min-h-screen flex-col overflow-hidden bg-[#030014] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/25 blur-[100px]"
          style={{ animation: "pulse-ring 6s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-purple-600/25 blur-[90px]"
          style={{ animation: "pulse-ring 7s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/15 blur-[80px]"
          style={{ animation: "pulse-ring 8s ease-in-out infinite 0.5s" }}
        />

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

        <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          {/* Header */}
          <header className="mb-6 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">
              Live Standings
            </p>
            <h1 className="bg-gradient-to-r from-blue-300 via-purple-200 to-pink-300 bg-clip-text text-3xl font-black uppercase tracking-tight text-transparent sm:text-4xl">
              Leaderboard
            </h1>
          </header>

          {/* Round info */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-purple-500/40 bg-purple-950/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-purple-200 shadow-[0_0_16px_rgba(168,85,247,0.2)]">
              {currentQuestion.category}
            </span>
            <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-semibold text-slate-300">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>

          {/* Winner banner */}
          <div className="mb-8 text-center">
            {leader === "tie" ? (
              <div className="winner-glow inline-block rounded-2xl border border-yellow-500/40 bg-yellow-950/30 px-8 py-4 backdrop-blur-md">
                <span className="mb-1 block text-3xl" aria-hidden>
                  ⚔️
                </span>
                <p className="text-xl font-black uppercase tracking-wider text-yellow-200 sm:text-2xl">
                  It&apos;s a Tie!
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-yellow-400/70">
                  Dead heat
                </p>
              </div>
            ) : leader === "husbands" ? (
              <div className="winner-glow inline-block rounded-2xl border border-blue-400/50 bg-blue-950/40 px-8 py-4 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <span className="mb-1 block text-4xl" aria-hidden>
                  👑
                </span>
                <p className="text-xl font-black uppercase tracking-wider text-blue-100 sm:text-2xl">
                  Husbands Lead!
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-300/70">
                  Winning team
                </p>
              </div>
            ) : (
              <div className="winner-glow inline-block rounded-2xl border border-purple-400/50 bg-purple-950/40 px-8 py-4 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <span className="mb-1 block text-4xl" aria-hidden>
                  👑
                </span>
                <p className="text-xl font-black uppercase tracking-wider text-purple-100 sm:text-2xl">
                  Wives Lead!
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-purple-300/70">
                  Winning team
                </p>
              </div>
            )}
          </div>

          {/* Scoreboard */}
          <section className="flex flex-1 flex-col justify-center">
            <div className="mb-4 flex items-center justify-center">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
              <span className="vs-badge mx-4 rounded-lg border border-orange-500/40 bg-orange-950/40 px-4 py-1 text-lg font-black text-orange-300">
                VS
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Husbands */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-5 text-center backdrop-blur-md transition-all sm:p-6 ${
                  leader === "husbands"
                    ? "border-blue-400/60 bg-blue-950/40 shadow-[0_0_50px_rgba(59,130,246,0.35)]"
                    : leader === "tie"
                      ? "border-blue-400/40 bg-blue-950/30 shadow-[0_0_24px_rgba(59,130,246,0.15)]"
                      : "border-blue-500/20 bg-blue-950/20 opacity-80"
                }`}
              >
                {leader === "husbands" && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                  />
                )}
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-300">
                  Husbands
                </p>
                <p className="text-5xl font-black tabular-nums leading-none text-white sm:text-6xl">
                  {scores.husbands}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-blue-400/60">
                  points
                </p>
              </div>

              {/* Wives */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-5 text-center backdrop-blur-md transition-all sm:p-6 ${
                  leader === "wives"
                    ? "border-purple-400/60 bg-purple-950/40 shadow-[0_0_50px_rgba(168,85,247,0.35)]"
                    : leader === "tie"
                      ? "border-purple-400/40 bg-purple-950/30 shadow-[0_0_24px_rgba(168,85,247,0.15)]"
                      : "border-purple-500/20 bg-purple-950/20 opacity-80"
                }`}
              >
                {leader === "wives" && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  />
                )}
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-300">
                  Wives
                </p>
                <p className="text-5xl font-black tabular-nums leading-none text-white sm:text-6xl">
                  {scores.wives}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-purple-400/60">
                  points
                </p>
              </div>
            </div>

            {/* Score diff */}
            {leader !== "tie" && (
              <p className="mt-6 text-center text-sm text-slate-400">
                Lead by{" "}
                <span className="font-bold text-white">
                  {Math.abs(scores.husbands - scores.wives)}
                </span>{" "}
                points
              </p>
            )}
          </section>

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-slate-600">
            Updates live from game
          </p>
        </main>
      </div>
    </>
  );
}
