import { useSyncExternalStore } from "react";

/**
 * Session stopwatch kept OUTSIDE React state.
 *
 * The clock ticks once per second while a practice session is running. If the
 * elapsed time lived in the page component's state, the whole page (question
 * cards, SVG lab diagrams, the 47-button palette…) would re-render every
 * second. With this tiny external store only the components that actually
 * display the time (`useElapsedSeconds`) re-render on each tick.
 */
let elapsed = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return elapsed;
}

function getServerSnapshot() {
  return 0;
}

export const sessionClock = {
  /** Seconds elapsed in the current session. */
  get: getSnapshot,
  /** Restart from 00:00 (called whenever a new session starts). */
  reset() {
    elapsed = 0;
    emit();
  },
  /** Advance by one second and return the new value. */
  tick() {
    elapsed += 1;
    emit();
    return elapsed;
  },
};

/** Subscribe a component to the running session time (re-renders every second). */
export function useElapsedSeconds(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Format seconds as MM:SS. */
export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
