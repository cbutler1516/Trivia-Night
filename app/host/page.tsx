"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { MuteToggle } from "@/components/MuteToggle";
import {
  triviaQuestions,
  totalQuestions,
  resolveQuestionType,
  type TriviaQuestion,
} from "@/data/questions";
import { ImageQuestion } from "@/components/ImageQuestion";
import {
  GAME_STATE_UPDATED_EVENT,
  adjustScore,
  getGameState,
  getSubmissionCount,
  getTimerRemaining,
  hideAnswer,
  isTimerExpired,
  markAnswerCorrect,
  markAnswerIncorrect,
  pauseTimer,
  resetTimer,
  revealAnswer,
  saveGameState,
  setCurrentQuestionIndex,
  startTimer,
  type AnswerMark,
  type GameState,
  type Team,
} from "@/lib/game-store";
import {
  playAnswerRevealed,
  playGameComplete,
  playPointsAwarded,
  playTimerExpired,
} from "@/lib/sounds";

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 23 + 3) % 100}%`,
  top: `${(i * 31 + 7) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.5) % 4}s`,
  duration: `${5 + (i % 3)}s`,
  color: i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#a78bfa" : "#f472b6",
}));

function getCorrectAnswerLabel(question: TriviaQuestion): string {
  if (question.statements) {
    const index = question.answer.toUpperCase().charCodeAt(0) - 65;
    return `${question.answer}: ${question.statements[index]}`;
  }
  return question.answer;
}

function getDifficulty(points: number): string {
  if (points >= 500) return "Bonus";
  if (points >= 300) return "Hard";
  if (points >= 200) return "Medium";
  return "Easy";
}

function getSubmissionStatusStyle(count: number): string {
  if (count >= 2) {
    return "border-green-500/40 bg-green-950/30 text-green-200";
  }
  if (count === 1) {
    return "border-yellow-500/40 bg-yellow-950/30 text-yellow-200";
  }
  return "border-red-500/30 bg-red-950/20 text-red-300/80";
}

function getTeamCardStyle(team: Team, mark?: AnswerMark): string {
  if (mark === "correct") return "border-green-500/50 bg-green-950/30";
  if (mark === "incorrect") return "border-red-500/50 bg-red-950/30";
  return team === "husbands"
    ? "border-blue-500/30 bg-blue-950/20"
    : "border-purple-500/30 bg-purple-950/20";
}

function TeamScoringPanel({
  team,
  label,
  labelClass,
  submission,
  mark,
  onCorrect,
  onIncorrect,
  onAdjustScore,
}: {
  team: Team;
  label: string;
  labelClass: string;
  submission?: string;
  mark?: AnswerMark;
  onCorrect: () => void;
  onIncorrect: () => void;
  onAdjustScore: (delta: number) => void;
}) {
  const btnClass =
    "rounded-lg border py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors";

  return (
    <div className={`rounded-xl border px-4 py-3 ${getTeamCardStyle(team, mark)}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${labelClass}`}>
          {label}
        </p>
        {mark === "correct" && (
          <span className="rounded-full border border-green-500/40 bg-green-900/40 px-2 py-0.5 text-[10px] font-bold uppercase text-green-300">
            Correct
          </span>
        )}
        {mark === "incorrect" && (
          <span className="rounded-full border border-red-500/40 bg-red-900/40 px-2 py-0.5 text-[10px] font-bold uppercase text-red-300">
            Incorrect
          </span>
        )}
      </div>
      {submission ? (
        <p className="mb-3 text-sm font-medium text-white">{submission}</p>
      ) : (
        <p className="mb-3 text-sm italic text-slate-500">No answer yet</p>
      )}
      <div className="mb-2 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onCorrect}
          className={`${btnClass} border-green-500/40 bg-green-900/30 text-green-200 hover:bg-green-800/50`}
        >
          Correct
        </button>
        <button
          type="button"
          onClick={onIncorrect}
          className={`${btnClass} border-red-500/40 bg-red-900/30 text-red-200 hover:bg-red-800/50`}
        >
          Incorrect
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => onAdjustScore(100)}
          className={`${btnClass} border-white/10 bg-black/30 text-slate-300 hover:bg-white/10`}
        >
          +100
        </button>
        <button
          type="button"
          onClick={() => onAdjustScore(200)}
          className={`${btnClass} border-white/10 bg-black/30 text-slate-300 hover:bg-white/10`}
        >
          +200
        </button>
        <button
          type="button"
          onClick={() => onAdjustScore(500)}
          className={`${btnClass} border-white/10 bg-black/30 text-slate-300 hover:bg-white/10`}
        >
          +500
        </button>
        <button
          type="button"
          onClick={() => onAdjustScore(-100)}
          className={`${btnClass} border-white/10 bg-black/30 text-slate-300 hover:bg-white/10`}
        >
          -100
        </button>
      </div>
    </div>
  );
}

export default function HostPage() {
  const [gameState, setGameState] = useState<GameState>(() => getGameState());
  const [jumpInput, setJumpInput] = useState("1");
  const [, setTick] = useState(0);
  const soundPlayedRef = useRef({ timer: -1 });

  const currentIndex = Math.min(
    Math.max(0, gameState.currentQuestionIndex),
    totalQuestions - 1,
  );
  const question = triviaQuestions[currentIndex];
  const questionType = resolveQuestionType(question);
  const questionNumber = currentIndex + 1;
  const { isAnswerRevealed, scores, submissions, answerMarks } = gameState;
  const submissionCount = getSubmissionCount(submissions);
  const timerRemaining = getTimerRemaining(gameState);
  const timerUrgent = timerRemaining <= 10 && gameState.timerRunning;
  const isTimeUp = isTimerExpired(gameState);

  useEffect(() => {
    const refresh = () => setGameState(getGameState());

    refresh();
    window.addEventListener(GAME_STATE_UPDATED_EVENT, refresh);

    const poll = setInterval(refresh, 500);
    const tick = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      window.removeEventListener(GAME_STATE_UPDATED_EVENT, refresh);
      clearInterval(poll);
      clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    setJumpInput(String(questionNumber));
    soundPlayedRef.current.timer = -1;
  }, [questionNumber]);

  useEffect(() => {
    if (isTimeUp && soundPlayedRef.current.timer !== currentIndex) {
      soundPlayedRef.current.timer = currentIndex;
      playTimerExpired();
    }
  }, [isTimeUp, currentIndex]);

  function goToQuestion(index: number) {
    const clamped = Math.max(0, Math.min(totalQuestions - 1, index));
    setCurrentQuestionIndex(clamped);
  }

  function handlePrevious() {
    goToQuestion(currentIndex - 1);
  }

  function handleNext() {
    if (currentIndex >= totalQuestions - 1) {
      playGameComplete();
    }
    goToQuestion(currentIndex + 1);
  }

  function handleReveal() {
    revealAnswer();
    playAnswerRevealed();
  }

  function handleMarkCorrect(team: Team) {
    markAnswerCorrect(team, question.points);
    playPointsAwarded();
  }

  function handleMarkIncorrect(team: Team) {
    markAnswerIncorrect(team);
  }

  function handleAdjustScore(team: Team, delta: number) {
    adjustScore(team, delta);
    if (delta > 0) playPointsAwarded();
  }

  function handleJump(e: FormEvent) {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!Number.isNaN(num) && num >= 1 && num <= totalQuestions) {
      goToQuestion(num - 1);
    }
  }

  function handleResetScores() {
    const state = getGameState();
    state.scores = { husbands: 0, wives: 0 };
    saveGameState(state);
  }

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalQuestions - 1;
  const timerPercent =
    gameState.timerDuration > 0
      ? (timerRemaining / gameState.timerDuration) * 100
      : 0;

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-14px); opacity: 0.6; }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        .particle {
          animation: float-up var(--dur) ease-in-out var(--delay) infinite;
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

      <div className="scanline relative min-h-screen overflow-hidden bg-[#030014] text-white">
        {/* Ambient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-[90px]"
          style={{ animation: "pulse-ring 6s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-purple-600/20 blur-[80px]"
          style={{ animation: "pulse-ring 7s ease-in-out infinite 1s" }}
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

        <main className="relative z-10 mx-auto w-full max-w-lg px-4 py-6 sm:px-6 sm:py-8">
          {/* Header */}
          <header className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">
                Game Master
              </span>
            </div>
            <h1 className="bg-gradient-to-r from-blue-300 via-purple-200 to-pink-300 bg-clip-text text-2xl font-black uppercase tracking-tight text-transparent sm:text-3xl">
              Host Control Panel
            </h1>
            <div className="mt-3 flex justify-center">
              <MuteToggle />
            </div>
          </header>

          {/* Scores */}
          <section className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-blue-400/40 bg-blue-950/30 p-4 text-center backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                Husbands
              </p>
              <p className="text-3xl font-black tabular-nums text-white">
                {scores.husbands}
              </p>
            </div>
            <div className="rounded-2xl border border-purple-400/40 bg-purple-950/30 p-4 text-center backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-300">
                Wives
              </p>
              <p className="text-3xl font-black tabular-nums text-white">
                {scores.wives}
              </p>
            </div>
          </section>

          {/* Timer + submission status */}
          <section className="mb-5 space-y-3">
            <div
              className={`rounded-2xl border bg-white/5 p-5 backdrop-blur-md ${
                timerUrgent
                  ? "border-orange-500/40 shadow-[0_0_24px_rgba(251,146,60,0.15)]"
                  : "border-white/10"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Countdown Timer
                </p>
                <span className="text-xs text-slate-500">
                  {gameState.timerRunning ? "Running" : "Paused"}
                </span>
              </div>
              <p
                className={`mb-3 text-center text-5xl font-black tabular-nums ${
                  timerUrgent ? "text-orange-400" : "text-blue-300"
                }`}
              >
                {timerRemaining}s
              </p>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-black/40">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    timerUrgent
                      ? "bg-gradient-to-r from-orange-500 to-pink-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => startTimer(30)}
                  className="rounded-xl border border-green-400/50 bg-green-950/40 py-2.5 text-xs font-bold uppercase tracking-wider text-green-200 transition-all hover:bg-green-900/50"
                >
                  Start 30s Timer
                </button>
                <button
                  type="button"
                  onClick={() => pauseTimer()}
                  disabled={!gameState.timerRunning}
                  className="rounded-xl border border-yellow-400/50 bg-yellow-950/40 py-2.5 text-xs font-bold uppercase tracking-wider text-yellow-200 transition-all hover:bg-yellow-900/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Pause Timer
                </button>
                <button
                  type="button"
                  onClick={() => resetTimer()}
                  className="rounded-xl border border-slate-500/40 bg-slate-800/60 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all hover:bg-slate-700/60"
                >
                  Reset Timer
                </button>
              </div>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 text-center backdrop-blur-md ${getSubmissionStatusStyle(submissionCount)}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Submissions
              </p>
              <p className="mt-1 text-2xl font-black tabular-nums">
                {submissionCount} / 2 submitted
              </p>
            </div>
          </section>

          {/* Question meta */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-purple-500/40 bg-purple-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-200">
              {question.category}
            </span>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-slate-300">
              Q {questionNumber} / {totalQuestions}
            </span>
            <span className="rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-200">
              {question.points} pts
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
              {getDifficulty(question.points)}
            </span>
          </div>

          {/* Question preview */}
          <article className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(96,165,250,0.08)] backdrop-blur-md sm:p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Current Question Preview
            </p>

            {questionType === "image" && (
              <ImageQuestion
                src={question.imageUrl}
                alt={question.imageAlt}
                category={question.category}
              />
            )}

            <h2 className="text-lg font-bold leading-snug text-white sm:text-xl">
              {question.question}
            </h2>

            {question.statements && (
              <ul className="mt-4 space-y-2">
                {question.statements.map((statement, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const isCorrect =
                    isAnswerRevealed &&
                    question.answer.toUpperCase() === letter;
                  return (
                    <li
                      key={letter}
                      className={`rounded-xl border px-3.5 py-2.5 text-sm ${
                        isCorrect
                          ? "border-green-500/50 bg-green-950/30 text-green-200"
                          : "border-white/10 bg-black/20 text-slate-300"
                      }`}
                    >
                      <span className="mr-2 font-black text-purple-300">
                        {letter}.
                      </span>
                      {statement}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Answer reveal */}
            {isAnswerRevealed ? (
              <div className="mt-5 rounded-xl border border-green-500/40 bg-green-950/30 px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400">
                  Answer
                </p>
                <p className="text-base font-bold text-green-100">
                  {getCorrectAnswerLabel(question)}
                </p>
                {question.acceptableAnswers &&
                  question.acceptableAnswers.length > 0 && (
                    <p className="mt-2 text-xs text-green-300/70">
                      Also accept: {question.acceptableAnswers.join(", ")}
                    </p>
                  )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-center">
                <p className="text-sm text-slate-500">Answer hidden from players</p>
              </div>
            )}
          </article>

          {/* Team submissions + scoring */}
          <section className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Team Submissions & Scoring
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TeamScoringPanel
                team="husbands"
                label="Husbands"
                labelClass="text-blue-300"
                submission={submissions.husbands}
                mark={answerMarks.husbands}
                onCorrect={() => handleMarkCorrect("husbands")}
                onIncorrect={() => handleMarkIncorrect("husbands")}
                onAdjustScore={(delta) => handleAdjustScore("husbands", delta)}
              />
              <TeamScoringPanel
                team="wives"
                label="Wives"
                labelClass="text-purple-300"
                submission={submissions.wives}
                mark={answerMarks.wives}
                onCorrect={() => handleMarkCorrect("wives")}
                onIncorrect={() => handleMarkIncorrect("wives")}
                onAdjustScore={(delta) => handleAdjustScore("wives", delta)}
              />
            </div>
          </section>

          {/* Reveal / Hide */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleReveal}
              disabled={isAnswerRevealed}
              className="rounded-xl border border-green-400/50 bg-gradient-to-r from-green-700/80 to-emerald-600/80 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Reveal Answer
            </button>
            <button
              type="button"
              onClick={() => hideAnswer()}
              disabled={!isAnswerRevealed}
              className="rounded-xl border border-slate-500/40 bg-slate-800/80 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Hide Answer
            </button>
          </div>

          {isAnswerRevealed && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="mb-4 w-full rounded-2xl border border-purple-400/50 bg-gradient-to-r from-purple-600/90 to-pink-600/90 py-5 text-lg font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Next Question →
            </button>
          )}

          {/* Navigation */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="rounded-xl border border-blue-400/40 bg-blue-950/50 py-3.5 text-sm font-bold uppercase tracking-wider text-blue-200 transition-all hover:border-blue-300/60 hover:bg-blue-900/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="rounded-xl border border-purple-400/40 bg-purple-950/50 py-3.5 text-sm font-bold uppercase tracking-wider text-purple-200 transition-all hover:border-purple-300/60 hover:bg-purple-900/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>

          {/* Jump to question */}
          <form
            onSubmit={handleJump}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
          >
            <label
              htmlFor="jump"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
            >
              Jump to Question #
            </label>
            <div className="flex gap-2">
              <input
                id="jump"
                type="number"
                min={1}
                max={totalQuestions}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition-all focus:border-purple-400/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl border border-purple-400/50 bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                Go
              </button>
            </div>
          </form>

          {/* Reset scores */}
          <button
            type="button"
            onClick={handleResetScores}
            className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:border-red-500/30 hover:text-red-300"
          >
            Reset Scores
          </button>
        </main>
      </div>
    </>
  );
}
