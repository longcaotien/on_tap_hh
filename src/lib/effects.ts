/**
 * Small, optional "delight" effects. Every helper is safe to call anywhere:
 * unsupported browsers and users who prefer reduced motion simply get nothing.
 */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Short vibration on phones that support it (Android). No-op elsewhere. */
export function haptic(pattern: number | number[]): void {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    // Vibration blocked or unsupported — ignore.
  }
}

type ConfettiKind = "result" | "streak";

/**
 * Confetti burst. `canvas-confetti` is loaded on demand so it is not part of
 * the initial JavaScript bundle.
 */
export async function celebrate(kind: ConfettiKind = "result"): Promise<void> {
  if (prefersReducedMotion()) return;
  try {
    const confetti = (await import("canvas-confetti")).default;
    if (kind === "streak") {
      confetti({
        particleCount: 36,
        spread: 60,
        startVelocity: 32,
        scalar: 0.8,
        ticks: 110,
        origin: { y: 0.75 },
        disableForReducedMotion: true,
      });
      return;
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
    window.setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        disableForReducedMotion: true,
      });
    }, 220);
  } catch {
    // Canvas unavailable (headless / very old browsers) — ignore.
  }
}
