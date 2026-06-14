"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MuteToggle } from "@/components/MuteToggle";
import { RetroShell } from "@/components/RetroShell";
import {
  triviaQuestions,
  totalQuestions,
  resolveQuestionType,
  type TriviaQuestion,
} from "@/data/questions";
import { SoundTestPanel } from "@/components/SoundTestPanel";
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

function getSubmissionStatusClass(count: number): string {
  if (count >= 2) return "arcade-submissions--complete";
  if (count === 1) return "arcade-submissions--partial";
  return "arcade-submissions--waiting";
}

function getTeamPanelClass(team: Team, mark?: AnswerMark): string {
  if (mark === "correct") return "arcade-host-panel--correct";
  if (mark === "incorrect") return "arcade-host-panel--incorrect";
  return team === "husbands"
    ? "arcade-host-panel--husbands"
    : "arcade-host-panel--wives";
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
  return (
    <div className={`arcade-host-panel ${getTeamPanelClass(team, mark)}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className={`arcade-eyebrow text-[10px] ${labelClass}`}>{label}</p>
        {mark === "correct" && (
          <span className="arcade-badge text-[10px] text-green-300">Correct</span>
        )}
        {mark === "incorrect" && (
          <span className="arcade-badge text-[10px] text-red-300">Incorrect</span>
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
          className="arcade-btn arcade-btn--green arcade-control-btn py-2"
        >
          Correct
        </button>
        <button
          type="button"
          onClick={onIncorrect}
          className="arcade-btn arcade-btn--ghost arcade-control-btn py-2 text-red-300"
        >
          Incorrect
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[100, 200, 500, -100].map((delta) => (
          <button
            key={delta}
            type="button"
            onClick={() => onAdjustScore(delta)}
            className="arcade-btn arcade-btn--ghost arcade-control-btn py-2"
          >
            {delta > 0 ? `+${delta}` : delta}
          </button>
        ))}
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
    <RetroShell>
      <div className="arcade-blockbuster-stripe mb-6" />

      <header className="mb-6 text-center">
        <div className="arcade-badge arcade-badge--live mb-3 gap-2 px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" />
          Game Master
        </div>
        <h1 className="arcade-title arcade-title-glow text-2xl sm:text-3xl">
          Host Control Panel
        </h1>
        <div className="mt-3 flex justify-center">
          <MuteToggle />
        </div>
      </header>

      <section className="mb-5 grid grid-cols-2 gap-3">
        <div className="arcade-score arcade-score--husbands p-4">
          <p className="arcade-eyebrow mb-1 text-blue-300">Husbands</p>
          <p className="arcade-score-value text-white">{scores.husbands}</p>
        </div>
        <div className="arcade-score arcade-score--wives p-4">
          <p className="arcade-eyebrow mb-1 text-purple-300">Wives</p>
          <p className="arcade-score-value text-white">{scores.wives}</p>
        </div>
      </section>

      <section className="mb-5 space-y-3">
        <div
          className={`arcade-timer p-5 ${
            timerUrgent ? "arcade-timer--urgent" : isTimeUp ? "arcade-timer--expired" : ""
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="arcade-eyebrow text-slate-400">Countdown Timer</p>
            <span className="text-xs text-slate-500">
              {gameState.timerRunning ? "Running" : "Paused"}
            </span>
          </div>
          <p
            className={`arcade-timer-display mb-3 ${
              timerUrgent ? "text-orange-400" : "text-blue-300"
            }`}
            style={{ fontSize: "3.25rem" }}
          >
            {timerRemaining}s
          </p>
          <div className="arcade-progress mb-4">
            <div
              className={`arcade-progress-fill ${
                timerUrgent
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-orange-400"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-blue-400"
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => startTimer(30)}
              className="arcade-btn arcade-btn--green py-2.5 text-[10px]"
            >
              Start 30s
            </button>
            <button
              type="button"
              onClick={() => pauseTimer()}
              disabled={!gameState.timerRunning}
              className="arcade-btn arcade-btn--yellow py-2.5 text-[10px]"
            >
              Pause
            </button>
            <button
              type="button"
              onClick={() => resetTimer()}
              className="arcade-btn arcade-btn--ghost py-2.5 text-[10px]"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          className={`arcade-submissions ${getSubmissionStatusClass(submissionCount)}`}
        >
          <p className="arcade-eyebrow">Submissions</p>
          <p className="arcade-display mt-1 text-2xl font-black">
            {submissionCount} / 2 submitted
          </p>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="arcade-badge arcade-badge--purple">{question.category}</span>
        <span className="arcade-badge">Q {questionNumber} / {totalQuestions}</span>
        <span className="arcade-badge arcade-badge--blue">{question.points} pts</span>
        <span className="arcade-badge text-slate-400">{getDifficulty(question.points)}</span>
      </div>

      <article className="arcade-card arcade-card--question mb-5 p-5 sm:p-6">
        <p className="arcade-eyebrow mb-3 text-slate-500">Current Question Preview</p>

        {questionType === "image" && (
          <ImageQuestion
            src={question.imageUrl}
            alt={question.imageAlt}
            category={question.category}
          />
        )}

        <h2 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
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
                  className={
                    isCorrect
                      ? "arcade-option arcade-option--correct"
                      : "arcade-option"
                  }
                >
                  <span className="mr-2 font-black text-purple-300">{letter}.</span>
                  {statement}
                </li>
              );
            })}
          </ul>
        )}

        {isAnswerRevealed ? (
          <div className="arcade-reveal mt-5">
            <p className="arcade-eyebrow mb-1 text-green-400">Answer</p>
            <p className="font-display text-base font-bold text-green-100">
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
          <div className="arcade-reveal arcade-reveal--hidden mt-5 text-center">
            <p className="text-sm text-slate-500">Answer hidden from players</p>
          </div>
        )}
      </article>

      <section className="arcade-card mb-5 p-4">
        <p className="arcade-eyebrow mb-3 text-slate-500">Team Submissions & Scoring</p>
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

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleReveal}
          disabled={isAnswerRevealed}
          className="arcade-btn arcade-btn--green py-3.5 text-xs"
        >
          Reveal Answer
        </button>
        <button
          type="button"
          onClick={() => hideAnswer()}
          disabled={!isAnswerRevealed}
          className="arcade-btn arcade-btn--ghost py-3.5 text-xs"
        >
          Hide Answer
        </button>
      </div>

      {isAnswerRevealed && (
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className="arcade-btn arcade-btn--next mb-4 w-full py-5 text-sm"
        >
          Next Question →
        </button>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="arcade-btn arcade-btn--nav-husbands py-3.5 text-xs"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className="arcade-btn arcade-btn--nav-wives py-3.5 text-xs"
        >
          Next →
        </button>
      </div>

      <form onSubmit={handleJump} className="arcade-card p-4">
        <label
          htmlFor="jump"
          className="arcade-eyebrow mb-2 block text-slate-400"
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
            className="arcade-input"
          />
          <button
            type="submit"
            className="arcade-btn arcade-btn--primary shrink-0 px-5 py-3 text-xs"
          >
            Go
          </button>
        </div>
      </form>

      <SoundTestPanel />

      <button
        type="button"
        onClick={handleResetScores}
        className="arcade-footer-hint mt-4 w-full py-2.5 transition-colors hover:text-red-300"
      >
        Reset Scores
      </button>
    </RetroShell>
  );
}
