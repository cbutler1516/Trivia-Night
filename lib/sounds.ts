export type SoundEvent =
  | "answerSubmitted"
  | "answerRevealed"
  | "timerExpired"
  | "pointsAwarded"
  | "gameComplete";

const MUTE_KEY = "millennial-showdown-muted";

const SOUND_PATHS: Record<SoundEvent, string> = {
  answerSubmitted: "/sounds/answer-submitted.mp3",
  answerRevealed: "/sounds/answer-revealed.mp3",
  timerExpired: "/sounds/timer-expired.mp3",
  pointsAwarded: "/sounds/points-awarded.mp3",
  gameComplete: "/sounds/game-complete.mp3",
};

const audioCache = new Map<string, HTMLAudioElement>();
const failedPaths = new Set<string>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
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

function getAudio(path: string): HTMLAudioElement | null {
  if (failedPaths.has(path)) return null;

  try {
    if (!audioCache.has(path)) {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.addEventListener("error", () => {
        failedPaths.add(path);
        audioCache.delete(path);
      });
      audioCache.set(path, audio);
    }
    return audioCache.get(path) ?? null;
  } catch {
    failedPaths.add(path);
    return null;
  }
}

export function playSound(event: SoundEvent): void {
  if (!isBrowser() || isMuted()) return;

  const path = SOUND_PATHS[event];
  const audio = getAudio(path);
  if (!audio) return;

  try {
    const instance = audio.cloneNode() as HTMLAudioElement;
    instance.volume = 0.55;
    void instance.play().catch(() => {
      // Missing file or autoplay blocked — fail silently
    });
  } catch {
    // fail silently
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
