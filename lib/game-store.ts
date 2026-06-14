import { getCategoryForQuestionIndex } from "@/lib/rounds";
import { triviaQuestions } from "@/data/questions";

export type Team = "husbands" | "wives";
export type AnswerMark = "correct" | "incorrect";

export type QuestionSubmissions = {
  husbands?: string;
  wives?: string;
};

export type QuestionMarks = {
  husbands?: AnswerMark;
  wives?: AnswerMark;
};

export interface GameState {
  currentQuestionIndex: number;
  isRoundRevealed: boolean;
  roundRevealedCategory: string | null;
  scores: {
    husbands: number;
    wives: number;
  };
  submissions: QuestionSubmissions;
  submissionHistory: Record<string, QuestionSubmissions>;
  answerMarks: QuestionMarks;
  roundAnswerMarks: Record<string, QuestionMarks>;
  timerSeconds: number;
  timerRunning: boolean;
  timerStartedAt: number | null;
  timerDuration: number;
}

const STORAGE_KEY = "millennial-showdown-game-state";
export const GAME_STATE_UPDATED_EVENT = "game-state-updated";
export const DEFAULT_TIMER_DURATION = 30;

const DEFAULT_STATE: GameState = {
  currentQuestionIndex: 0,
  isRoundRevealed: false,
  roundRevealedCategory: null,
  scores: {
    husbands: 0,
    wives: 0,
  },
  submissions: {},
  submissionHistory: {},
  answerMarks: {},
  roundAnswerMarks: {},
  timerSeconds: DEFAULT_TIMER_DURATION,
  timerRunning: false,
  timerStartedAt: null,
  timerDuration: DEFAULT_TIMER_DURATION,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function normalizeTeam(team: string): Team {
  const normalized = team.trim().toLowerCase();
  if (normalized === "wives" || normalized === "wife") return "wives";
  return "husbands";
}

function normalizeSubmissions(
  submissions?: Partial<Record<string, string>>,
): QuestionSubmissions {
  const result: QuestionSubmissions = {};
  if (!submissions) return result;

  for (const [key, value] of Object.entries(submissions)) {
    if (typeof value === "string" && value.trim()) {
      result[normalizeTeam(key)] = value.trim();
    }
  }

  return result;
}

function normalizeScores(
  scores?: Partial<Record<string, number>>,
): GameState["scores"] {
  const result = { ...DEFAULT_STATE.scores };
  if (!scores) return result;

  for (const [key, value] of Object.entries(scores)) {
    result[normalizeTeam(key)] = Number(value) || 0;
  }

  return result;
}

function normalizeAnswerMarks(
  marks?: Partial<Record<string, AnswerMark>>,
): QuestionMarks {
  const result: QuestionMarks = {};
  if (!marks) return result;

  for (const [key, value] of Object.entries(marks)) {
    if (value === "correct" || value === "incorrect") {
      result[normalizeTeam(key)] = value;
    }
  }

  return result;
}

function normalizeSubmissionHistory(
  history?: Record<string, Partial<Record<string, string>>>,
): Record<string, QuestionSubmissions> {
  const result: Record<string, QuestionSubmissions> = {};
  if (!history) return result;

  for (const [index, submissions] of Object.entries(history)) {
    result[index] = normalizeSubmissions(submissions);
  }

  return result;
}

function normalizeRoundAnswerMarks(
  marks?: Record<string, Partial<Record<string, AnswerMark>>>,
): Record<string, QuestionMarks> {
  const result: Record<string, QuestionMarks> = {};
  if (!marks) return result;

  for (const [index, teamMarks] of Object.entries(marks)) {
    result[index] = normalizeAnswerMarks(teamMarks);
  }

  return result;
}

function normalizeGameState(
  state: Partial<GameState> & { isAnswerRevealed?: boolean },
): GameState {
  const timerDuration =
    typeof state.timerDuration === "number" && state.timerDuration > 0
      ? state.timerDuration
      : DEFAULT_TIMER_DURATION;

  const isRoundRevealed =
    typeof state.isRoundRevealed === "boolean"
      ? state.isRoundRevealed
      : Boolean(state.isAnswerRevealed);

  return {
    ...DEFAULT_STATE,
    ...state,
    currentQuestionIndex:
      typeof state.currentQuestionIndex === "number"
        ? state.currentQuestionIndex
        : DEFAULT_STATE.currentQuestionIndex,
    isRoundRevealed,
    roundRevealedCategory:
      typeof state.roundRevealedCategory === "string"
        ? state.roundRevealedCategory
        : null,
    scores: normalizeScores(state.scores),
    submissions: normalizeSubmissions(state.submissions),
    submissionHistory: normalizeSubmissionHistory(state.submissionHistory),
    answerMarks: normalizeAnswerMarks(state.answerMarks),
    roundAnswerMarks: normalizeRoundAnswerMarks(state.roundAnswerMarks),
    timerDuration,
    timerSeconds:
      typeof state.timerSeconds === "number"
        ? Math.max(0, state.timerSeconds)
        : timerDuration,
    timerRunning: Boolean(state.timerRunning),
    timerStartedAt:
      typeof state.timerStartedAt === "number" ? state.timerStartedAt : null,
  };
}

function dispatchUpdate(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(GAME_STATE_UPDATED_EVENT));
}

export function getTimerRemaining(state: GameState): number {
  if (state.timerRunning && state.timerStartedAt !== null) {
    const elapsed = Math.floor((Date.now() - state.timerStartedAt) / 1000);
    return Math.max(0, state.timerSeconds - elapsed);
  }
  return state.timerSeconds;
}

export function isTimerExpired(state: GameState): boolean {
  if (getTimerRemaining(state) > 0) return false;
  return (
    state.timerRunning ||
    state.timerStartedAt !== null ||
    state.timerSeconds === 0
  );
}

export function getSubmissionCount(
  submissions: QuestionSubmissions,
): number {
  let count = 0;
  if (submissions.husbands) count += 1;
  if (submissions.wives) count += 1;
  return count;
}

export function getSubmissionsForQuestion(
  state: GameState,
  questionIndex: number,
): QuestionSubmissions {
  const key = String(questionIndex);
  if (state.currentQuestionIndex === questionIndex) {
    return normalizeSubmissions({
      ...state.submissionHistory[key],
      ...state.submissions,
    });
  }
  return normalizeSubmissions(state.submissionHistory[key]);
}

export function getMarksForQuestion(
  state: GameState,
  questionIndex: number,
): QuestionMarks {
  const key = String(questionIndex);
  if (state.currentQuestionIndex === questionIndex) {
    return normalizeAnswerMarks({
      ...state.roundAnswerMarks[key],
      ...state.answerMarks,
    });
  }
  return normalizeAnswerMarks(state.roundAnswerMarks[key]);
}

function syncExpiredTimer(state: GameState): GameState {
  if (!state.timerRunning || state.timerStartedAt === null) return state;
  if (getTimerRemaining(state) > 0) return state;
  return {
    ...state,
    timerSeconds: 0,
    timerRunning: false,
    timerStartedAt: null,
  };
}

function resetTimerState(state: GameState): GameState {
  state.timerSeconds = state.timerDuration;
  state.timerRunning = false;
  state.timerStartedAt = null;
  return state;
}

function persistSubmissionsForIndex(
  state: GameState,
  questionIndex: number,
): void {
  const key = String(questionIndex);
  const merged = normalizeSubmissions({
    ...state.submissionHistory[key],
    ...state.submissions,
  });

  if (merged.husbands || merged.wives) {
    state.submissionHistory[key] = merged;
  }
}

function loadLiveSubmissionsForIndex(
  state: GameState,
  questionIndex: number,
): void {
  const key = String(questionIndex);
  state.submissions = { ...state.submissionHistory[key] };
  state.answerMarks = { ...state.roundAnswerMarks[key] };
}

export function getGameState(): GameState {
  if (!isBrowser()) {
    return {
      ...DEFAULT_STATE,
      scores: { ...DEFAULT_STATE.scores },
      submissions: {},
      submissionHistory: {},
      roundAnswerMarks: {},
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        ...DEFAULT_STATE,
        scores: { ...DEFAULT_STATE.scores },
        submissions: {},
        submissionHistory: {},
        roundAnswerMarks: {},
      };
    }
    const parsed = JSON.parse(raw) as Partial<GameState> & {
      isAnswerRevealed?: boolean;
    };
    let state = normalizeGameState(parsed);
    const synced = syncExpiredTimer(state);

    if (
      synced.timerSeconds !== state.timerSeconds ||
      synced.timerRunning !== state.timerRunning ||
      synced.timerStartedAt !== state.timerStartedAt
    ) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalizeGameState(synced)),
      );
      state = synced;
    }

    return state;
  } catch {
    return {
      ...DEFAULT_STATE,
      scores: { ...DEFAULT_STATE.scores },
      submissions: {},
      submissionHistory: {},
      roundAnswerMarks: {},
    };
  }
}

export function saveGameState(state: GameState): void {
  if (!isBrowser()) return;
  const normalized = normalizeGameState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  dispatchUpdate();
}

export function resetGame(): GameState {
  const state: GameState = {
    ...DEFAULT_STATE,
    scores: { ...DEFAULT_STATE.scores },
    submissions: {},
    submissionHistory: {},
    answerMarks: {},
    roundAnswerMarks: {},
  };
  saveGameState(state);
  return state;
}

export function resetGameState(): GameState {
  const state = {
    ...DEFAULT_STATE,
    scores: { ...DEFAULT_STATE.scores },
    submissions: {},
    submissionHistory: {},
    answerMarks: {},
    roundAnswerMarks: {},
  };
  saveGameState(state);
  return state;
}

export function setCurrentQuestionIndex(index: number): GameState {
  const state = getGameState();
  const oldIndex = state.currentQuestionIndex;
  const newIndex = Math.max(0, Math.min(triviaQuestions.length - 1, index));

  persistSubmissionsForIndex(state, oldIndex);

  const oldCategory = getCategoryForQuestionIndex(oldIndex);
  const newCategory = getCategoryForQuestionIndex(newIndex);

  state.currentQuestionIndex = newIndex;
  state.submissions = {};
  state.answerMarks = {};

  if (oldCategory !== newCategory) {
    state.isRoundRevealed = false;
    state.roundRevealedCategory = null;
  }

  loadLiveSubmissionsForIndex(state, newIndex);
  resetTimerState(state);
  saveGameState(state);
  return state;
}

export function revealRoundAnswers(category: string): GameState {
  const state = getGameState();
  persistSubmissionsForIndex(state, state.currentQuestionIndex);
  state.isRoundRevealed = true;
  state.roundRevealedCategory = category;
  saveGameState(state);
  return state;
}

export function hideRoundAnswers(): GameState {
  const state = getGameState();
  state.isRoundRevealed = false;
  state.roundRevealedCategory = null;
  saveGameState(state);
  return state;
}

export function submitAnswer(team: Team | string, answer: string): GameState {
  const state = getGameState();
  const normalizedTeam = normalizeTeam(team);
  const trimmed = answer.trim();
  const key = String(state.currentQuestionIndex);

  state.submissions = normalizeSubmissions(state.submissions);
  state.submissions[normalizedTeam] = trimmed;

  if (!state.submissionHistory[key]) {
    state.submissionHistory[key] = {};
  }
  state.submissionHistory[key][normalizedTeam] = trimmed;

  saveGameState(state);
  return state;
}

export function clearSubmissions(): GameState {
  const state = getGameState();
  state.submissions = {};
  saveGameState(state);
  return state;
}

export function awardPoints(team: Team | string, points: number): GameState {
  const state = getGameState();
  const normalizedTeam = normalizeTeam(team);
  state.scores = normalizeScores(state.scores);
  state.scores[normalizedTeam] += points;
  saveGameState(state);
  return state;
}

export function adjustScore(team: Team | string, delta: number): GameState {
  return awardPoints(team, delta);
}

export function markAnswerCorrect(
  team: Team | string,
  points: number,
  questionIndex?: number,
): GameState {
  const state = getGameState();
  const index = questionIndex ?? state.currentQuestionIndex;
  const key = String(index);
  const normalizedTeam = normalizeTeam(team);

  if (!state.roundAnswerMarks[key]) {
    state.roundAnswerMarks[key] = {};
  }

  state.scores = normalizeScores(state.scores);

  if (state.roundAnswerMarks[key][normalizedTeam] !== "correct") {
    state.scores[normalizedTeam] += points;
  }

  state.roundAnswerMarks[key][normalizedTeam] = "correct";

  if (state.currentQuestionIndex === index) {
    state.answerMarks = normalizeAnswerMarks(state.answerMarks);
    state.answerMarks[normalizedTeam] = "correct";
  }

  saveGameState(state);
  return state;
}

export function markAnswerIncorrect(
  team: Team | string,
  questionIndex?: number,
): GameState {
  const state = getGameState();
  const index = questionIndex ?? state.currentQuestionIndex;
  const key = String(index);
  const normalizedTeam = normalizeTeam(team);

  if (!state.roundAnswerMarks[key]) {
    state.roundAnswerMarks[key] = {};
  }

  state.roundAnswerMarks[key][normalizedTeam] = "incorrect";

  if (state.currentQuestionIndex === index) {
    state.answerMarks = normalizeAnswerMarks(state.answerMarks);
    state.answerMarks[normalizedTeam] = "incorrect";
  }

  saveGameState(state);
  return state;
}

export function startTimer(duration = DEFAULT_TIMER_DURATION): GameState {
  const state = getGameState();
  state.timerDuration = duration;
  state.timerSeconds = duration;
  state.timerRunning = true;
  state.timerStartedAt = Date.now();
  saveGameState(state);
  return state;
}

export function pauseTimer(): GameState {
  const state = getGameState();
  if (state.timerRunning && state.timerStartedAt !== null) {
    state.timerSeconds = getTimerRemaining(state);
  }
  state.timerRunning = false;
  state.timerStartedAt = null;
  saveGameState(state);
  return state;
}

export function resetTimer(): GameState {
  const state = getGameState();
  resetTimerState(state);
  saveGameState(state);
  return state;
}
