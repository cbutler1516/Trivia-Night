"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { MuteToggle } from "@/components/MuteToggle";
import { HomeMusicToggle } from "@/components/HomeMusicToggle";
import { RetroShell } from "@/components/RetroShell";
import { pauseHomeMusic } from "@/lib/home-music";
import {
  triviaQuestions,
  totalQuestions,
  resolveQuestionType,
  type QuestionType,
} from "@/data/questions";
import { ImageQuestion } from "@/components/ImageQuestion";
import {
  GAME_STATE_UPDATED_EVENT,
  getGameState,
  getSubmissionsForQuestion,
  getTimerRemaining,
  isTimerExpired,
  registerTeamCaptain,
  submitAnswer,
  unregisterTeamCaptain,
  type GameState,
  type Team,
} from "@/lib/game-store";
import {
  buildMultipleChoiceOptions,
} from "@/lib/multiple-choice";
import {
  playAnswerSubmitted,
  playTimerExpired,
} from "@/lib/sounds";

const PLAYER_SESSION_KEY = "millennial-showdown-player-session";

interface PlayerSession {
  team: Team;
  captainName: string;
}

function getPlayerSession(): PlayerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAYER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerSession;
  } catch {
    return null;
  }
}

function savePlayerSession(session: PlayerSession): void {
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(session));
}

function clearPlayerSession(): void {
  localStorage.removeItem(PLAYER_SESSION_KEY);
}

function getTypeLabel(type: QuestionType): string {
  switch (type) {
    case "two-lies":
      return "Two Lies & A Truth";
    case "multiple-choice":
      return "Multiple Choice";
    case "image":
      return "Image Question";
    default:
      return "Standard";
  }
}

function usesTextInput(type: QuestionType): boolean {
  return type === "standard" || type === "image";
}

function getDifficulty(points: number): string {
  if (points >= 500) return "Bonus";
  if (points >= 300) return "Hard";
  if (points >= 200) return "Medium";
  return "Easy";
}

function difficultyClass(points: number): string {
  if (points >= 500) return "arcade-difficulty--bonus";
  if (points >= 300) return "arcade-difficulty--hard";
  if (points >= 200) return "arcade-difficulty--medium";
  return "arcade-difficulty--easy";
}

export default function PlayPage() {
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(
    null,
  );
  const [gameState, setGameState] = useState<GameState>(() => getGameState());
  const [captainName, setCaptainName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [textAnswer, setTextAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const soundPlayedRef = useRef({ timer: -1 });

  useEffect(() => {
    setPlayerSession(getPlayerSession());
    setGameState(getGameState());

    const refresh = () => setGameState(getGameState());
    window.addEventListener(GAME_STATE_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    const poll = setInterval(refresh, 500);
    const tick = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      window.removeEventListener(GAME_STATE_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
      clearInterval(poll);
      clearInterval(tick);
    };
  }, []);

  const currentIndex = Math.min(
    Math.max(0, gameState.currentQuestionIndex),
    totalQuestions - 1,
  );
  const question = triviaQuestions[currentIndex];
  const questionType = resolveQuestionType(question);
  const questionNumber = currentIndex + 1;

  const multipleChoiceOptions = useMemo(() => {
    if (questionType !== "multiple-choice") return [];
    return buildMultipleChoiceOptions(question);
  }, [question.id, questionType]);

  const teamSubmission = playerSession
    ? getSubmissionsForQuestion(gameState, currentIndex)[playerSession.team]
    : undefined;

  const timerRemaining = getTimerRemaining(gameState);
  const isTimeUp = isTimerExpired(gameState);
  const timerUrgent = timerRemaining <= 10 && gameState.timerRunning;
  const timerPercent =
    gameState.timerDuration > 0
      ? (timerRemaining / gameState.timerDuration) * 100
      : 0;

  const isLocked = !!teamSubmission;
  const isAnswering = !isLocked && !isTimeUp;

  useEffect(() => {
    setTextAnswer("");
    setSelectedChoice(null);
    setSelectedLetter(null);
    soundPlayedRef.current = { timer: -1 };

    if (!playerSession) return;

    const submitted = getSubmissionsForQuestion(
      getGameState(),
      currentIndex,
    )[playerSession.team];

    if (!submitted) return;

    if (questionType === "multiple-choice") {
      setSelectedChoice(submitted);
    } else if (questionType === "two-lies") {
      setSelectedLetter(submitted.toUpperCase());
    }
  }, [currentIndex, playerSession, questionType]);

  useEffect(() => {
    if (isTimeUp && soundPlayedRef.current.timer !== currentIndex) {
      soundPlayedRef.current.timer = currentIndex;
      playTimerExpired();
    }
  }, [isTimeUp, currentIndex]);

  useEffect(() => {
    if (!playerSession) return;

    const registeredCaptain = gameState.teamCaptains[playerSession.team];
    if (registeredCaptain && registeredCaptain !== playerSession.captainName) {
      clearPlayerSession();
      setPlayerSession(null);
      setJoinError(
        `${playerSession.team === "husbands" ? "Husbands" : "Wives"} captain already joined as ${registeredCaptain}.`,
      );
      return;
    }

    if (!registeredCaptain) {
      registerTeamCaptain(playerSession.team, playerSession.captainName);
    }
  }, [gameState.teamCaptains, playerSession]);

  useEffect(() => {
    if (playerSession) {
      pauseHomeMusic();
    }
  }, [playerSession]);

  const userAnswer =
    questionType === "standard" || questionType === "image"
      ? textAnswer
      : questionType === "two-lies"
        ? (selectedLetter ?? "")
        : (selectedChoice ?? "");

  function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!captainName.trim() || !selectedTeam) return;

    const result = registerTeamCaptain(selectedTeam, captainName);
    if (!result.ok) {
      setJoinError(result.message);
      return;
    }

    const session: PlayerSession = {
      team: selectedTeam,
      captainName: captainName.trim(),
    };
    savePlayerSession(session);
    setPlayerSession(session);
    setJoinError(null);
  }

  function handleSelectTeam(team: Team) {
    const registeredCaptain = gameState.teamCaptains[team];
    if (registeredCaptain) {
      setJoinError(
        `${team === "husbands" ? "Husbands" : "Wives"} captain already joined as ${registeredCaptain}.`,
      );
      return;
    }

    setSelectedTeam(team);
    setJoinError(null);
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!playerSession || !isAnswering || !userAnswer.trim()) return;

    const toSubmit =
      questionType === "two-lies"
        ? userAnswer.toUpperCase()
        : userAnswer.trim();

    submitAnswer(playerSession.team, toSubmit);
    playAnswerSubmitted();
  }

  function handleSelectChoice(choice: string) {
    if (!isAnswering) return;
    setSelectedChoice(choice);
  }

  function handleSelectStatement(letter: string) {
    if (!isAnswering) return;
    setSelectedLetter(letter);
  }

  function handleResetPlayer() {
    if (playerSession) {
      unregisterTeamCaptain(playerSession.team);
    }
    clearPlayerSession();
    setPlayerSession(null);
    setCaptainName("");
    setSelectedTeam(null);
    setJoinError(null);
    setTextAnswer("");
    setSelectedChoice(null);
    setSelectedLetter(null);
  }

  if (!playerSession) {
    return (
      <RetroShell>
        <div className="flex flex-1 flex-col justify-center">
          <header className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <HomeMusicToggle />
              <MuteToggle />
            </div>
            <p className="arcade-eyebrow mb-3">Join the Game</p>
            <h1 className="arcade-title arcade-title-glow text-3xl">
              The Millennial Showdown
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              One player per team should join the game.
            </p>
          </header>

          <form onSubmit={handleJoin} className="flex flex-col gap-5">
            <div>
              <p className="arcade-eyebrow mb-3 text-center text-slate-400">
                Choose a Team Captain
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleSelectTeam("husbands")}
                  disabled={!!gameState.teamCaptains.husbands}
                  className={`arcade-team-btn arcade-team-btn--husbands ${selectedTeam === "husbands" ? "is-active" : ""} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Husbands Captain
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTeam("wives")}
                  disabled={!!gameState.teamCaptains.wives}
                  className={`arcade-team-btn arcade-team-btn--wives ${selectedTeam === "wives" ? "is-active" : ""} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Wives Captain
                </button>
              </div>
              {(gameState.teamCaptains.husbands || gameState.teamCaptains.wives) && (
                <ul className="mt-3 space-y-1 text-center text-xs text-slate-400">
                  {gameState.teamCaptains.husbands && (
                    <li>Husbands Captain: {gameState.teamCaptains.husbands}</li>
                  )}
                  {gameState.teamCaptains.wives && (
                    <li>Wives Captain: {gameState.teamCaptains.wives}</li>
                  )}
                </ul>
              )}
            </div>

            <div className="arcade-card p-4">
              <label
                htmlFor="captain"
                className="arcade-eyebrow mb-2 block text-slate-400"
              >
                Captain Name
              </label>
              <input
                id="captain"
                type="text"
                value={captainName}
                onChange={(e) => {
                  setCaptainName(e.target.value);
                  setJoinError(null);
                }}
                placeholder="Enter captain name..."
                autoComplete="name"
                className="arcade-input text-base"
              />
            </div>

            <p className="text-center text-sm text-slate-400">
              The captain submits answers for the team.
            </p>

            {joinError && (
              <p className="text-center text-sm text-red-300">{joinError}</p>
            )}

            <button
              type="submit"
              disabled={!captainName.trim() || !selectedTeam}
              className="arcade-btn arcade-btn--primary px-6 py-4 text-sm"
            >
              Join as Captain
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Tap Music On for background ambience.
          </p>
        </div>
      </RetroShell>
    );
  }

  const teamLabel =
    playerSession.team === "husbands" ? "Husbands Captain" : "Wives Captain";
  const teamScore = gameState.scores[playerSession.team];
  const teamColorClass =
    playerSession.team === "husbands" ? "text-blue-300" : "text-purple-300";

  return (
    <RetroShell>
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="arcade-eyebrow text-slate-500">The Millennial Showdown</p>
          <p className={`font-display text-sm font-bold ${teamColorClass}`}>
            {teamLabel} · {playerSession.captainName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <MuteToggle />
          <div className="arcade-score-compact">
            <p className="arcade-eyebrow text-[10px] text-slate-500">Score</p>
            <p className="arcade-score-compact-value">{teamScore}</p>
          </div>
        </div>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="arcade-badge arcade-badge--purple">{question.category}</span>
        <span className={`arcade-badge ${difficultyClass(question.points)}`}>
          {getDifficulty(question.points)}
        </span>
        <span className="arcade-badge arcade-badge--blue">{question.points} pts</span>
        <span className="arcade-badge">
          Q {questionNumber} / {totalQuestions}
        </span>
        <span className="arcade-badge text-slate-400">{getTypeLabel(questionType)}</span>
      </div>

      <div
        className={`arcade-timer mb-5 p-4 ${
          isTimeUp
            ? "arcade-timer--expired"
            : timerUrgent
              ? "arcade-timer--urgent"
              : ""
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="arcade-eyebrow text-slate-400">Time Remaining</span>
          <span className="text-xs text-slate-500">
            {gameState.timerRunning ? "Live" : "Waiting for host"}
          </span>
        </div>
        <p
          className={`arcade-timer-display mb-2 ${
            isTimeUp
              ? "text-red-400"
              : timerUrgent
                ? "text-orange-400"
                : "text-blue-300"
          }`}
        >
          {timerRemaining}s
        </p>
        <div className="arcade-progress">
          <div
            className={`arcade-progress-fill ${
              isTimeUp
                ? "bg-red-500 text-red-500"
                : timerUrgent
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-orange-400"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-blue-400"
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      <article className="arcade-card arcade-card--question mb-5 flex flex-1 flex-col p-5 sm:p-6">
        {questionType === "image" && (
          <ImageQuestion
            src={question.imageUrl}
            alt={question.imageAlt}
            category={question.category}
          />
        )}

        <h1 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
          {question.question}
        </h1>

        {questionType === "two-lies" && question.statements && (
          <ul className="mt-5 space-y-3">
            {question.statements.map((statement, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected =
                selectedLetter === letter ||
                teamSubmission?.toUpperCase() === letter;

              let optionClass = "arcade-option";
              if (isSelected) optionClass += " arcade-option--selected-purple";

              return (
                <li key={letter}>
                  <button
                    type="button"
                    disabled={!isAnswering}
                    onClick={() => handleSelectStatement(letter)}
                    className={optionClass}
                  >
                    <span className="mr-2 font-black text-purple-300">
                      {letter}.
                    </span>
                    {statement}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {questionType === "multiple-choice" && (
          <ul className="mt-5 space-y-3">
            {multipleChoiceOptions.map((option) => {
              const isSelected =
                selectedChoice === option || teamSubmission === option;

              let optionClass = "arcade-option";
              if (isSelected) optionClass += " arcade-option--selected-blue";

              return (
                <li key={option}>
                  <button
                    type="button"
                    disabled={!isAnswering}
                    onClick={() => handleSelectChoice(option)}
                    className={`${optionClass} font-medium sm:text-base`}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      <div className="flex flex-col gap-4">
        {usesTextInput(questionType) && (
          <form onSubmit={handleSubmit}>
            <div className="arcade-card p-4">
              <label
                htmlFor="answer"
                className="arcade-eyebrow mb-2 block text-slate-400"
              >
                Your Team&apos;s Answer
              </label>
              <input
                id="answer"
                type="text"
                value={isLocked ? (teamSubmission ?? "") : textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={!isAnswering}
                placeholder="Type your answer..."
                autoComplete="off"
                className="arcade-input text-base disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </form>
        )}

        {isTimeUp && !isLocked && (
          <div className="arcade-alert arcade-alert--danger">
            <span className="text-lg" aria-hidden>⏰</span>
            Time&apos;s Up
          </div>
        )}

        {isLocked && (
          <>
            <div className="arcade-alert arcade-alert--success">
              <span className="text-lg" aria-hidden>🔒</span>
              Answer Locked In
            </div>
            <p className="text-center text-sm text-slate-400">
              Waiting for next question...
            </p>
          </>
        )}

        {isAnswering && (
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!userAnswer.trim()}
            className="arcade-btn arcade-btn--primary px-6 py-4 text-sm"
          >
            Submit Team Answer
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleResetPlayer}
        className="arcade-footer-hint mt-8 w-full py-2 transition-colors hover:text-slate-400"
      >
        Leave Captain Role
      </button>
    </RetroShell>
  );
}
