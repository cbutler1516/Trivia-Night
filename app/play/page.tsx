"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { MuteToggle } from "@/components/MuteToggle";
import {
  triviaQuestions,
  totalQuestions,
  resolveQuestionType,
  type QuestionType,
  type TriviaQuestion,
} from "@/data/questions";
import { ImageQuestion } from "@/components/ImageQuestion";
import {
  GAME_STATE_UPDATED_EVENT,
  getGameState,
  getTimerRemaining,
  isTimerExpired,
  submitAnswer,
  type GameState,
  type Team,
} from "@/lib/game-store";
import {
  playAnswerRevealed,
  playAnswerSubmitted,
  playTimerExpired,
} from "@/lib/sounds";

const PLAYER_SESSION_KEY = "millennial-showdown-player-session";

interface PlayerSession {
  team: Team;
  captainName: string;
}

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 5) % 100}%`,
  top: `${(i * 27 + 9) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.6) % 5}s`,
  duration: `${5 + (i % 4)}s`,
  color: i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#a78bfa" : "#f472b6",
}));

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

function difficultyColor(points: number): string {
  if (points >= 500) return "border-orange-500/40 text-orange-200";
  if (points >= 300) return "border-pink-500/40 text-pink-200";
  if (points >= 200) return "border-yellow-500/40 text-yellow-200";
  return "border-green-500/40 text-green-200";
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildMultipleChoiceOptions(question: TriviaQuestion): string[] {
  const decoys = triviaQuestions
    .filter(
      (q) =>
        q.id !== question.id &&
        q.category === question.category &&
        !q.statements &&
        q.answer.length < 40,
    )
    .map((q) => q.answer);

  const unique = [...new Set([question.answer, ...decoys])];
  return shuffle(unique).slice(0, 4);
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

function isAnswerCorrect(
  question: TriviaQuestion,
  userAnswer: string,
): boolean {
  if (question.statements) {
    return userAnswer.toUpperCase() === question.answer.toUpperCase();
  }
  const normalized = normalizeAnswer(userAnswer);
  const accepted = [question.answer, ...(question.acceptableAnswers ?? [])].map(
    normalizeAnswer,
  );
  return accepted.includes(normalized);
}

function getCorrectAnswerLabel(question: TriviaQuestion): string {
  if (question.statements) {
    const index = question.answer.toUpperCase().charCodeAt(0) - 65;
    return `${question.answer}: ${question.statements[index]}`;
  }
  return question.answer;
}

function formatSubmissionForDisplay(
  question: TriviaQuestion,
  submission: string,
): string {
  if (question.statements && submission.length === 1) {
    const index = submission.toUpperCase().charCodeAt(0) - 65;
    if (question.statements[index]) {
      return `${submission.toUpperCase()}: ${question.statements[index]}`;
    }
  }
  return submission;
}

export default function PlayPage() {
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(
    null,
  );
  const [gameState, setGameState] = useState<GameState>(() => getGameState());
  const [captainName, setCaptainName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const [textAnswer, setTextAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const soundPlayedRef = useRef({ reveal: -1, timer: -1 });

  useEffect(() => {
    setPlayerSession(getPlayerSession());
    setGameState(getGameState());

    const refresh = () => setGameState(getGameState());
    window.addEventListener(GAME_STATE_UPDATED_EVENT, refresh);

    const poll = setInterval(refresh, 500);
    const tick = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      window.removeEventListener(GAME_STATE_UPDATED_EVENT, refresh);
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
    ? gameState.submissions[playerSession.team]
    : undefined;

  const timerRemaining = getTimerRemaining(gameState);
  const isTimeUp = isTimerExpired(gameState);
  const timerUrgent = timerRemaining <= 10 && gameState.timerRunning;
  const timerPercent =
    gameState.timerDuration > 0
      ? (timerRemaining / gameState.timerDuration) * 100
      : 0;

  const isLocked = !!teamSubmission;
  const isRevealed = gameState.isAnswerRevealed;
  const isAnswering = !isLocked && !isRevealed && !isTimeUp;

  useEffect(() => {
    setTextAnswer("");
    setSelectedChoice(null);
    setSelectedLetter(null);
    soundPlayedRef.current = { reveal: -1, timer: -1 };
  }, [currentIndex]);

  useEffect(() => {
    if (
      isRevealed &&
      soundPlayedRef.current.reveal !== currentIndex
    ) {
      soundPlayedRef.current.reveal = currentIndex;
      playAnswerRevealed();
    }
  }, [isRevealed, currentIndex]);

  useEffect(() => {
    if (isTimeUp && soundPlayedRef.current.timer !== currentIndex) {
      soundPlayedRef.current.timer = currentIndex;
      playTimerExpired();
    }
  }, [isTimeUp, currentIndex]);

  const userAnswer =
    questionType === "standard" || questionType === "image"
      ? textAnswer
      : questionType === "two-lies"
        ? (selectedLetter ?? "")
        : (selectedChoice ?? "");

  const submittedAnswer = teamSubmission ?? userAnswer;

  const isCorrect = isRevealed
    ? isAnswerCorrect(question, submittedAnswer)
    : false;

  function getUserAnswerDisplay(): string {
    const answer = teamSubmission ?? userAnswer;
    if (questionType === "two-lies" && answer) {
      return formatSubmissionForDisplay(question, answer);
    }
    return answer;
  }

  function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!captainName.trim() || !selectedTeam) return;
    const session: PlayerSession = {
      team: selectedTeam,
      captainName: captainName.trim(),
    };
    savePlayerSession(session);
    setPlayerSession(session);
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
    clearPlayerSession();
    setPlayerSession(null);
    setCaptainName("");
    setSelectedTeam(null);
    setTextAnswer("");
    setSelectedChoice(null);
    setSelectedLetter(null);
  }

  if (!playerSession) {
    return (
      <GameShell>
        <div className="flex flex-1 flex-col justify-center">
          <header className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
              Join the Game
            </p>
            <h1 className="bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300 bg-clip-text text-3xl font-black uppercase leading-tight text-transparent">
              The Millennial Showdown
            </h1>
          </header>

          <form onSubmit={handleJoin} className="flex flex-col gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <label
                htmlFor="captain"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
              >
                Captain Name
              </label>
              <input
                id="captain"
                type="text"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                placeholder="Enter your name..."
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-white placeholder:text-slate-500 outline-none transition-all focus:border-blue-400/50 focus:shadow-[0_0_20px_rgba(96,165,250,0.2)]"
              />
            </div>

            <div>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Choose Your Team
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeam("husbands")}
                  className={`rounded-2xl border px-4 py-4 text-base font-bold uppercase tracking-wider transition-all ${
                    selectedTeam === "husbands"
                      ? "border-blue-400/60 bg-blue-950/50 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                      : "border-blue-400/30 bg-blue-950/20 text-blue-200 hover:border-blue-400/50"
                  }`}
                >
                  👨 Husbands
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTeam("wives")}
                  className={`rounded-2xl border px-4 py-4 text-base font-bold uppercase tracking-wider transition-all ${
                    selectedTeam === "wives"
                      ? "border-purple-400/60 bg-purple-950/50 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                      : "border-purple-400/30 bg-purple-950/20 text-purple-200 hover:border-purple-400/50"
                  }`}
                >
                  👩 Wives
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!captainName.trim() || !selectedTeam}
              className="rounded-2xl border border-blue-400/50 bg-gradient-to-r from-blue-600/90 to-purple-600/90 px-6 py-4 text-base font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              Enter Game
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <MuteToggle />
          </div>
        </div>
      </GameShell>
    );
  }

  const teamLabel =
    playerSession.team === "husbands" ? "Team Husbands" : "Team Wives";
  const teamScore = gameState.scores[playerSession.team];
  const teamColorClass =
    playerSession.team === "husbands" ? "text-blue-300" : "text-purple-300";

  return (
    <GameShell>
      {/* Header */}
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            The Millennial Showdown
          </p>
          <p className={`text-sm font-medium ${teamColorClass}`}>
            {teamLabel} · {playerSession.captainName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <MuteToggle />
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Score
          </p>
          <p className="text-xl font-black tabular-nums bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            {teamScore}
          </p>
          </div>
        </div>
      </header>

      {/* Badges */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-purple-500/40 bg-purple-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-200">
          {question.category}
        </span>
        <span
          className={`rounded-full border bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyColor(question.points)}`}
        >
          {getDifficulty(question.points)}
        </span>
        <span className="rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-200">
          {question.points} pts
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-slate-300">
          Q {questionNumber} / {totalQuestions}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
          {getTypeLabel(questionType)}
        </span>
      </div>

      {/* Countdown timer */}
      <div
        className={`mb-5 rounded-2xl border bg-white/5 p-4 backdrop-blur-md ${
          timerUrgent
            ? "border-orange-500/40"
            : isTimeUp
              ? "border-red-500/40"
              : "border-white/10"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Time Remaining
          </span>
          <span className="text-xs text-slate-500">
            {gameState.timerRunning ? "Live" : "Waiting for host"}
          </span>
        </div>
        <p
          className={`mb-2 text-center text-4xl font-black tabular-nums ${
            isTimeUp
              ? "text-red-400"
              : timerUrgent
                ? "text-orange-400"
                : "text-blue-300"
          }`}
        >
          {timerRemaining}s
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-black/40">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              isTimeUp
                ? "bg-red-500"
                : timerUrgent
                  ? "bg-gradient-to-r from-orange-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <article className="mb-5 flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(96,165,250,0.08)] backdrop-blur-md sm:p-6">
        {questionType === "image" && (
          <ImageQuestion
            src={question.imageUrl}
            alt={question.imageAlt}
            category={question.category}
          />
        )}

        <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">
          {question.question}
        </h1>

        {questionType === "two-lies" && question.statements && (
          <ul className="mt-5 space-y-3">
            {question.statements.map((statement, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected =
                selectedLetter === letter ||
                teamSubmission?.toUpperCase() === letter;
              const isTrue =
                isRevealed && question.answer.toUpperCase() === letter;
              const isWrongPick = isRevealed && isSelected && !isTrue;

              return (
                <li key={letter}>
                  <button
                    type="button"
                    disabled={!isAnswering}
                    onClick={() => handleSelectStatement(letter)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm leading-relaxed transition-all sm:text-base ${
                      isTrue
                        ? "border-green-500/50 bg-green-950/40 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        : isWrongPick
                          ? "border-red-500/50 bg-red-950/30 text-red-200"
                          : isSelected
                            ? "border-purple-400/60 bg-purple-950/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                            : "border-white/10 bg-black/30 text-slate-200 hover:border-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
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
              const isCorrectOption =
                isRevealed &&
                normalizeAnswer(option) === normalizeAnswer(question.answer);
              const isWrongPick = isRevealed && isSelected && !isCorrectOption;

              return (
                <li key={option}>
                  <button
                    type="button"
                    disabled={!isAnswering}
                    onClick={() => handleSelectChoice(option)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all sm:text-base ${
                      isCorrectOption
                        ? "border-green-500/50 bg-green-950/40 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        : isWrongPick
                          ? "border-red-500/50 bg-red-950/30 text-red-200"
                          : isSelected
                            ? "border-blue-400/60 bg-blue-950/40 text-white shadow-[0_0_20px_rgba(96,165,250,0.2)]"
                            : "border-white/10 bg-black/30 text-slate-200 hover:border-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      {/* Answer area */}
      <div className="flex flex-col gap-4">
        {usesTextInput(questionType) && (
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <label
                htmlFor="answer"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
              >
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                value={isLocked ? (teamSubmission ?? "") : textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={!isAnswering}
                placeholder="Type your answer..."
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-white placeholder:text-slate-500 outline-none transition-all focus:border-blue-400/50 focus:shadow-[0_0_20px_rgba(96,165,250,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </form>
        )}

        {isTimeUp && !isLocked && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3">
            <span className="text-lg" aria-hidden>
              ⏰
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-red-300">
              Time&apos;s Up
            </span>
          </div>
        )}

        {isLocked && !isRevealed && (
          <>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3">
              <span className="text-lg" aria-hidden>
                🔒
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-green-300">
                Answer Locked In
              </span>
            </div>
            <p className="text-center text-sm text-slate-400">
              Waiting for host to reveal...
            </p>
          </>
        )}

        {isRevealed && (
          <div
            className={`rounded-2xl border p-5 backdrop-blur-md ${
              isCorrect
                ? "border-green-500/40 bg-green-950/30"
                : "border-orange-500/40 bg-orange-950/20"
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              {isCorrect ? "Correct!" : "Not quite..."}
            </p>
            <p className="mb-2 text-sm text-slate-300">
              Your answer:{" "}
              <span className="font-semibold text-white">
                {getUserAnswerDisplay()}
              </span>
            </p>
            <p className="text-base font-bold text-white">
              Correct answer: {getCorrectAnswerLabel(question)}
            </p>
          </div>
        )}

        {isAnswering && (
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!userAnswer.trim()}
            className="rounded-2xl border border-blue-400/50 bg-gradient-to-r from-blue-600/90 to-purple-600/90 px-6 py-4 text-base font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(59,130,246,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Submit Answer
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleResetPlayer}
        className="mt-8 w-full py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-slate-400"
      >
        Reset Player
      </button>
    </GameShell>
  );
}

function GameShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.25; }
          50% { transform: translateY(-18px) translateX(6px); opacity: 0.7; }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.03); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
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

      <div className="scanline relative flex min-h-screen flex-col overflow-hidden bg-[#030014] text-white">
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

        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
          style={{ animation: "scanline 10s linear infinite" }}
        />

        <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </>
  );
}
