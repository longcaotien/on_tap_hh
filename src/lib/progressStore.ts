/**
 * Progress store with two interchangeable backends.
 *
 * - Server deployments: talks to `/api/progress` (PostgreSQL via Drizzle).
 * - Static deployments (GitHub Pages): there is no backend, so everything is
 *   persisted in `localStorage`. The flag is baked in at build time through
 *   `NEXT_PUBLIC_OFFLINE_STORE=1` (see `scripts/build-static.mjs`).
 *
 * Even in server mode the local snapshot is used as a fallback, so the app
 * keeps working if the database is unreachable.
 */

export interface QuestionProgressItem {
  questionId: number;
  status: "unseen" | "mastered" | "wrong";
  wrongCount: number;
  correctCount: number;
  bookmarked: boolean;
  personalNote: string;
}

export interface StudySessionRecord {
  id: number;
  mode: string;
  topicFilter: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  maxScore: number;
  durationSeconds: number;
  shuffled: boolean;
  createdAt: string;
}

export type ProgressAction =
  | {
      action: "update_question";
      questionId: number;
      status?: "unseen" | "mastered" | "wrong";
      wrongCount?: number;
      correctCount?: number;
      bookmarked?: boolean;
      personalNote?: string;
    }
  | {
      action: "save_session";
      mode: string;
      topicFilter: string;
      totalQuestions: number;
      correctCount: number;
      score: number;
      maxScore: number;
      durationSeconds: number;
      shuffled: boolean;
      details?: unknown;
    }
  | { action: "reset_all" }
  | { action: "clear_wrong" };

interface Snapshot {
  progress: Record<number, QuestionProgressItem>;
  sessions: StudySessionRecord[];
}

const STORAGE_KEY = "chemlab:store:v1";
const MAX_SESSIONS = 25;

/** True when the app is built as a static site (no API routes available). */
export const OFFLINE_STORE = process.env.NEXT_PUBLIC_OFFLINE_STORE === "1";

function emptySnapshot(): Snapshot {
  return { progress: {}, sessions: [] };
}

function readSnapshot(): Snapshot {
  if (typeof window === "undefined") return emptySnapshot();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySnapshot();
    const parsed = JSON.parse(raw) as Partial<Snapshot>;
    const progress: Record<number, QuestionProgressItem> = {};
    if (parsed.progress && typeof parsed.progress === "object") {
      for (const [key, value] of Object.entries(parsed.progress)) {
        const item = value as QuestionProgressItem;
        if (!item || typeof item.questionId !== "number") continue;
        progress[item.questionId] = {
          questionId: item.questionId,
          status: item.status ?? "unseen",
          wrongCount: item.wrongCount ?? 0,
          correctCount: item.correctCount ?? 0,
          bookmarked: Boolean(item.bookmarked),
          personalNote: item.personalNote ?? "",
        };
      }
    }
    return {
      progress,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return emptySnapshot();
  }
}

function writeSnapshot(snapshot: Snapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota exceeded / private mode — the in-memory state still works.
  }
}

function applyAction(
  snapshot: Snapshot,
  body: ProgressAction
): { snapshot: Snapshot; session?: StudySessionRecord } {
  if (body.action === "reset_all") {
    return { snapshot: emptySnapshot() };
  }

  if (body.action === "clear_wrong") {
    const progress: Record<number, QuestionProgressItem> = {};
    for (const [key, item] of Object.entries(snapshot.progress)) {
      progress[Number(key)] =
        item.status === "wrong" ? { ...item, status: "mastered" } : item;
    }
    return { snapshot: { ...snapshot, progress } };
  }

  if (body.action === "update_question") {
    const id = Number(body.questionId);
    const current = snapshot.progress[id] ?? {
      questionId: id,
      status: "unseen" as const,
      wrongCount: 0,
      correctCount: 0,
      bookmarked: false,
      personalNote: "",
    };
    const next: QuestionProgressItem = {
      questionId: id,
      status: body.status ?? current.status,
      wrongCount: body.wrongCount ?? current.wrongCount,
      correctCount: body.correctCount ?? current.correctCount,
      bookmarked: body.bookmarked ?? current.bookmarked,
      personalNote: body.personalNote ?? current.personalNote,
    };
    return {
      snapshot: {
        ...snapshot,
        progress: { ...snapshot.progress, [id]: next },
      },
    };
  }

  // save_session
  const session: StudySessionRecord = {
    id: Date.now(),
    mode: body.mode || "all",
    topicFilter: body.topicFilter || "all",
    totalQuestions: Number(body.totalQuestions) || 0,
    correctCount: Number(body.correctCount) || 0,
    score: Number(body.score) || 0,
    maxScore: Number(body.maxScore) || 10,
    durationSeconds: Number(body.durationSeconds) || 0,
    shuffled: Boolean(body.shuffled),
    createdAt: new Date().toISOString(),
  };
  return {
    session,
    snapshot: {
      ...snapshot,
      sessions: [session, ...snapshot.sessions].slice(0, MAX_SESSIONS),
    },
  };
}

function normalizeRemoteProgress(raw: unknown): QuestionProgressItem[] {
  if (!Array.isArray(raw)) return [];
  const items: QuestionProgressItem[] = [];
  for (const entry of raw) {
    const item = entry as Partial<QuestionProgressItem>;
    if (!item || typeof item.questionId !== "number") continue;
    items.push({
      questionId: item.questionId,
      status: item.status ?? "unseen",
      wrongCount: item.wrongCount ?? 0,
      correctCount: item.correctCount ?? 0,
      bookmarked: Boolean(item.bookmarked),
      personalNote: item.personalNote ?? "",
    });
  }
  return items;
}

/** Read progress + recent sessions (server first, local snapshot as fallback). */
export async function loadProgressData(): Promise<{
  progress: QuestionProgressItem[];
  sessions: StudySessionRecord[];
}> {
  const local = readSnapshot();

  if (!OFFLINE_STORE) {
    try {
      const res = await fetch("/api/progress", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as {
          progress?: unknown;
          sessions?: StudySessionRecord[];
        };
        const progress = normalizeRemoteProgress(data.progress);
        const sessions = Array.isArray(data.sessions) ? data.sessions : [];
        const progressMap: Record<number, QuestionProgressItem> = {};
        for (const item of progress) progressMap[item.questionId] = item;
        // Keep a local mirror so a later outage does not wipe the dashboard.
        if (progress.length > 0 || sessions.length > 0) {
          writeSnapshot({ progress: progressMap, sessions });
        }
        return { progress, sessions };
      }
    } catch {
      // Offline or API missing (static hosting) — fall through to localStorage.
    }
  }

  return {
    progress: Object.values(local.progress),
    sessions: local.sessions,
  };
}

/** Persist a progress mutation; returns the created session for `save_session`. */
export async function sendProgressAction(
  body: ProgressAction
): Promise<{ ok: boolean; session?: StudySessionRecord }> {
  // Always update the local snapshot first so nothing is lost if the network
  // (or the whole backend) is unavailable.
  const { snapshot, session } = applyAction(readSnapshot(), body);
  writeSnapshot(snapshot);

  if (!OFFLINE_STORE) {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = (await res.json()) as { session?: StudySessionRecord };
        return { ok: true, session: data.session ?? session };
      }
    } catch {
      // Keep the locally stored mutation.
    }
  }

  return { ok: true, session };
}

/** Wipe everything (progress + session history). */
export async function resetAllProgress(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  await sendProgressAction({ action: "reset_all" });
}
