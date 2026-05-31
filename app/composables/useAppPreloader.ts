export type PreloaderPhase = "loading" | "exiting" | "done";

const SESSION_KEY = "alpenglow-preloader-seen";

function readPreloaderSeen(): boolean {
  if (!import.meta.client) return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export const preloaderPhase = ref<PreloaderPhase>("loading");
export const preloaderProgress = ref(0);

let resolvePreloaderReady: (() => void) | null = null;
export const preloaderReady = new Promise<void>((resolve) => {
  resolvePreloaderReady = resolve;
});

let resolvePreloaderFinished: (() => void) | null = null;
export const preloaderFinished = new Promise<void>((resolve) => {
  resolvePreloaderFinished = resolve;
});

export const markPreloaderReady = () => {
  preloaderPhase.value = "exiting";
  resolvePreloaderReady?.();
};

export const markPreloaderDone = () => {
  preloaderPhase.value = "done";
  resolvePreloaderFinished?.();
};

export function hasPreloaderSeen(): boolean {
  return readPreloaderSeen();
}

export function markPreloaderSeen(): void {
  if (!import.meta.client) return;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Ignore quota / private-browsing errors
  }
}
