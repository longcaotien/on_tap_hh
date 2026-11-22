"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  CHEMISTRY_QUESTIONS,
  TOPICS_META,
  ChemistryQuestion,
  TopicId,
  McqOption,
} from "@/data/chemistryQuestions";
import { ChemistryIllustration } from "@/components/ChemistryIllustrations";
import { ChemistryTheoryHub } from "@/components/ChemistryTheoryHub";
import {
  Atom,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Flame,
  FlaskConical,
  HelpCircle,
  History,
  LayoutGrid,
  ListChecks,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  Star,
  StickyNote,
  Target,
  Trash2,
  Trophy,
  XCircle,
  AlertTriangle,
  Award,
  Check,
  X,
  FileText,
  SlidersHorizontal,
  Zap,
  List,
} from "lucide-react";

type NavTab = "home" | "practice" | "wrong_vault" | "theory";
type FeedbackMode = "instant" | "exam";
type WorkspaceLayout = "single" | "sheet";

interface QuestionProgressItem {
  questionId: number;
  status: "unseen" | "mastered" | "wrong";
  wrongCount: number;
  correctCount: number;
  bookmarked: boolean;
  personalNote: string;
}

interface StudySessionRecord {
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

// Helper to shuffle an array deterministically or randomly
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ChemistryStudyPlatform() {
  // Navigation & Global State
  const [activeNav, setActiveNav] = useState<NavTab>("home");
  const [progressMap, setProgressMap] = useState<Record<number, QuestionProgressItem>>({});
  const [sessions, setSessions] = useState<StudySessionRecord[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Search & Explorer on Home Page
  const [searchQuery, setSearchQuery] = useState("");
  const [explorerTopic, setExplorerTopic] = useState<TopicId | "all">("all");

  // Custom Quiz Builder Configuration
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([
    "sulfur",
    "so2",
    "h2so4",
    "true_false",
  ]);
  const [statusFilter, setStatusFilter] = useState<"all" | "wrong" | "unseen" | "bookmarked">("all");
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("instant");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(0); // 0 = no limit

  // Active Practice / Exam Session State
  const [activeQueue, setActiveQueue] = useState<ChemistryQuestion[]>(CHEMISTRY_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [workspaceLayout, setWorkspaceLayout] = useState<WorkspaceLayout>("single");
  const [sessionTitle, setSessionTitle] = useState<string>("Ôn tập toàn bộ 47 câu Lý thuyết 11");
  const [sessionModeTag, setSessionModeTag] = useState<string>("all");

  // User Answers within Current Session
  // For MCQ (1..40): questionId -> "A" | "B" | "C" | "D" (stores the ORIGINAL option key selected)
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  // For True/False (41..47): questionId -> { a?: boolean, b?: boolean, c?: boolean, d?: boolean }
  const [tfAnswers, setTfAnswers] = useState<Record<number, Record<string, boolean>>>({});
  // Track which questions have been revealed/checked in Instant mode
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  // Shuffled option order map per questionId
  const [optionPermutations, setOptionPermutations] = useState<Record<number, McqOption[]>>({});

  // Exam Submission & Timer State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [showNoteEditor, setShowNoteEditor] = useState<Record<number, boolean>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});

  // Auto-advance (tự chuyển câu) + mobile UX state
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const [autoAdvanceDelayMs, setAutoAdvanceDelayMs] = useState<number>(1800);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | "none">("none");
  const [showPaletteSheet, setShowPaletteSheet] = useState<boolean>(false);
  const [sessionTimeLimit, setSessionTimeLimit] = useState<number>(0);

  // Refs to avoid stale closures in timers / callbacks
  const autoAdvanceRef = useRef(true);
  const activeQueueRef = useRef<ChemistryQuestion[]>(CHEMISTRY_QUESTIONS);
  const currentIdxRef = useRef(0);
  const feedbackModeRef = useRef<FeedbackMode>("instant");
  const workspaceLayoutRef = useRef<WorkspaceLayout>("single");
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionCardRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleSelectMcqRef = useRef<
    (q: ChemistryQuestion, key: "A" | "B" | "C" | "D") => void
  >(() => {});

  // Load initial progress and sessions from PostgreSQL API
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          const map: Record<number, QuestionProgressItem> = {};
          if (Array.isArray(data.progress)) {
            for (const item of data.progress) {
              map[item.questionId] = {
                questionId: item.questionId,
                status: item.status || "unseen",
                wrongCount: item.wrongCount || 0,
                correctCount: item.correctCount || 0,
                bookmarked: Boolean(item.bookmarked),
                personalNote: item.personalNote || "",
              };
            }
          }
          setProgressMap(map);
          if (Array.isArray(data.sessions)) {
            setSessions(data.sessions);
          }
        }
      } catch (err) {
        console.error("Error loading progress:", err);
      } finally {
        setLoadingDb(false);
      }
    }
    fetchInitialData();
  }, []);

  // Timer Effect when on Practice tab and not submitted
  // (single interval; deps intentionally exclude the ticking values to avoid
  // recreating the interval every second)
  useEffect(() => {
    if (activeNav !== "practice" || isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setRemainingSeconds((prev) =>
        prev === null ? null : Math.max(0, prev - 1)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [activeNav, isSubmitted]);

  // Keep refs in sync for use inside timers / event handlers
  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);
  useEffect(() => {
    activeQueueRef.current = activeQueue;
  }, [activeQueue]);
  useEffect(() => {
    currentIdxRef.current = currentIdx;
  }, [currentIdx]);
  useEffect(() => {
    feedbackModeRef.current = feedbackMode;
  }, [feedbackMode]);
  useEffect(() => {
    workspaceLayoutRef.current = workspaceLayout;
  }, [workspaceLayout]);

  // Persist the auto-advance preference across visits
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chemlab:autoAdvance");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
      if (saved !== null) setAutoAdvance(saved === "1");
    } catch {
      // localStorage unavailable (private mode) — keep default
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("chemlab:autoAdvance", autoAdvance ? "1" : "0");
    } catch {
      // ignore
    }
  }, [autoAdvance]);

  // Clear pending auto-advance timers on unmount
  useEffect(
    () => () => {
      if (autoAdvanceTimerRef.current)
        clearInterval(autoAdvanceTimerRef.current);
      if (autoAdvanceTimeoutRef.current)
        clearTimeout(autoAdvanceTimeoutRef.current);
    },
    []
  );



  // Helper to persist question progress to PostgreSQL
  // (previously the fetch lived inside the setState updater and could fire
  // twice in StrictMode; now it fires exactly once per call)
  const syncQuestionProgress = useCallback(
    async (questionId: number, updates: Partial<QuestionProgressItem>) => {
      const existing = progressMap[questionId] || {
        questionId,
        status: "unseen",
        wrongCount: 0,
        correctCount: 0,
        bookmarked: false,
        personalNote: "",
      };
      const updated = { ...existing, ...updates };
      setProgressMap((prev) => ({ ...prev, [questionId]: updated }));
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_question",
            ...updated,
          }),
        });
      } catch (e) {
        console.error("Sync question error:", e);
      }
    },
    [progressMap]
  );

  // Build option permutations when starting a session
  const buildPermutations = useCallback(
    (questions: ChemistryQuestion[], shouldShuffleOpts: boolean) => {
      const perms: Record<number, McqOption[]> = {};
      for (const q of questions) {
        if (q.type === "mcq" && q.options) {
          perms[q.id] = shouldShuffleOpts ? shuffleArray(q.options) : [...q.options];
        }
      }
      setOptionPermutations(perms);
    },
    []
  );

  // ---------- Streak helper ----------
  const applyStreak = useCallback(
    (correct: boolean) => {
      if (correct) {
        const next = streakCount + 1;
        setStreakCount(next);
        if (next > bestStreak) setBestStreak(next);
      } else {
        setStreakCount(0);
      }
    },
    [streakCount, bestStreak]
  );

  // ---------- Auto-advance helpers (tự chuyển câu, không cần bấm "Câu tiếp theo") ----------
  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setAutoAdvanceCountdown(null);
  }, []);

  const goToQuestion = useCallback(
    (idx: number, dir?: "next" | "prev" | "none") => {
      cancelAutoAdvance();
      const len = activeQueueRef.current.length;
      if (len === 0) return;
      const clamped = Math.max(0, Math.min(len - 1, idx));
      const prev = currentIdxRef.current;
      setSlideDirection(
        dir ?? (clamped > prev ? "next" : clamped < prev ? "prev" : "none")
      );
      setCurrentIdx(clamped);
      requestAnimationFrame(() => {
        questionCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [cancelAutoAdvance]
  );

  const scheduleAutoAdvance = useCallback(
    (fromIdx: number, delayMs: number = 1800) => {
      cancelAutoAdvance();
      if (!autoAdvanceRef.current) return;
      if (feedbackModeRef.current !== "instant") return;
      if (workspaceLayoutRef.current !== "single") return;
      if (fromIdx < 0 || fromIdx >= activeQueueRef.current.length - 1) return;
      setAutoAdvanceDelayMs(delayMs);
      setAutoAdvanceCountdown(Math.ceil(delayMs / 1000));
      const start = Date.now();
      autoAdvanceTimerRef.current = setInterval(() => {
        const left = Math.ceil((delayMs - (Date.now() - start)) / 1000);
        setAutoAdvanceCountdown(left > 0 ? left : null);
      }, 200);
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        cancelAutoAdvance();
        goToQuestion(fromIdx + 1, "next");
      }, delayMs);
    },
    [cancelAutoAdvance, goToQuestion]
  );

  // Keyboard shortcuts: ←/→ chuyển câu, A–D chọn đáp án (desktop)
  useEffect(() => {
    if (activeNav !== "practice" || workspaceLayout !== "single") return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.isContentEditable)
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToQuestion(currentIdxRef.current + 1, "next");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToQuestion(currentIdxRef.current - 1, "prev");
      } else if (/^[a-dA-D]$/.test(e.key)) {
        const q = activeQueueRef.current[currentIdxRef.current];
        if (q && q.type === "mcq") {
          handleSelectMcqRef.current(
            q,
            e.key.toUpperCase() as "A" | "B" | "C" | "D"
          );
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeNav, workspaceLayout, goToQuestion]);

  // Start a Study / Practice Session
  const startSession = useCallback(
    (opts: {
      questions: ChemistryQuestion[];
      title: string;
      modeTag: string;
      shuffleQ?: boolean;
      shuffleOpt?: boolean;
      mode?: FeedbackMode;
      timeMinutes?: number;
      layout?: WorkspaceLayout;
      startIndex?: number;
    }) => {
      const doShuffleQ = opts.shuffleQ ?? shuffleQuestions;
      const doShuffleOpt = opts.shuffleOpt ?? shuffleOptions;
      const finalMode = opts.mode ?? feedbackMode;
      const finalTime = opts.timeMinutes ?? 0;

      const list = doShuffleQ ? shuffleArray(opts.questions) : [...opts.questions];
      if (list.length === 0) return;

      cancelAutoAdvance();
      setActiveQueue(list);
      buildPermutations(list, doShuffleOpt);
      setCurrentIdx(opts.startIndex ?? 0);
      setMcqAnswers({});
      setTfAnswers({});
      setCheckedQuestions({});
      setShowHint({});
      setIsSubmitted(false);
      setElapsedSeconds(0);
      setStreakCount(0);
      setBestStreak(0);
      setSessionTimeLimit(finalTime);
      setSlideDirection("none");
      setShowPaletteSheet(false);
      setRemainingSeconds(finalTime > 0 ? finalTime * 60 : null);
      setSessionTitle(opts.title);
      setSessionModeTag(opts.modeTag);
      setFeedbackMode(finalMode);
      setShuffleQuestions(doShuffleQ);
      setShuffleOptions(doShuffleOpt);
      if (opts.layout) {
        setWorkspaceLayout(opts.layout);
      }
      setActiveNav("practice");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [shuffleQuestions, shuffleOptions, feedbackMode, buildPermutations, cancelAutoAdvance]
  );

  // Reshuffle current active queue
  const handleReshuffleCurrentSession = () => {
    startSession({
      questions: activeQueue,
      title: sessionTitle,
      modeTag: sessionModeTag,
      shuffleQ: true,
      shuffleOpt: shuffleOptions,
      mode: feedbackMode,
      timeMinutes: sessionTimeLimit,
    });
  };

  // Check if a question is answered completely
  const isQuestionAnswered = useCallback(
    (q: ChemistryQuestion) => {
      if (q.type === "mcq") {
        return Boolean(mcqAnswers[q.id]);
      } else {
        const ans = tfAnswers[q.id];
        if (!ans) return false;
        return Object.keys(ans).length > 0;
      }
    },
    [mcqAnswers, tfAnswers]
  );

  // Check if a question is 100% correct
  const isQuestionCorrect = useCallback(
    (q: ChemistryQuestion): boolean => {
      if (q.type === "mcq") {
        return mcqAnswers[q.id] === q.correctOption;
      } else {
        const ans = tfAnswers[q.id];
        if (!ans || !q.statements) return false;
        return q.statements.every((st) => ans[st.key] === st.isTrue);
      }
    },
    [mcqAnswers, tfAnswers]
  );

  // Handle MCQ Option Selection
  const handleSelectMcq = (q: ChemistryQuestion, originalKey: "A" | "B" | "C" | "D") => {
    if (isSubmitted) return;
    if (feedbackMode === "instant" && checkedQuestions[q.id]) return;

    setMcqAnswers((prev) => ({ ...prev, [q.id]: originalKey }));

    if (feedbackMode === "instant") {
      setCheckedQuestions((prev) => ({ ...prev, [q.id]: true }));
      const isCorrect = originalKey === q.correctOption;
      const currentProg = progressMap[q.id];

      if (isCorrect) {
        applyStreak(true);
        syncQuestionProgress(q.id, {
          status: "mastered",
          correctCount: (currentProg?.correctCount || 0) + 1,
        });
      } else {
        applyStreak(false);
        syncQuestionProgress(q.id, {
          status: "wrong",
          wrongCount: (currentProg?.wrongCount || 0) + 1,
        });
      }
      // Tự chuyển câu tiếp theo sau khi chấm — không cần bấm "Câu tiếp theo"
      const idx = activeQueue.findIndex((x) => x.id === q.id);
      scheduleAutoAdvance(idx, 1800);
    }
  };
  useEffect(() => {
    handleSelectMcqRef.current = handleSelectMcq;
  });

  // Chấm điểm câu Đúng/Sai — dùng chung cho tự chấm khi đủ 4 ý và nút "Chấm ngay"
  // (trước đây nút "Chấm ngay" chỉ hiện đáp án mà không lưu tiến độ/streak)
  const gradeTfQuestion = (
    q: ChemistryQuestion,
    answersForQ: Record<string, boolean>
  ) => {
    setCheckedQuestions((prev) => ({ ...prev, [q.id]: true }));
    const allCorrect =
      q.statements?.every((s) => answersForQ[s.key] === s.isTrue) ?? false;
    const currentProg = progressMap[q.id];
    if (allCorrect) {
      applyStreak(true);
      syncQuestionProgress(q.id, {
        status: "mastered",
        correctCount: (currentProg?.correctCount || 0) + 1,
      });
    } else {
      applyStreak(false);
      syncQuestionProgress(q.id, {
        status: "wrong",
        wrongCount: (currentProg?.wrongCount || 0) + 1,
      });
    }
    // Tự chuyển câu sau khi chấm (cho thêm thời gian đọc 4 mệnh đề)
    const idx = activeQueue.findIndex((x) => x.id === q.id);
    scheduleAutoAdvance(idx, 2600);
  };

  // Handle True/False Statement Selection
  const handleSelectTf = (
    q: ChemistryQuestion,
    stKey: "a" | "b" | "c" | "d",
    val: boolean
  ) => {
    if (isSubmitted) return;
    if (feedbackMode === "instant" && checkedQuestions[q.id]) return;

    const currentForQ = tfAnswers[q.id] || {};
    const nextForQ = { ...currentForQ, [stKey]: val };
    setTfAnswers((prev) => ({
      ...prev,
      [q.id]: nextForQ,
    }));

    // In instant mode, if all 4 statements (a, b, c, d) are now selected, auto-grade!
    if (
      feedbackMode === "instant" &&
      nextForQ.a !== undefined &&
      nextForQ.b !== undefined &&
      nextForQ.c !== undefined &&
      nextForQ.d !== undefined
    ) {
      gradeTfQuestion(q, nextForQ);
    }
  };

  // Nút "Chấm điểm câu này ngay" — chấm thật và lưu tiến độ
  const handleGradeTfNow = (q: ChemistryQuestion) => {
    if (isSubmitted || checkedQuestions[q.id]) return;
    gradeTfQuestion(q, tfAnswers[q.id] || {});
  };

  // Retry a single question in Instant Mode
  const handleRetrySingleQuestion = (qId: number) => {
    cancelAutoAdvance();
    setMcqAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setTfAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setCheckedQuestions((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  // Submit Session & Calculate Score
  const handleSubmitSession = useCallback(async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    // Reveal all questions
    const allChecked: Record<number, boolean> = {};
    let correctQCount = 0;
    let rawPoints = 0;
    let maxRawPoints = 0;

    for (const q of activeQueue) {
      allChecked[q.id] = true;
      const currentProg = progressMap[q.id];

      if (q.type === "mcq") {
        maxRawPoints += 0.25;
        const userAns = mcqAnswers[q.id];
        if (userAns === q.correctOption) {
          correctQCount += 1;
          rawPoints += 0.25;
          if (feedbackMode === "exam") {
            syncQuestionProgress(q.id, {
              status: "mastered",
              correctCount: (currentProg?.correctCount || 0) + 1,
            });
          }
        } else if (userAns !== undefined || feedbackMode === "exam") {
          if (feedbackMode === "exam") {
            syncQuestionProgress(q.id, {
              status: "wrong",
              wrongCount: (currentProg?.wrongCount || 0) + 1,
            });
          }
        }
      } else if (q.type === "true_false" && q.statements) {
        maxRawPoints += 1.0;
        const userTf = tfAnswers[q.id] || {};
        let matchedStatements = 0;
        for (const st of q.statements) {
          if (userTf[st.key] === st.isTrue) {
            matchedStatements += 1;
          }
        }
        // Standard GDPT 2018 True/False partial credit scale:
        // 1 correct = 0.1, 2 correct = 0.25, 3 correct = 0.5, 4 correct = 1.0
        if (matchedStatements === 1) rawPoints += 0.1;
        else if (matchedStatements === 2) rawPoints += 0.25;
        else if (matchedStatements === 3) rawPoints += 0.5;
        else if (matchedStatements === 4) {
          rawPoints += 1.0;
          correctQCount += 1;
        }

        if (feedbackMode === "exam") {
          if (matchedStatements === 4) {
            syncQuestionProgress(q.id, {
              status: "mastered",
              correctCount: (currentProg?.correctCount || 0) + 1,
            });
          } else {
            syncQuestionProgress(q.id, {
              status: "wrong",
              wrongCount: (currentProg?.wrongCount || 0) + 1,
            });
          }
        }
      }
    }

    setCheckedQuestions(allChecked);

    // Normalized score out of 10
    const normalizedScore =
      maxRawPoints > 0 ? Number(((rawPoints / maxRawPoints) * 10).toFixed(2)) : 0;

    if (normalizedScore >= 7.0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore confetti error in headless environments
      }
    }

    // Save session to PostgreSQL
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_session",
          mode: sessionModeTag,
          topicFilter: selectedTopics.join(","),
          totalQuestions: activeQueue.length,
          correctCount: correctQCount,
          score: normalizedScore,
          maxScore: 10,
          durationSeconds: elapsedSeconds,
          shuffled: shuffleQuestions,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSessions((prev) => [data.session, ...prev.slice(0, 24)]);
        }
      }
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  }, [
    isSubmitted,
    activeQueue,
    progressMap,
    mcqAnswers,
    tfAnswers,
    feedbackMode,
    syncQuestionProgress,
    sessionModeTag,
    selectedTopics,
    elapsedSeconds,
    shuffleQuestions,
  ]);

  // Auto-submit if countdown reaches 0
  useEffect(() => {
    if (remainingSeconds === 0 && !isSubmitted && activeNav === "practice") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional auto-submit when the countdown hits zero
      handleSubmitSession();
    }
  }, [remainingSeconds, isSubmitted, activeNav, handleSubmitSession]);

  // Global Statistics Computed from progressMap
  const stats = useMemo(() => {
    let mastered = 0;
    let wrong = 0;
    let bookmarked = 0;
    for (const q of CHEMISTRY_QUESTIONS) {
      const p = progressMap[q.id];
      if (p?.status === "mastered") mastered++;
      if (p?.status === "wrong") wrong++;
      if (p?.bookmarked) bookmarked++;
    }
    const unseen = CHEMISTRY_QUESTIONS.length - mastered - wrong;
    const masteryPercent = Math.round((mastered / CHEMISTRY_QUESTIONS.length) * 100);
    return { mastered, wrong, unseen, bookmarked, masteryPercent };
  }, [progressMap]);

  // List of Wrong Questions & Bookmarked Questions
  const wrongQuestionsList = useMemo(
    () =>
      CHEMISTRY_QUESTIONS.filter((q) => progressMap[q.id]?.status === "wrong").sort(
        (a, b) => (progressMap[b.id]?.wrongCount || 0) - (progressMap[a.id]?.wrongCount || 0)
      ),
    [progressMap]
  );

  const bookmarkedQuestionsList = useMemo(
    () => CHEMISTRY_QUESTIONS.filter((q) => progressMap[q.id]?.bookmarked),
    [progressMap]
  );

  // Filtered Questions for Custom Study Builder
  const customFilteredQuestions = useMemo(() => {
    return CHEMISTRY_QUESTIONS.filter((q) => {
      if (!selectedTopics.includes(q.topic)) return false;
      const p = progressMap[q.id];
      if (statusFilter === "wrong") return p?.status === "wrong";
      if (statusFilter === "unseen") return !p || p.status === "unseen";
      if (statusFilter === "bookmarked") return Boolean(p?.bookmarked);
      return true;
    });
  }, [selectedTopics, statusFilter, progressMap]);

  // Filtered Questions for Home Question Explorer
  const explorerQuestions = useMemo(() => {
    return CHEMISTRY_QUESTIONS.filter((q) => {
      if (explorerTopic !== "all" && q.topic !== explorerTopic) return false;
      if (!searchQuery.trim()) return true;
      const qLower = searchQuery.toLowerCase();
      return (
        q.code.toLowerCase().includes(qLower) ||
        q.stem.toLowerCase().includes(qLower) ||
        q.keyFormula.toLowerCase().includes(qLower) ||
        q.explanation.toLowerCase().includes(qLower)
      );
    });
  }, [explorerTopic, searchQuery]);

  // Current Session Live Score Summary
  const sessionSummary = useMemo(() => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    let rawPoints = 0;
    let maxPoints = 0;

    for (const q of activeQueue) {
      const done = isQuestionAnswered(q);
      if (done) answered++;

      if (q.type === "mcq") {
        maxPoints += 0.25;
        if (checkedQuestions[q.id] || isSubmitted) {
          if (mcqAnswers[q.id] === q.correctOption) {
            correct++;
            rawPoints += 0.25;
          } else if (mcqAnswers[q.id]) {
            wrong++;
          }
        }
      } else if (q.type === "true_false" && q.statements) {
        maxPoints += 1.0;
        if (checkedQuestions[q.id] || isSubmitted) {
          const userTf = tfAnswers[q.id] || {};
          let m = 0;
          for (const st of q.statements) {
            if (userTf[st.key] === st.isTrue) m++;
          }
          if (m === 1) rawPoints += 0.1;
          else if (m === 2) rawPoints += 0.25;
          else if (m === 3) rawPoints += 0.5;
          else if (m === 4) {
            rawPoints += 1.0;
            correct++;
          }
          if (m < 4 && Object.keys(userTf).length > 0) {
            wrong++;
          }
        }
      }
    }

    const scale10 = maxPoints > 0 ? Number(((rawPoints / maxPoints) * 10).toFixed(2)) : 0;
    return { answered, correct, wrong, rawPoints, maxPoints, scale10 };
  }, [activeQueue, isQuestionAnswered, checkedQuestions, isSubmitted, mcqAnswers, tfAnswers]);

  // Format seconds as MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Toggle Bookmark on a Question
  const toggleBookmark = (qId: number) => {
    const current = progressMap[qId]?.bookmarked || false;
    syncQuestionProgress(qId, { bookmarked: !current });
  };

  // Save Personal Note on a Question
  const savePersonalNote = (qId: number) => {
    const draft = noteDrafts[qId] ?? progressMap[qId]?.personalNote ?? "";
    syncQuestionProgress(qId, { personalNote: draft });
    setShowNoteEditor((prev) => ({ ...prev, [qId]: false }));
  };

  // Render a Single Question Card (used in both Single View and Full-Sheet View)
  const renderQuestionCard = (q: ChemistryQuestion, idxInQueue: number) => {
    const prog = progressMap[q.id];
    const isChecked = Boolean(checkedQuestions[q.id] || isSubmitted);
    const isBookmarked = Boolean(prog?.bookmarked);
    const displayedOptions =
      q.type === "mcq" ? optionPermutations[q.id] || q.options || [] : [];
    const displayLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

    return (
      <div
        key={q.id}
        id={`question-card-${q.id}`}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
      >
        {/* Question Header Bar */}
        <div className="px-5 sm:px-7 py-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-700 text-white font-mono text-xs sm:text-sm font-bold shadow-xs">
              Câu {idxInQueue + 1}/{activeQueue.length}
              {shuffleQuestions && (
                <span className="text-teal-200 font-normal">({q.code} gốc)</span>
              )}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
              {q.topicLabel}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                q.difficulty === "Nhận biết"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : q.difficulty === "Thông hiểu"
                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {q.difficulty}
            </span>
            {prog?.status === "wrong" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Hay sai ({prog.wrongCount} lần)
              </span>
            )}
            {prog?.status === "mastered" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã thuộc
              </span>
            )}
          </div>

          {/* Right Action Icons: Hint, Note, Bookmark, Retry */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setShowHint((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[40px] min-w-[40px] justify-center rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                showHint[q.id]
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Xem gợi ý công thức"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gợi ý</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setNoteDrafts((prev) => ({
                  ...prev,
                  [q.id]: prev[q.id] ?? prog?.personalNote ?? "",
                }));
                setShowNoteEditor((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[40px] min-w-[40px] justify-center rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                prog?.personalNote
                  ? "bg-teal-50 text-teal-800 border-teal-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Ghi chú cá nhân"
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ghi chú</span>
            </button>

            <button
              type="button"
              onClick={() => toggleBookmark(q.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[40px] min-w-[40px] justify-center rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                isBookmarked
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Đánh dấu sao câu hỏi quan trọng"
            >
              <Star className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isBookmarked ? "Đã lưu" : "Đánh dấu"}</span>
            </button>

            {feedbackMode === "instant" && isChecked && !isSubmitted && (
              <button
                type="button"
                onClick={() => handleRetrySingleQuestion(q.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 transition-all"
                title="Làm lại câu này"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm lại
              </button>
            )}
          </div>
        </div>

        {/* Question Body */}
        <div className="p-4 sm:p-7 space-y-5">
          {/* Quick Formula Hint Box */}
          {showHint[q.id] && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Gợi ý trọng tâm:</strong> Công thức / Từ khóa liên quan là{" "}
                  <code className="px-2 py-0.5 rounded bg-amber-200/70 font-mono font-bold">
                    {q.keyFormula}
                  </code>
                </span>
              </div>
            </div>
          )}

          {/* Question Stem Text */}
          <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            <span className="text-teal-700 font-bold mr-1.5">{q.code}:</span>
            {q.stem}
          </div>

          {/* Sub-items (Reactions, Experimental Steps, Statement Lists) */}
          {q.subItems && q.subItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 text-sm sm:text-base text-slate-800 font-medium">
              {q.subItems.map((line, i) => (
                <div
                  key={i}
                  className="pl-3 border-l-2 border-teal-600/60 leading-relaxed font-mono text-xs sm:text-sm"
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Custom Precision SVG Lab Illustration (if present) */}
          {q.illustrationId && (
            <ChemistryIllustration
              id={q.illustrationId}
              caption={q.illustrationCaption}
            />
          )}

          {/* ==================== PART I: 4-OPTION MULTIPLE CHOICE ==================== */}
          {q.type === "mcq" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {displayedOptions.map((opt, optIdx) => {
                const displayLetter = displayLabels[optIdx] || opt.key;
                const userSelectedOriginalKey = mcqAnswers[q.id];
                const isSelected = userSelectedOriginalKey === opt.key;
                const isRightOption = opt.key === q.correctOption;

                let cardStyle =
                  "bg-white border-slate-200/90 text-slate-800 hover:border-teal-500 hover:bg-teal-50/30";
                let badgeStyle =
                  "bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-teal-600 group-hover:text-white";

                if (isChecked) {
                  if (isRightOption) {
                    cardStyle =
                      "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs";
                    badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                  } else if (isSelected && !isRightOption) {
                    cardStyle =
                      "bg-rose-50/90 border-rose-400 text-rose-950 ring-2 ring-rose-400/20";
                    badgeStyle = "bg-rose-600 text-white border-rose-600";
                  } else {
                    cardStyle = "bg-slate-50/60 border-slate-200 text-slate-400 opacity-75";
                    badgeStyle = "bg-slate-200 text-slate-500";
                  }
                } else if (isSelected) {
                  cardStyle =
                    "bg-teal-50/90 border-teal-600 text-teal-950 ring-2 ring-teal-500/20 shadow-xs";
                  badgeStyle = "bg-teal-700 text-white border-teal-700";
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectMcq(q, opt.key)}
                    disabled={isChecked}
                    className={`group relative flex items-center justify-between gap-3 p-4 min-h-[56px] rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98] ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-xl font-mono text-sm font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyle} ${
                          isChecked && isRightOption ? "underline decoration-2" : ""
                        }`}
                      >
                        {displayLetter}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-snug break-words">
                        {opt.text}
                      </span>
                    </div>

                    {isChecked && isRightOption && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shrink-0">
                        <Check className="w-3.5 h-3.5" /> Đúng
                      </span>
                    )}
                    {isChecked && isSelected && !isRightOption && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shrink-0">
                        <X className="w-3.5 h-3.5" /> Sai
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ==================== PART II: TRUE / FALSE CLUSTER (4 STATEMENTS) ==================== */}
          {q.type === "true_false" && q.statements && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2">
                <span>Chọn Đúng hoặc Sai cho từng mệnh đề a), b), c), d):</span>
                {feedbackMode === "instant" && !isChecked && (
                  <button
                    type="button"
                    onClick={() => handleGradeTfNow(q)}
                    className="text-teal-700 hover:underline font-bold min-h-[36px]"
                  >
                    Chấm điểm câu này ngay →
                  </button>
                )}
              </div>

              {q.statements.map((st) => {
                const userChoice = tfAnswers[q.id]?.[st.key];
                const isStatementMatched = userChoice === st.isTrue;

                // When checked, highlight TRUE statements in yellow like the original exam worksheet!
                let rowStyle = "bg-slate-50/70 border-slate-200/90";
                if (isChecked) {
                  if (st.isTrue) {
                    rowStyle =
                      "bg-[#FEF08A]/55 border-amber-400 shadow-2xs"; // Yellow highlighter effect matching exam sheet!
                  } else {
                    rowStyle = "bg-white border-slate-200";
                  }
                } else if (userChoice !== undefined) {
                  rowStyle = "bg-teal-50/40 border-teal-300";
                }

                return (
                  <div
                    key={st.key}
                    className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${rowStyle}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-sm sm:text-base text-slate-900 leading-relaxed flex-1">
                        <span className="font-mono font-bold text-teal-800 mr-2">
                          {st.key}.
                        </span>
                        <span
                          className={
                            isChecked && st.isTrue
                              ? "underline decoration-slate-800 decoration-1 font-semibold"
                              : "font-medium"
                          }
                        >
                          {st.text}
                        </span>
                      </div>

                      {/* True / False Toggle Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          disabled={isChecked}
                          onClick={() => handleSelectTf(q, st.key, true)}
                          className={`px-4 py-2 min-h-[44px] rounded-xl font-mono text-xs font-bold border transition-all active:scale-95 ${
                            userChoice === true
                              ? isChecked
                                ? st.isTrue
                                  ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400"
                                  : "bg-rose-600 text-white border-rose-600"
                                : "bg-teal-700 text-white border-teal-700"
                              : isChecked && st.isTrue
                              ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          ĐÚNG
                        </button>
                        <button
                          type="button"
                          disabled={isChecked}
                          onClick={() => handleSelectTf(q, st.key, false)}
                          className={`px-4 py-2 min-h-[44px] rounded-xl font-mono text-xs font-bold border transition-all active:scale-95 ${
                            userChoice === false
                              ? isChecked
                                ? !st.isTrue
                                  ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400"
                                  : "bg-rose-600 text-white border-rose-600"
                                : "bg-teal-700 text-white border-teal-700"
                              : isChecked && !st.isTrue
                              ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          SAI
                        </button>
                      </div>
                    </div>

                    {/* Individual Statement Explanation when Checked */}
                    {isChecked && (
                      <div className="pt-2 border-t border-slate-200/70 flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        {userChoice !== undefined ? (
                          isStatementMatched ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                              <Check className="w-3 h-3" /> Bạn chọn Đúng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                              <X className="w-3 h-3" /> Bạn chọn Sai
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-500 text-white font-bold text-[11px] shrink-0 mt-0.5">
                            Đáp án: {st.isTrue ? "ĐÚNG" : "SAI"}
                          </span>
                        )}
                        <span className="leading-relaxed">{st.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================== DETAILED EXPLANATION PANEL ==================== */}
          {isChecked && (
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-slate-50 border border-teal-200/90 space-y-2 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
                  <FlaskConical className="w-4 h-4 text-teal-600" />
                  GIẢI THÍCH HÓA HỌC CHI TIẾT &amp; GHI NHỚ
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-teal-200 font-mono text-xs font-bold text-teal-900">
                  Trọng tâm: {q.keyFormula}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 whitespace-pre-line leading-relaxed">
                {q.explanation}
              </p>
            </div>
          )}

          {/* ==================== PERSONAL STUDY NOTE EDITOR / DISPLAY ==================== */}
          {showNoteEditor[q.id] ? (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-fadeIn">
              <label className="block text-xs font-bold uppercase text-amber-900">
                Ghi chú cá nhân cho {q.code} (Lưu tự động vào Cơ sở dữ liệu):
              </label>
              <textarea
                rows={2}
                value={noteDrafts[q.id] ?? prog?.personalNote ?? ""}
                onChange={(e) =>
                  setNoteDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                placeholder="Nhập mẹo nhớ nhanh, lỗi sai cần tránh ở câu này..."
                className="w-full rounded-xl border border-amber-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowNoteEditor((prev) => ({ ...prev, [q.id]: false }))
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => savePersonalNote(q.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-700 text-white hover:bg-teal-800"
                >
                  Lưu ghi chú
                </button>
              </div>
            </div>
          ) : (
            prog?.personalNote && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start justify-between gap-3 text-xs sm:text-sm text-amber-950">
                <div className="flex items-start gap-2">
                  <StickyNote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Ghi chú của bạn: </strong>
                    {prog.personalNote}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNoteDrafts((prev) => ({
                      ...prev,
                      [q.id]: prog.personalNote,
                    }));
                    setShowNoteEditor((prev) => ({ ...prev, [q.id]: true }));
                  }}
                  className="text-xs font-semibold text-amber-800 underline shrink-0"
                >
                  Sửa
                </button>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-chem-grid">
      {/* ==================== STICKY TOP NAVIGATION HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveNav("home")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-slate-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Atom className="w-5 h-5 md:w-6 md:h-6 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 whitespace-nowrap">
                  ChemLab <span className="text-teal-700">11</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-[11px] font-bold border border-amber-300">
                  ₁₆S • SO₂ • H₂SO₄
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Hệ thống Ôn tập &amp; Luyện thi Lý thuyết Hóa 11 (47 Câu Chuẩn)
              </p>
            </div>
          </div>

          {/* Center Navigation Links (tablet & desktop; phones use the bottom tab bar) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveNav("home")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                activeNav === "home"
                  ? "bg-white text-teal-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav("practice")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                activeNav === "practice"
                  ? "bg-white text-teal-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>Làm bài</span>
              <span className="hidden md:inline-flex px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono text-[11px]">
                {activeQueue.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav("wrong_vault")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                activeNav === "wrong_vault"
                  ? "bg-white text-rose-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Câu sai</span>
              {stats.wrong > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[11px]">
                  {stats.wrong}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveNav("theory")}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                activeNav === "theory"
                  ? "bg-white text-teal-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Lý thuyết &amp; Flashcard</span>
              <span className="sm:hidden">Lý thuyết</span>
            </button>
          </nav>

          {/* Right Mastery Status Pill (always visible, compact on phones) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Đã thuộc:</span>
              <span className="font-mono font-bold text-teal-700">
                {stats.mastered}/47
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT CONTAINER ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* ====================================================================
         * VIEW 1: TRANG CHỦ (HOME DASHBOARD & STUDY CONFIGURATOR)
         * ==================================================================== */}
        {activeNav === "home" && (
          <div className="space-y-10 animate-fadeIn">
            {/* HERO BANNER */}
            <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-700/80">
              {/* Decorative Molecular Glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CHƯƠNG TRÌNH HÓA HỌC 11 MỚI • ĐẦY ĐỦ 47 CÂU HỎI &amp; HÌNH VẼ PHÒNG LAB</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-tight">
                    Chinh Phục Trọn Bộ Lý Thuyết{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-teal-300">
                      Sulfur, SO₂ &amp; Sulfuric Acid
                    </span>
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    Nền tảng ôn luyện chuyên sâu tích hợp <strong>40 câu trắc nghiệm 4 lựa chọn</strong> và{" "}
                    <strong>7 câu chùm Đúng/Sai (28 mệnh đề thí nghiệm)</strong>. Hỗ trợ xáo trộn câu hỏi,
                    xáo trộn đáp án A-B-C-D, tự động gom câu sai và vẽ lại chuẩn xác toàn bộ sơ đồ thí nghiệm.
                  </p>

                  {/* Quick Start Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        startSession({
                          questions: CHEMISTRY_QUESTIONS,
                          title: "Ôn tập toàn bộ 47 câu (Thứ tự chuẩn 1 → 47)",
                          modeTag: "all",
                          shuffleQ: false,
                          shuffleOpt: false,
                          mode: "instant",
                          timeMinutes: 0,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 min-h-[52px] rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Ôn Tất Cả 47 Câu (1 → 47)
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startSession({
                          questions: CHEMISTRY_QUESTIONS,
                          title: "Ôn tập 47 câu (Xáo trộn câu hỏi & đáp án)",
                          modeTag: "shuffled_all",
                          shuffleQ: true,
                          shuffleOpt: true,
                          mode: "instant",
                          timeMinutes: 0,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 min-h-[52px] rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                    >
                      <Shuffle className="w-4 h-4" />
                      Ôn Xáo Trộn Ngẫu Nhiên
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startSession({
                          questions: CHEMISTRY_QUESTIONS,
                          title: "Thi thử chuẩn THPT (45 phút - Chấm điểm thang 10)",
                          modeTag: "exam",
                          shuffleQ: true,
                          shuffleOpt: true,
                          mode: "exam",
                          timeMinutes: 45,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 min-h-[52px] rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/20 font-semibold text-sm transition-all cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-amber-300" />
                      Thi Thử 45 Phút
                    </button>
                  </div>
                </div>

                {/* Right Column: Live Mastery & Quick Stats */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Đã Thành Thạo</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-mono font-extrabold text-white">
                        {stats.mastered}
                        <span className="text-base font-normal text-slate-400">/47</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${stats.masteryPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveNav("wrong_vault")}
                    className="p-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 backdrop-blur-md border border-rose-400/30 flex flex-col justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-rose-200 font-medium">Kho Câu Sai</span>
                      <Flame className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-mono font-extrabold text-rose-300">
                        {stats.wrong}
                        <span className="text-xs font-sans font-normal text-rose-200 ml-1.5">
                          câu cần sửa
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-200 mt-1.5 underline">
                        Nhấn để ôn tập câu sai →
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Câu Đánh Dấu Sao</span>
                      <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-mono font-bold text-amber-300">
                        {stats.bookmarked} câu
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Lưu các câu bẫy lý thuyết
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Chưa Làm</span>
                      <Target className="w-5 h-5 text-sky-300" />
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-mono font-bold text-sky-300">
                        {stats.unseen} câu
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {loadingDb ? "Đang đồng bộ..." : "Đã lưu tiến độ tự động"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================== SECTION 1: ÔN TẬP TỪNG PHẦN (4 CHUYÊN ĐỀ) ==================== */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700">
                    PHÂN CHIA THEO CHUYÊN ĐỀ SÁCH GIÁO KHOA
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Ôn Tập Từng Phần (4 Chuyên Đề Trọng Tâm)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Chọn học tuần tự hoặc xáo trộn ngẫu nhiên từng phần để nắm chắc kiến thức.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {TOPICS_META.map((topic) => {
                  const topicQuestions = CHEMISTRY_QUESTIONS.filter(
                    (q) => q.topic === topic.id
                  );
                  const masteredInTopic = topicQuestions.filter(
                    (q) => progressMap[q.id]?.status === "mastered"
                  ).length;
                  const wrongInTopic = topicQuestions.filter(
                    (q) => progressMap[q.id]?.status === "wrong"
                  ).length;
                  const percent = Math.round(
                    (masteredInTopic / topicQuestions.length) * 100
                  );

                  const badgeColors: Record<string, string> = {
                    amber: "bg-amber-100 text-amber-900 border-amber-300",
                    sky: "bg-sky-100 text-sky-900 border-sky-300",
                    teal: "bg-teal-100 text-teal-900 border-teal-300",
                    violet: "bg-violet-100 text-violet-900 border-violet-300",
                  };

                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
                              badgeColors[topic.accentColor]
                            }`}
                          >
                            {topic.formulaBadge}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-500">
                            {topic.questionRange} ({topic.count} câu)
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                          {topic.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
                        {/* Topic Mastery Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">
                              Tiến độ thuộc:{" "}
                              <strong className="text-teal-700">
                                {masteredInTopic}/{topic.count} câu ({percent}%)
                              </strong>
                            </span>
                            {wrongInTopic > 0 && (
                              <span className="text-rose-600 font-semibold">
                                {wrongInTopic} câu đang sai
                              </span>
                            )}
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-teal-600 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              startSession({
                                questions: topicQuestions,
                                title: `Chuyên đề: ${topic.title}`,
                                modeTag: `topic_${topic.id}`,
                                shuffleQ: false,
                                shuffleOpt: false,
                                mode: "instant",
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Ôn phần này
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              startSession({
                                questions: topicQuestions,
                                title: `Xáo trộn: ${topic.title}`,
                                modeTag: `topic_${topic.id}_shuffled`,
                                shuffleQ: true,
                                shuffleOpt: true,
                                mode: "instant",
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                            Xáo trộn phần này
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ==================== SECTION 2: BỘ TÙY CHỈNH CHẾ ĐỘ ÔN LUYỆN ĐA NĂNG ==================== */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Tạo Đề Ôn Luyện Tùy Chỉnh (Custom Study Builder)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Kết hợp nhiều phần, lọc câu sai/chưa làm, bật xáo trộn câu hỏi &amp; đáp án theo ý muốn.
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-900 font-mono text-xs font-bold border border-teal-200 self-start sm:self-center">
                  Số câu thỏa mãn: {customFilteredQuestions.length} câu
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Step 1: Select Topics */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    1. Chọn các phần muốn gộp:
                  </label>
                  <div className="space-y-2">
                    {TOPICS_META.map((t) => {
                      const checked = selectedTopics.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setSelectedTopics((prev) =>
                              prev.includes(t.id)
                                ? prev.length > 1
                                  ? prev.filter((x) => x !== t.id)
                                  : prev
                                : [...prev, t.id]
                            );
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                            checked
                              ? "bg-teal-50/80 border-teal-600 text-teal-950"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span>{t.title}</span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-slate-200">
                            {t.count} câu
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Filter Status & Feedback Mode */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      2. Lọc đối tượng câu hỏi:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "all", label: "Tất cả câu" },
                        { id: "wrong", label: `Câu làm sai (${stats.wrong})` },
                        { id: "unseen", label: `Chưa làm (${stats.unseen})` },
                        { id: "bookmarked", label: `Gắn sao (${stats.bookmarked})` },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() =>
                            setStatusFilter(
                              st.id as "all" | "wrong" | "unseen" | "bookmarked"
                            )
                          }
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                            statusFilter === st.id
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      3. Chế độ chấm &amp; giải thích:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackMode("instant")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          feedbackMode === "instant"
                            ? "bg-teal-50 border-teal-600 text-teal-950"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <div className="text-xs font-bold">Chế độ Ôn Học</div>
                        <div className="text-[11px] opacity-80 mt-0.5">
                          Chấm &amp; hiện lời giải ngay sau mỗi câu
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackMode("exam")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          feedbackMode === "exam"
                            ? "bg-teal-50 border-teal-600 text-teal-950"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <div className="text-xs font-bold">Chế độ Phòng Thi</div>
                        <div className="text-[11px] opacity-80 mt-0.5">
                          Làm hết đề rồi nộp bài chấm điểm
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3: Shuffle Options, Timer & Launch */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      4. Tùy chọn Xáo trộn &amp; Thời gian:
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        Xáo trộn thứ tự các câu hỏi
                      </span>
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className="w-4 h-4 accent-teal-700 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        Xáo trộn vị trí đáp án A, B, C, D
                      </span>
                      <input
                        type="checkbox"
                        checked={shuffleOptions}
                        onChange={(e) => setShuffleOptions(e.target.checked)}
                        className="w-4 h-4 accent-teal-700 rounded"
                      />
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-600 shrink-0">
                        Thời gian:
                      </span>
                      {[0, 15, 30, 45].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setTimeLimitMinutes(mins)}
                          className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                            timeLimitMinutes === mins
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {mins === 0 ? "Tự do" : `${mins}p`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={customFilteredQuestions.length === 0}
                    onClick={() =>
                      startSession({
                        questions: customFilteredQuestions,
                        title: `Đề tùy chỉnh (${customFilteredQuestions.length} câu)`,
                        modeTag: "custom",
                        shuffleQ: shuffleQuestions,
                        shuffleOpt: shuffleOptions,
                        mode: feedbackMode,
                        timeMinutes: timeLimitMinutes,
                      })
                    }
                    className="w-full py-3.5 px-5 min-h-[52px] rounded-2xl bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Bắt Đầu Luyện Tập ({customFilteredQuestions.length} câu)
                  </button>
                </div>
              </div>
            </section>

            {/* ==================== SECTION 3: TRA CỨU NHANH TOÀN BỘ 47 CÂU HỎI ==================== */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Ngân Hàng 47 Câu Hỏi Trong Đề Cương (Tra Cứu &amp; Chọn Câu Nhanh)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Tìm kiếm nhanh theo từ khóa (ví dụ: <em>pyrite, thạch cao, P₂O₅, oleum, đường mía</em>) hoặc nhấn vào câu bất kì để luyện ngay.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm câu hỏi, công thức hóa học..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Tất cả (47)" },
                  { id: "sulfur", label: "Sulfur (Câu 1–12)" },
                  { id: "so2", label: "Sulfur dioxide (Câu 13–24)" },
                  { id: "h2so4", label: "Sulfuric acid - Sulfate (Câu 25–40)" },
                  { id: "true_false", label: "Đúng / Sai (Câu 41–47)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setExplorerTopic(tab.id as TopicId | "all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      explorerTopic === tab.id
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Compact Grid of Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] md:max-h-[420px] overflow-y-auto pr-1">
                {explorerQuestions.map((q) => {
                  const p = progressMap[q.id];
                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        const idx = CHEMISTRY_QUESTIONS.findIndex(
                          (x) => x.id === q.id
                        );
                        startSession({
                          questions: CHEMISTRY_QUESTIONS,
                          title: `Ôn tập: ${q.code} — ${q.topicLabel}`,
                          modeTag: "explorer",
                          shuffleQ: false,
                          shuffleOpt: false,
                          mode: "instant",
                          timeMinutes: 0,
                          layout: "single",
                          startIndex: idx >= 0 ? idx : 0,
                        });
                      }}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition-all cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                            {q.code}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {q.keyFormula}
                          </span>
                          {q.illustrationId && (
                            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                              Có hình vẽ
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 line-clamp-2">
                          {q.stem}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {p?.status === "mastered" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : p?.status === "wrong" ? (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ==================== SECTION 4: LỊCH SỬ LÀM BÀI GẦN ĐÂY ==================== */}
            {sessions.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-teal-700" />
                    <h3 className="font-bold text-slate-900">
                      Lịch Sử Các Phiên Ôn Luyện Gần Đây
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "reset_all" }),
                      });
                      setProgressMap({});
                      setSessions([]);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Đặt lại toàn bộ dữ liệu
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sessions.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-teal-800 uppercase">
                          {s.mode === "exam" ? "Thi thử" : "Ôn luyện"}
                        </span>
                        <span className="font-mono text-slate-500">
                          {formatTime(s.durationSeconds)}
                        </span>
                      </div>
                      <div className="text-xl font-mono font-extrabold text-slate-900">
                        {s.score.toFixed(2)}{" "}
                        <span className="text-xs font-normal text-slate-500">/ 10 điểm</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Đúng tuyệt đối: {s.correctCount}/{s.totalQuestions} câu{" "}
                        {s.shuffled ? "• Có xáo trộn" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ====================================================================
         * VIEW 2: TRANG LÀM BÀI & ÔN LUYỆN (PRACTICE / EXAM WORKSPACE)
         * ==================================================================== */}
        {activeNav === "practice" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Workspace Control Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveNav("home")}
                    className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-all shrink-0"
                    title="Quay về Trang chủ"
                    aria-label="Quay về Trang chủ"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                      {sessionTitle}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-0.5">
                      <span>
                        Chế độ:{" "}
                        <strong className="text-teal-700">
                          {feedbackMode === "instant"
                            ? "Ôn học (Giải thích tức thì)"
                            : "Phòng thi (Nộp bài chấm điểm)"}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Đã làm:{" "}
                        <strong className="font-mono text-slate-800">
                          {sessionSummary.answered}/{activeQueue.length}
                        </strong>
                      </span>
                      {streakCount >= 2 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold animate-pop">
                          <span className="animate-flame-pop inline-block">🔥</span> Chuỗi đúng: {streakCount}
                        </span>
                      )}
                      {bestStreak >= 3 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          🏆 Kỷ lục: {bestStreak}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Workspace Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Auto-advance toggle (tự chuyển câu) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (autoAdvance) cancelAutoAdvance();
                      setAutoAdvance((v) => !v);
                    }}
                    aria-pressed={autoAdvance}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                      autoAdvance
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    title="Tự chuyển sang câu tiếp theo sau khi chấm, không cần bấm nút chuyển câu"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Tự chuyển</span>
                    <span className="hidden sm:inline">Tự chuyển câu</span>
                    <span
                      className={`hidden sm:inline px-1.5 py-0.5 rounded-full font-mono text-[10px] ${
                        autoAdvance ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {autoAdvance ? "BẬT" : "TẮT"}
                    </span>
                  </button>

                  {/* Question palette button (phones only — opens bottom sheet) */}
                  <button
                    type="button"
                    onClick={() => setShowPaletteSheet(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-slate-900 text-white text-xs font-bold transition-all active:scale-95"
                  >
                    <List className="w-3.5 h-3.5" />
                    Bảng câu
                  </button>

                  {/* Layout Switcher: Từng câu vs Tờ đề */}
                  <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        cancelAutoAdvance();
                        setWorkspaceLayout("single");
                      }}
                      className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        workspaceLayout === "single"
                          ? "bg-white text-teal-800 shadow-2xs"
                          : "text-slate-600"
                      }`}
                    >
                      Từng câu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cancelAutoAdvance();
                        setWorkspaceLayout("sheet");
                      }}
                      className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        workspaceLayout === "sheet"
                          ? "bg-white text-teal-800 shadow-2xs"
                          : "text-slate-600"
                      }`}
                    >
                      Toàn tờ đề ({activeQueue.length})
                    </button>
                  </div>

                  {/* Reshuffle Button */}
                  <button
                    type="button"
                    onClick={handleReshuffleCurrentSession}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                    title="Xáo trộn lại thứ tự câu hỏi và làm mới"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xáo trộn lại</span>
                  </button>

                  {/* Timer Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-slate-900 text-white font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    {remainingSeconds !== null ? (
                      <span className={remainingSeconds < 60 ? "text-rose-400 animate-pulse" : ""}>
                        Còn {formatTime(remainingSeconds)}
                      </span>
                    ) : (
                      <span>{formatTime(elapsedSeconds)}</span>
                    )}
                  </div>

                  {/* Submit / Finish Button */}
                  {!isSubmitted && (
                    <button
                      type="button"
                      onClick={handleSubmitSession}
                      className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Nộp bài &amp; Tổng kết
                    </button>
                  )}
                </div>
              </div>

              {/* Session progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Tiến độ làm bài</span>
                  <span className="font-mono">
                    {sessionSummary.answered}/{activeQueue.length} câu • {sessionSummary.scale10}đ
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        activeQueue.length
                          ? (sessionSummary.answered / activeQueue.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Post-Submission Result Banner */}
            {isSubmitted && (
              <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-teal-700/50 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                      <Award className="w-4 h-4" />
                      BẢNG ĐIỂM TỔNG KẾT PHIÊN LÀM BÀI
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      Điểm số quy đổi:{" "}
                      <span className="text-amber-300 font-mono">
                        {sessionSummary.scale10.toFixed(2)} / 10.0
                      </span>
                    </h3>
                    <p className="text-sm text-slate-300">
                      Số câu đúng tuyệt đối:{" "}
                      <strong className="text-emerald-300">
                        {sessionSummary.correct}/{activeQueue.length} câu
                      </strong>{" "}
                      • Thời gian hoàn thành: <strong>{formatTime(elapsedSeconds)}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {sessionSummary.wrong > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const wrongInThisRun = activeQueue.filter(
                            (q) => !isQuestionCorrect(q)
                          );
                          if (wrongInThisRun.length > 0) {
                            startSession({
                              questions: wrongInThisRun,
                              title: `Làm lại ${wrongInThisRun.length} câu vừa sai`,
                              modeTag: "retry_wrong",
                              shuffleQ: true,
                              shuffleOpt: true,
                              mode: "instant",
                              timeMinutes: 0,
                            });
                          }
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                      >
                        <Flame className="w-4 h-4" />
                        Luyện lại các câu vừa sai
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        startSession({
                          questions: activeQueue,
                          title: sessionTitle,
                          modeTag: sessionModeTag,
                          shuffleQ: shuffleQuestions,
                          shuffleOpt: shuffleOptions,
                          mode: feedbackMode,
                          timeMinutes: sessionTimeLimit,
                        })
                      }
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Làm lại đề này
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main 2-Column Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT / MAIN QUESTION COLUMN (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {workspaceLayout === "single" ? (
                  <>
                    {/* Mobile compact palette strip (horizontal scroll) */}
                    <div className="lg:hidden bg-white rounded-2xl border border-slate-200/90 p-2.5 shadow-xs">
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
                        {activeQueue.map((q, idx) => {
                          const answered = isQuestionAnswered(q);
                          const checked = Boolean(checkedQuestions[q.id] || isSubmitted);
                          const correct = isQuestionCorrect(q);
                          const isCurrent = currentIdx === idx;
                          let chip =
                            "bg-slate-100 text-slate-600 border-slate-200";
                          if (checked) {
                            chip = correct
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : answered
                              ? "bg-rose-600 text-white border-rose-600"
                              : "bg-amber-100 text-amber-900 border-amber-300";
                          } else if (answered) {
                            chip = "bg-teal-700 text-white border-teal-700";
                          }
                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => goToQuestion(idx)}
                              aria-label={`Câu ${idx + 1}`}
                              className={`shrink-0 w-10 h-10 rounded-xl font-mono text-xs font-bold border transition-all active:scale-95 ${chip} ${
                                isCurrent ? "ring-2 ring-offset-1 ring-slate-900" : ""
                              }`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Question card with slide transition + swipe-to-navigate */}
                    <div
                      ref={questionCardRef}
                      key={activeQueue[currentIdx]?.id}
                      className={`scroll-mt-24 ${
                        slideDirection === "next"
                          ? "animate-slide-next"
                          : slideDirection === "prev"
                          ? "animate-slide-prev"
                          : "animate-fadeIn"
                      }`}
                      style={{ touchAction: "pan-y" }}
                      onTouchStart={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("button, textarea, input, a")) {
                          touchStartRef.current = null;
                          return;
                        }
                        const t = e.touches[0];
                        touchStartRef.current = { x: t.clientX, y: t.clientY };
                      }}
                      onTouchEnd={(e) => {
                        const start = touchStartRef.current;
                        touchStartRef.current = null;
                        if (!start) return;
                        const t = e.changedTouches[0];
                        const dx = t.clientX - start.x;
                        const dy = t.clientY - start.y;
                        if (
                          Math.abs(dx) > 70 &&
                          Math.abs(dx) > Math.abs(dy) * 1.6
                        ) {
                          if (dx < 0) goToQuestion(currentIdx + 1, "next");
                          else goToQuestion(currentIdx - 1, "prev");
                        }
                      }}
                    >
                      {activeQueue[currentIdx] &&
                        renderQuestionCard(activeQueue[currentIdx], currentIdx)}
                    </div>

                    {/* Auto-advance countdown banner (tap to stay & read the explanation) */}
                    {autoAdvanceCountdown !== null && (
                      <button
                        type="button"
                        onClick={cancelAutoAdvance}
                        className="w-full text-left bg-teal-700 text-white rounded-2xl px-4 py-3 shadow-md animate-toast-in active:scale-[0.99] transition-transform"
                      >
                        <span className="flex items-center gap-2 text-sm font-bold">
                          <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                          Tự chuyển câu sau {autoAdvanceCountdown}s — nhấn để ở lại xem giải thích
                        </span>
                        <span className="block h-1 mt-2 rounded-full bg-white/20 overflow-hidden">
                          <span
                            key={autoAdvanceDelayMs}
                            className="block h-full bg-amber-300 rounded-full animate-countdown-bar"
                            style={{ animationDuration: `${autoAdvanceDelayMs}ms` }}
                          />
                        </span>
                      </button>
                    )}

                    {/* Bottom Prev / Next Navigation Bar */}
                    <div className="flex items-center justify-between gap-2 bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                      <button
                        type="button"
                        disabled={currentIdx === 0}
                        onClick={() => goToQuestion(currentIdx - 1, "prev")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[52px] rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-40 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Câu trước
                      </button>

                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-600 whitespace-nowrap">
                        Câu {currentIdx + 1} / {activeQueue.length}
                      </span>

                      <button
                        type="button"
                        disabled={currentIdx >= activeQueue.length - 1}
                        onClick={() => goToQuestion(currentIdx + 1, "next")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[52px] rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                      >
                        Câu tiếp theo
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="hidden md:block text-center text-[11px] text-slate-400">
                      Mẹo: phím ← → để chuyển câu, phím A–D để chọn đáp án • Trên điện thoại, vuốt sang trái/phải để chuyển câu
                    </p>
                  </>
                ) : (
                  /* FULL SHEET SCROLL LAYOUT (Xem toàn bộ tờ đề liền mạch) */
                  <div className="space-y-6">
                    {activeQueue.map((q, idx) => renderQuestionCard(q, idx))}
                  </div>
                )}
              </div>

              {/* RIGHT STICKY SIDEBAR: QUESTION PALETTE & SCORE TRACKER (desktop) */}
              <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Bảng Điều Hướng Câu Hỏi
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Nhấn vào số câu bất kì để chuyển nhanh
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-mono text-xs font-bold border border-teal-200">
                      {sessionSummary.scale10}đ
                    </span>
                  </div>

                  {/* Color Legend */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                      <span>Làm đúng ({sessionSummary.correct})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                      <span>Làm sai ({sessionSummary.wrong})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
                      <span>Đã chọn ({sessionSummary.answered})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                      <span>
                        Chưa làm ({activeQueue.length - sessionSummary.answered})
                      </span>
                    </div>
                  </div>

                  {/* Question Number Grid */}
                  <div className="grid grid-cols-6 gap-2 max-h-[340px] overflow-y-auto p-1">
                    {activeQueue.map((q, idx) => {
                      const isCurrent =
                        workspaceLayout === "single" && currentIdx === idx;
                      const answered = isQuestionAnswered(q);
                      const checked = Boolean(checkedQuestions[q.id] || isSubmitted);
                      const correct = isQuestionCorrect(q);
                      const bookmarked = Boolean(progressMap[q.id]?.bookmarked);

                      let btnStyle =
                        "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";
                      if (checked) {
                        if (correct) {
                          btnStyle =
                            "bg-emerald-600 text-white border-emerald-600 font-bold";
                        } else if (answered) {
                          btnStyle =
                            "bg-rose-600 text-white border-rose-600 font-bold";
                        } else {
                          btnStyle =
                            "bg-amber-100 text-amber-900 border-amber-300";
                        }
                      } else if (answered) {
                        btnStyle = "bg-teal-700 text-white border-teal-700 font-bold";
                      }

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            if (workspaceLayout === "single") {
                              goToQuestion(idx);
                            } else {
                              const el = document.getElementById(
                                `question-card-${q.id}`
                              );
                              el?.scrollIntoView({ behavior: "smooth", block: "center" });
                            }
                          }}
                          className={`relative h-10 rounded-xl font-mono text-xs border transition-all active:scale-95 flex items-center justify-center cursor-pointer ${btnStyle} ${
                            isCurrent ? "ring-2 ring-offset-2 ring-slate-900 scale-105" : ""
                          }`}
                        >
                          {idx + 1}
                          {bookmarked && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Filter Actions inside Sidebar */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        cancelAutoAdvance();
                        setFeedbackMode((m) => (m === "instant" ? "exam" : "instant"));
                      }}
                      className="w-full py-2.5 px-3 min-h-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-[0.99] border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all"
                    >
                      <span>Đổi chế độ phản hồi:</span>
                      <strong className="text-teal-700">
                        {feedbackMode === "instant" ? "Giải thích ngay" : "Nộp bài"}
                      </strong>
                    </button>

                    <label className="flex items-center justify-between py-2.5 px-3 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700">
                      <span>Xáo trộn đáp án A-B-C-D</span>
                      <input
                        type="checkbox"
                        checked={shuffleOptions}
                        onChange={(e) => {
                          const nextVal = e.target.checked;
                          setShuffleOptions(nextVal);
                          buildPermutations(activeQueue, nextVal);
                        }}
                        className="w-4 h-4 accent-teal-700 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile bottom-sheet question palette */}
            {showPaletteSheet && (
              <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center">
                <div
                  className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                  onClick={() => setShowPaletteSheet(false)}
                />
                <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-5 pb-8 safe-bottom shadow-2xl animate-toast-in max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Bảng điều hướng câu hỏi
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPaletteSheet(false)}
                      aria-label="Đóng bảng câu hỏi"
                      className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-100 active:scale-95 text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Đã làm {sessionSummary.answered}/{activeQueue.length} câu • {sessionSummary.scale10}đ • Đúng {sessionSummary.correct} • Sai {sessionSummary.wrong}
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {activeQueue.map((q, idx) => {
                      const answered = isQuestionAnswered(q);
                      const checked = Boolean(checkedQuestions[q.id] || isSubmitted);
                      const correct = isQuestionCorrect(q);
                      const isCurrent = currentIdx === idx;
                      let btnStyle =
                        "bg-slate-100 text-slate-700 border-slate-200";
                      if (checked) {
                        btnStyle = correct
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : answered
                          ? "bg-rose-600 text-white border-rose-600 font-bold"
                          : "bg-amber-100 text-amber-900 border-amber-300";
                      } else if (answered) {
                        btnStyle = "bg-teal-700 text-white border-teal-700 font-bold";
                      }
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setShowPaletteSheet(false);
                            goToQuestion(idx);
                          }}
                          className={`h-11 rounded-xl font-mono text-sm border transition-all active:scale-95 ${btnStyle} ${
                            isCurrent ? "ring-2 ring-offset-1 ring-slate-900" : ""
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                      <span>Làm đúng ({sessionSummary.correct})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                      <span>Làm sai ({sessionSummary.wrong})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
                      <span>Đã chọn ({sessionSummary.answered})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                      <span>Chưa làm ({activeQueue.length - sessionSummary.answered})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        )}

        {/* ====================================================================
         * VIEW 3: KHO CÂU SAI & ĐÁNH DẤU SAO (WRONG-ANSWER VAULT)
         * ==================================================================== */}
        {activeNav === "wrong_vault" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
                  <Flame className="w-4 h-4" />
                  KHO CÂU SAI &amp; CÂU ĐÁNH DẤU SAO
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Khắc Phục Lỗ Hổng Kiến Thức Tức Thì
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Mọi câu bạn chọn sai trong lúc làm bài đều được hệ thống tự động lưu lại tại đây kèm thống kê số lần sai để bạn ôn tập cho đến khi thuộc lòng 100%.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {wrongQuestionsList.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      startSession({
                        questions: wrongQuestionsList,
                        title: `Ôn tập chuyên sâu ${wrongQuestionsList.length} câu đang làm sai`,
                        modeTag: "wrong",
                        shuffleQ: true,
                        shuffleOpt: true,
                        mode: "instant",
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Luyện Ngay {wrongQuestionsList.length} Câu Sai (Xáo trộn)
                  </button>
                )}

                {bookmarkedQuestionsList.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      startSession({
                        questions: bookmarkedQuestionsList,
                        title: `Ôn tập ${bookmarkedQuestionsList.length} câu đánh dấu sao`,
                        modeTag: "bookmarked",
                        shuffleQ: false,
                        shuffleOpt: false,
                        mode: "instant",
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg transition-all cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    Ôn {bookmarkedQuestionsList.length} Câu Gắn Sao
                  </button>
                )}
              </div>
            </div>

            {/* Wrong Questions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Danh sách Câu đang làm sai ({wrongQuestionsList.length} câu)
                </h3>
                {wrongQuestionsList.length > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "clear_wrong" }),
                      });
                      setProgressMap((prev) => {
                        const next = { ...prev };
                        for (const k of Object.keys(next)) {
                          const numK = Number(k);
                          if (next[numK]?.status === "wrong") {
                            next[numK] = { ...next[numK], status: "mastered" };
                          }
                        }
                        return next;
                      });
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Đánh dấu tất cả là Đã hiểu ✓
                  </button>
                )}
              </div>

              {wrongQuestionsList.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Tuyệt vời! Kho câu sai của bạn đang trống (0 câu sai)
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Hãy tiếp tục làm đề toàn bộ 47 câu hoặc thi thử để kiểm tra độ vững vàng của kiến thức nhé.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {wrongQuestionsList.map((q) => {
                    const p = progressMap[q.id];
                    return (
                      <div
                        key={q.id}
                        className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold">
                              {q.code}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                              Sai {p?.wrongCount || 1} lần
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                              {q.topicLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                syncQuestionProgress(q.id, { status: "mastered" })
                              }
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                            >
                              ✓ Đã thuộc &amp; Xóa khỏi kho sai
                            </button>
                          </div>
                        </div>

                        <p className="font-semibold text-slate-900 text-sm sm:text-base">
                          {q.stem}
                        </p>

                        {q.type === "mcq" ? (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-950">
                            Đáp án đúng: {q.correctOption}.{" "}
                            {q.options?.find((o) => o.key === q.correctOption)?.text}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.statements?.map((st) => (
                              <div
                                key={st.key}
                                className={`p-2.5 rounded-xl border text-xs ${
                                  st.isTrue
                                    ? "bg-amber-50 border-amber-300 font-semibold"
                                    : "bg-slate-50 border-slate-200"
                                }`}
                              >
                                <strong>{st.key})</strong> {st.text} →{" "}
                                <strong
                                  className={
                                    st.isTrue ? "text-emerald-700" : "text-rose-700"
                                  }
                                >
                                  {st.isTrue ? "ĐÚNG" : "SAI"}
                                </strong>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line">
                          <strong>Giải thích: </strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
         * VIEW 4: CẨM NANG LÝ THUYẾT & FLASHCARD (THEORY HUB)
         * ==================================================================== */}
        {activeNav === "theory" && (
          <div className="animate-fadeIn">
            <ChemistryTheoryHub
              onStartTopicQuiz={(topicId) => {
                const topicMeta = TOPICS_META.find((t) => t.id === topicId);
                const list = CHEMISTRY_QUESTIONS.filter((q) => q.topic === topicId);
                startSession({
                  questions: list,
                  title: `Chuyên đề: ${topicMeta?.title || topicId}`,
                  modeTag: `topic_${topicId}`,
                  shuffleQ: false,
                  shuffleOpt: false,
                  mode: "instant",
                });
              }}
            />
          </div>
        )}
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Atom className="w-4 h-4 text-teal-700" />
            <span>ChemLab 11 – Hệ thống Ôn luyện Lý thuyết Hóa học 11 (Sulfur &amp; Hợp chất)</span>
          </div>
          <div>
            Tích hợp đầy đủ 47 câu hỏi chuẩn (Câu 1–40 Trắc nghiệm &amp; Câu 41–47 Đúng/Sai) • Lưu tiến độ tự động
          </div>
        </div>
      </footer>

      {/* Spacer so the fixed mobile tab bar never covers page content */}
      <div className="h-20 md:hidden" />

      {/* ==================== MOBILE BOTTOM TAB BAR ==================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-bottom shadow-[0_-4px_20px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-4 px-2 pt-1.5 pb-1">
          {(
            [
              { id: "home", label: "Trang chủ", icon: LayoutGrid, badge: 0 },
              { id: "practice", label: "Làm bài", icon: ListChecks, badge: 0 },
              { id: "wrong_vault", label: "Câu sai", icon: Flame, badge: stats.wrong },
              { id: "theory", label: "Lý thuyết", icon: BookOpen, badge: 0 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveNav(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
                  isActive ? "text-teal-700" : "text-slate-500"
                }`}
              >
                <span
                  className={`absolute top-0 h-0.5 w-8 rounded-full ${
                    isActive ? "bg-teal-600" : "bg-transparent"
                  }`}
                />
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="absolute top-1 right-3 px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
