const HOME_MUSIC_ENABLED_KEY = "millennial-showdown-home-music";
const HOME_MUSIC_PATH = "/sounds/home-music.mp3";
const HOME_MUSIC_VOLUME = 0.25;

let audio: HTMLAudioElement | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(HOME_MUSIC_PATH);
    audio.loop = true;
    audio.volume = HOME_MUSIC_VOLUME;
    audio.preload = "auto";
  }
  return audio;
}

export function isHomeMusicEnabled(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(HOME_MUSIC_ENABLED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setHomeMusicEnabled(enabled: boolean): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(HOME_MUSIC_ENABLED_KEY, String(enabled));
  } catch {
    /* ignore */
  }
}

export async function playHomeMusic(): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    const track = getAudio();
    track.volume = HOME_MUSIC_VOLUME;
    await track.play();
    return true;
  } catch {
    return false;
  }
}

export function pauseHomeMusic(): void {
  if (!isBrowser() || !audio) return;
  audio.pause();
}

export function stopHomeMusic(): void {
  pauseHomeMusic();
  if (audio) {
    audio.currentTime = 0;
  }
}

export async function enableHomeMusic(): Promise<boolean> {
  setHomeMusicEnabled(true);
  return playHomeMusic();
}

export function disableHomeMusic(): void {
  setHomeMusicEnabled(false);
  pauseHomeMusic();
}

export async function toggleHomeMusic(): Promise<boolean> {
  if (isHomeMusicEnabled()) {
    disableHomeMusic();
    return false;
  }
  await enableHomeMusic();
  return true;
}
