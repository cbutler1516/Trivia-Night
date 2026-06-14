"use client";

import { useEffect, useState } from "react";
import { RetroShell } from "@/components/RetroShell";
import { triviaQuestions, totalQuestions } from "@/data/questions";
import {
  GAME_STATE_UPDATED_EVENT,
  getGameState,
  type GameState,
} from "@/lib/game-store";

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
    <RetroShell>
      <div className="arcade-blockbuster-stripe mb-6" />

      <header className="mb-6 text-center">
        <p className="arcade-eyebrow mb-2">Live Standings</p>
        <h1 className="arcade-title arcade-title-glow text-3xl sm:text-4xl">
          Leaderboard
        </h1>
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="arcade-badge arcade-badge--purple px-4 py-1.5">
          {currentQuestion.category}
        </span>
        <span className="arcade-badge px-4 py-1.5">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <div className="mb-8 text-center">
        {leader === "tie" ? (
          <div className="arcade-winner arcade-winner--tie">
            <span className="mb-1 block text-3xl" aria-hidden>⚔️</span>
            <p className="font-display text-xl font-black uppercase tracking-wider text-yellow-200 sm:text-2xl">
              It&apos;s a Tie!
            </p>
            <p className="arcade-eyebrow mt-1 text-yellow-400/70">Dead heat</p>
          </div>
        ) : leader === "husbands" ? (
          <div className="arcade-winner arcade-winner--husbands">
            <span className="mb-1 block text-4xl" aria-hidden>👑</span>
            <p className="font-display text-xl font-black uppercase tracking-wider text-blue-100 sm:text-2xl">
              Husbands Lead!
            </p>
            <p className="arcade-eyebrow mt-1 text-blue-300/70">Winning team</p>
          </div>
        ) : (
          <div className="arcade-winner arcade-winner--wives">
            <span className="mb-1 block text-4xl" aria-hidden>👑</span>
            <p className="font-display text-xl font-black uppercase tracking-wider text-purple-100 sm:text-2xl">
              Wives Lead!
            </p>
            <p className="arcade-eyebrow mt-1 text-purple-300/70">Winning team</p>
          </div>
        )}
      </div>

      <section className="flex flex-1 flex-col justify-center">
        <div className="mb-4 flex items-center justify-center">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
          <span className="arcade-vs mx-4 rounded-lg px-4 py-1 text-lg font-black">
            VS
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`arcade-score arcade-score--husbands relative p-5 sm:p-6 ${
              leader === "husbands"
                ? "arcade-score--leading"
                : leader === "tie"
                  ? ""
                  : "arcade-score--trailing"
            }`}
          >
            {leader === "husbands" && (
              <div
                aria-hidden
                className="arcade-score-bar text-blue-400"
              />
            )}
            <p className="arcade-eyebrow mb-2 text-blue-300">Husbands</p>
            <p className="arcade-score-value text-white">{scores.husbands}</p>
            <p className="arcade-eyebrow mt-2 text-[10px] text-blue-400/60">points</p>
          </div>

          <div
            className={`arcade-score arcade-score--wives relative p-5 sm:p-6 ${
              leader === "wives"
                ? "arcade-score--leading"
                : leader === "tie"
                  ? ""
                  : "arcade-score--trailing"
            }`}
          >
            {leader === "wives" && (
              <div
                aria-hidden
                className="arcade-score-bar text-purple-400"
              />
            )}
            <p className="arcade-eyebrow mb-2 text-purple-300">Wives</p>
            <p className="arcade-score-value text-white">{scores.wives}</p>
            <p className="arcade-eyebrow mt-2 text-[10px] text-purple-400/60">points</p>
          </div>
        </div>

        {leader !== "tie" && (
          <p className="mt-6 text-center text-sm text-slate-400">
            Lead by{" "}
            <span className="font-display font-bold text-white">
              {Math.abs(scores.husbands - scores.wives)}
            </span>{" "}
            points
          </p>
        )}
      </section>

      <p className="arcade-footer-hint mt-8 text-center">
        Updates live from game
      </p>
    </RetroShell>
  );
}
