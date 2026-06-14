export type Team = "husbands" | "wives";
export type AnswerMark = "correct" | "incorrect";

export interface GameState {
  currentQuestionIndex: number;
  isAnswerRevealed: boolean;
  scores: {
    husbands: number;
    wives: number;
  };
  submissions: {
    husbands?: string;
    wives?: string;
  };
  answerMarks: {
    husbands?: AnswerMark;
    wives?: AnswerMark;
  };
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
  isAnswerRevealed: false,
  scores: {
    husbands: 0,
    wives: 0,
  },
  submissions: {},
  answerMarks: {},
  timerSeconds: DEFAULT_TIMER_DURATION,  timerRunning: false,
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
): GameState["submissions"] {
  const result: GameState["submissions"] = {};
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
): GameState["answerMarks"] {
  const result: GameState["answerMarks"] = {};
  if (!marks) return result;

  for (const [key, value] of Object.entries(marks)) {
    if (value === "correct" || value === "incorrect") {
      result[normalizeTeam(key)] = value;
    }
  }

  return result;
}

function normalizeGameState(state: Partial<GameState>): GameState {
  const timerDuration =
    typeof state.timerDuration === "number" && state.timerDuration > 0
      ? state.timerDuration
      : DEFAULT_TIMER_DURATION;

  return {
    ...DEFAULT_STATE,
    ...state,
    currentQuestionIndex:
      typeof state.currentQuestionIndex === "number"
        ? state.currentQuestionIndex
        : DEFAULT_STATE.currentQuestionIndex,
    isAnswerRevealed: Boolean(state.isAnswerRevealed),
    scores: normalizeScores(state.scores),
    submissions: normalizeSubmissions(state.submissions),
    answerMarks: normalizeAnswerMarks(state.answerMarks),
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
  submissions: GameState["submissions"],
): number {
  let count = 0;
  if (submissions.husbands) count += 1;
  if (submissions.wives) count += 1;
  return count;
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

export function getGameState(): GameState {
  if (!isBrowser()) {
    return {
      ...DEFAULT_STATE,
      scores: { ...DEFAULT_STATE.scores },
      submissions: {},
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        ...DEFAULT_STATE,
        scores: { ...DEFAULT_STATE.scores },
        submissions: {},
      };
    }
    const parsed = JSON.parse(raw) as Partial<GameState>;
    let state = normalizeGameState(parsed);
    const synced = syncExpiredTimer(state);

    if (
      synced.timerSeconds !== state.timerSeconds ||
      synced.timerRunning !== state.timerRunning ||
      synced.timerStartedAt !== state.timerStartedAt
    ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeGameState(synced)));
      state = synced;
    }

    return state;
  } catch {
    return {
      ...DEFAULT_STATE,
      scores: { ...DEFAULT_STATE.scores },
      submissions: {},
    };
  }
}

export function saveGameState(state: GameState): void {
  if (!isBrowser()) return;
  const normalized = normalizeGameState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  dispatchUpdate();
}

export function resetGameState(): GameState {
  const state = {
    ...DEFAULT_STATE,
    scores: { ...DEFAULT_STATE.scores },
    submissions: {},
    answerMarks: {},
  };
  saveGameState(state);
  return state;
}

export function setCurrentQuestionIndex(index: number): GameState {
  const state = getGameState();
  state.currentQuestionIndex = Math.max(0, index);
  state.isAnswerRevealed = false;
  state.submissions = {};
  state.answerMarks = {};
  resetTimerState(state);
  saveGameState(state);
  return state;
}

export function revealAnswer(): GameState {
  const state = getGameState();
  state.isAnswerRevealed = true;
  saveGameState(state);
  return state;
}

export function hideAnswer(): GameState {
  const state = getGameState();
  state.isAnswerRevealed = false;
  saveGameState(state);
  return state;
}

export function submitAnswer(team: Team | string, answer: string): GameState {
  const state = getGameState();
  const normalizedTeam = normalizeTeam(team);
  state.submissions = normalizeSubmissions(state.submissions);
  state.submissions[normalizedTeam] = answer.trim();
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
): GameState {
  const state = getGameState();
  const normalizedTeam = normalizeTeam(team);
  state.answerMarks = normalizeAnswerMarks(state.answerMarks);
  state.scores = normalizeScores(state.scores);

  if (state.answerMarks[normalizedTeam] !== "correct") {
    state.scores[normalizedTeam] += points;
  }

  state.answerMarks[normalizedTeam] = "correct";
  saveGameState(state);
  return state;
}

export function markAnswerIncorrect(team: Team | string): GameState {
  const state = getGameState();
  const normalizedTeam = normalizeTeam(team);
  state.answerMarks = normalizeAnswerMarks(state.answerMarks);
  state.answerMarks[normalizedTeam] = "incorrect";
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
