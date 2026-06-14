export type SoundEvent =
  | "answerSubmitted"
  | "answerRevealed"
  | "timerExpired"
  | "pointsAwarded"
  | "gameComplete"
  | "countdownWarning";

const MUTE_KEY = "millennial-showdown-muted";
const LOG_PREFIX = "[sounds]";

const SOUND_PATHS: Record<SoundEvent, string> = {
  answerSubmitted: "/sounds/answer-submitted.mp3",
  answerRevealed: "/sounds/answer-revealed.wav",
  timerExpired: "/sounds/timer-expired.wav",
  pointsAwarded: "/sounds/points-awarded.mp3",
  gameComplete: "/sounds/game-complete.wav",
  countdownWarning: "/sounds/countdown-warning.wav",
};

const audioCache = new Map<string, HTMLAudioElement>();
const failedPaths = new Set<string>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function logAttempt(event: SoundEvent, path: string): void {
  console.log(`${LOG_PREFIX} attempt: ${event} (${path})`);
}

function logSuccess(event: SoundEvent, path: string): void {
  console.log(`${LOG_PREFIX} success: ${event} (${path})`);
}

function logFailure(
  event: SoundEvent,
  path: string,
  reason: string,
): void {
  console.warn(`${LOG_PREFIX} failed: ${event} (${path}) — ${reason}`);
}

export function isMuted(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(MUTE_KEY, muted ? "true" : "false");
  } catch {
    // fail silently
  }
}

export function toggleMuted(): boolean {
  const next = !isMuted();
  setMuted(next);
  return next;
}

function getAudio(event: SoundEvent, path: string): HTMLAudioElement | null {
  if (failedPaths.has(path)) {
    logFailure(event, path, "cached load failure");
    return null;
  }

  try {
    if (!audioCache.has(path)) {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.addEventListener("error", () => {
        failedPaths.add(path);
        audioCache.delete(path);
        logFailure(event, path, "audio element error");
      });
      audioCache.set(path, audio);
    }
    return audioCache.get(path) ?? null;
  } catch (error) {
    failedPaths.add(path);
    logFailure(
      event,
      path,
      error instanceof Error ? error.message : "unknown error",
    );
    return null;
  }
}

export function playSound(event: SoundEvent): void {
  if (!isBrowser()) {
    logFailure(event, SOUND_PATHS[event], "not in browser");
    return;
  }

  if (isMuted()) {
    logFailure(event, SOUND_PATHS[event], "muted");
    return;
  }

  const path = SOUND_PATHS[event];
  logAttempt(event, path);

  const audio = getAudio(event, path);
  if (!audio) return;

  try {
    const instance = audio.cloneNode() as HTMLAudioElement;
    instance.volume = 0.55;
    void instance.play().then(() => {
      logSuccess(event, path);
    }).catch((error: unknown) => {
      logFailure(
        event,
        path,
        error instanceof Error ? error.message : "playback blocked or failed",
      );
    });
  } catch (error) {
    logFailure(
      event,
      path,
      error instanceof Error ? error.message : "unknown playback error",
    );
  }
}

export function playAnswerSubmitted(): void {
  playSound("answerSubmitted");
}

export function playAnswerRevealed(): void {
  playSound("answerRevealed");
}

export function playTimerExpired(): void {
  playSound("timerExpired");
}

export function playPointsAwarded(): void {
  playSound("pointsAwarded");
}

export function playGameComplete(): void {
  playSound("gameComplete");
}

export function playCountdownWarning(): void {
  playSound("countdownWarning");
}
