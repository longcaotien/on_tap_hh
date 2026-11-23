"use client";

import React, { memo, useState } from "react";
import type { ChemistryQuestion, McqOption } from "@/data/chemistryQuestions";
import type { QuestionProgressItem } from "@/lib/progressStore";
import { ChemistryIllustration } from "@/components/ChemistryIllustrations";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FlaskConical,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Star,
  StickyNote,
  X,
} from "lucide-react";

type McqKey = "A" | "B" | "C" | "D";
type TfKey = "a" | "b" | "c" | "d";

/**
 * Stable callbacks shared by every card. The object identity never changes
 * between renders, which is what lets `React.memo` skip untouched cards.
 */
export interface QuestionCardActions {
  selectMcq: (q: ChemistryQuestion, key: McqKey) => void;
  selectTf: (q: ChemistryQuestion, key: TfKey, value: boolean) => void;
  gradeTfNow: (q: ChemistryQuestion) => void;
  retry: (questionId: number) => void;
  toggleBookmark: (questionId: number) => void;
  toggleHint: (questionId: number) => void;
  toggleNote: (questionId: number, savedNote: string) => void;
  editNote: (questionId: number, savedNote: string) => void;
  changeNoteDraft: (questionId: number, text: string) => void;
  closeNote: (questionId: number) => void;
  saveNote: (questionId: number) => void;
}

interface Props {
  q: ChemistryQuestion;
  index: number;
  total: number;
  /** Show the original question code next to the position (shuffled sessions). */
  showOriginalCode: boolean;
  instantFeedback: boolean;
  isSubmitted: boolean;
  isChecked: boolean;
  prog: QuestionProgressItem | undefined;
  mcqAnswer: McqKey | undefined;
  tfAnswer: Record<string, boolean> | undefined;
  options: McqOption[];
  hintOpen: boolean;
  noteOpen: boolean;
  noteDraft: string | undefined;
  actions: QuestionCardActions;
  className?: string;
}

const DISPLAY_LABELS: McqKey[] = ["A", "B", "C", "D"];

const iconButtonBase =
  "inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[40px] min-w-[40px] justify-center rounded-xl text-xs font-semibold border transition-[background-color,border-color,color,scale] duration-150 active:scale-95";

/**
 * One question (multiple choice or 4-statement True/False) with its answer
 * feedback, explanation and personal note.
 *
 * Memoised: in "Toàn tờ đề" mode 47 cards are mounted at once, and answering
 * one question must not re-render the other 46 (and their SVG lab diagrams).
 */
function QuestionCardImpl({
  q,
  index,
  total,
  showOriginalCode,
  instantFeedback,
  isSubmitted,
  isChecked,
  prog,
  mcqAnswer,
  tfAnswer,
  options,
  hintOpen,
  noteOpen,
  noteDraft,
  actions,
  className,
}: Props) {
  const isBookmarked = Boolean(prog?.bookmarked);
  const savedNote = prog?.personalNote ?? "";

  // Play the "correct / wrong" feedback animation only when the question is
  // graded while it is on screen — not when revisiting an already graded card
  // and not when a whole exam sheet is revealed at once.
  const [checkedOnMount] = useState(isChecked);
  const animateFeedback = isChecked && !checkedOnMount && !isSubmitted;
  const [bookmarkedOnMount] = useState(isBookmarked);
  const animateStar = isBookmarked && !bookmarkedOnMount;

  return (
    <div
      id={`question-card-${q.id}`}
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden ${className ?? ""}`}
    >
      {/* Question Header Bar */}
      <div className="px-4 sm:px-7 py-3 sm:py-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-700 text-white font-mono text-xs sm:text-sm font-bold shadow-xs">
            Câu {index + 1}/{total}
            {showOriginalCode && (
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
            onClick={() => actions.toggleHint(q.id)}
            aria-pressed={hintOpen}
            aria-label="Xem gợi ý công thức"
            className={`${iconButtonBase} ${
              hintOpen
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
            onClick={() => actions.toggleNote(q.id, savedNote)}
            aria-pressed={noteOpen}
            aria-label="Ghi chú cá nhân"
            className={`${iconButtonBase} ${
              savedNote
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
            onClick={() => actions.toggleBookmark(q.id)}
            aria-pressed={isBookmarked}
            aria-label="Đánh dấu sao câu hỏi quan trọng"
            className={`${iconButtonBase} ${
              isBookmarked
                ? "bg-amber-400 text-slate-950 border-amber-500 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title="Đánh dấu sao câu hỏi quan trọng"
          >
            <Star
              className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""} ${
                animateStar ? "animate-pop" : ""
              }`}
            />
            <span className="hidden sm:inline">{isBookmarked ? "Đã lưu" : "Đánh dấu"}</span>
          </button>

          {instantFeedback && isChecked && !isSubmitted && (
            <button
              type="button"
              onClick={() => actions.retry(q.id)}
              className={`${iconButtonBase} bg-white text-teal-700 border-teal-200 hover:bg-teal-50 animate-pop`}
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
        {hintOpen && (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-center justify-between animate-rise">
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
                className="pl-3 border-l-2 border-teal-600/60 leading-relaxed font-mono text-xs sm:text-sm break-words"
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
            // Caption/notes stay locked until the question is graded so the
            // figure never gives away part of the answer.
            revealCaption={isChecked}
          />
        )}

        {/* ==================== PART I: 4-OPTION MULTIPLE CHOICE ==================== */}
        {q.type === "mcq" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
            {options.map((opt, optIdx) => {
              const displayLetter = DISPLAY_LABELS[optIdx] || opt.key;
              const isSelected = mcqAnswer === opt.key;
              const isRightOption = opt.key === q.correctOption;

              let cardStyle =
                "bg-white border-slate-200/90 text-slate-800 hover:border-teal-500 hover:bg-teal-50/30 hover:shadow-sm";
              let badgeStyle =
                "bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600";
              let feedbackAnim = "";

              if (isChecked) {
                if (isRightOption) {
                  cardStyle =
                    "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs";
                  badgeStyle = "bg-emerald-600 text-white border border-emerald-600";
                  if (animateFeedback) feedbackAnim = "animate-correct";
                } else if (isSelected) {
                  cardStyle =
                    "bg-rose-50/90 border-rose-400 text-rose-950 ring-2 ring-rose-400/20";
                  badgeStyle = "bg-rose-600 text-white border border-rose-600";
                  if (animateFeedback) feedbackAnim = "animate-shake";
                } else {
                  cardStyle = "bg-slate-50/60 border-slate-200 text-slate-400 opacity-75";
                  badgeStyle = "bg-slate-200 text-slate-500 border border-slate-200";
                }
              } else if (isSelected) {
                cardStyle =
                  "bg-teal-50/90 border-teal-600 text-teal-950 ring-2 ring-teal-500/20 shadow-xs";
                badgeStyle = "bg-teal-700 text-white border border-teal-700";
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => actions.selectMcq(q, opt.key)}
                  disabled={isChecked}
                  aria-pressed={isSelected}
                  className={`group relative flex items-center justify-between gap-3 p-3.5 sm:p-4 min-h-[56px] rounded-2xl border-2 text-left transition-[background-color,border-color,color,box-shadow,opacity,scale] duration-200 active:scale-[0.98] ${cardStyle} ${feedbackAnim}`}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-xl font-mono text-sm font-bold flex items-center justify-center shrink-0 transition-colors duration-200 ${badgeStyle} ${
                        isChecked && isRightOption ? "underline decoration-2" : ""
                      }`}
                    >
                      {displayLetter}
                    </span>
                    <span className="text-sm sm:text-base font-medium leading-snug break-words min-w-0">
                      {opt.text}
                    </span>
                  </div>

                  {isChecked && isRightOption && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shrink-0 ${
                        animateFeedback ? "animate-pop" : ""
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Đúng
                    </span>
                  )}
                  {isChecked && isSelected && !isRightOption && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shrink-0 ${
                        animateFeedback ? "animate-pop" : ""
                      }`}
                    >
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
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 px-1 sm:px-2">
              <span>Chọn Đúng hoặc Sai cho từng mệnh đề a), b), c), d):</span>
              {instantFeedback && !isChecked && (
                <button
                  type="button"
                  onClick={() => actions.gradeTfNow(q)}
                  className="text-teal-700 hover:underline font-bold min-h-[36px]"
                >
                  Chấm điểm câu này ngay →
                </button>
              )}
            </div>

            {q.statements.map((st, stIdx) => {
              const userChoice = tfAnswer?.[st.key];
              const isStatementMatched = userChoice === st.isTrue;

              // When checked, highlight TRUE statements in yellow like the original exam worksheet!
              let rowStyle = "bg-slate-50/70 border-slate-200/90";
              if (isChecked) {
                if (st.isTrue) {
                  rowStyle = "bg-[#FEF08A]/55 border-amber-400 shadow-2xs"; // Yellow highlighter effect matching exam sheet!
                } else {
                  rowStyle = "bg-white border-slate-200";
                }
              } else if (userChoice !== undefined) {
                rowStyle = "bg-teal-50/40 border-teal-300";
              }

              const choiceClass = (value: boolean) => {
                const answerIsThis = st.isTrue === value;
                if (userChoice === value) {
                  if (!isChecked) return "bg-teal-700 text-white border-teal-700";
                  return answerIsThis
                    ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400"
                    : `bg-rose-600 text-white border-rose-600 ${
                        animateFeedback ? "animate-shake" : ""
                      }`;
                }
                if (isChecked && answerIsThis)
                  return "bg-emerald-100 text-emerald-900 border-emerald-400";
                return "bg-white text-slate-700 border-slate-300 hover:bg-slate-100";
              };

              return (
                <div
                  key={st.key}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-colors duration-200 space-y-2.5 ${rowStyle}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm sm:text-base text-slate-900 leading-relaxed flex-1 min-w-0">
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
                        aria-pressed={userChoice === true}
                        onClick={() => actions.selectTf(q, st.key, true)}
                        className={`px-4 py-2 min-h-[44px] min-w-[68px] rounded-xl font-mono text-xs font-bold border transition-[background-color,border-color,color,scale] duration-150 active:scale-95 ${choiceClass(
                          true
                        )}`}
                      >
                        ĐÚNG
                      </button>
                      <button
                        type="button"
                        disabled={isChecked}
                        aria-pressed={userChoice === false}
                        onClick={() => actions.selectTf(q, st.key, false)}
                        className={`px-4 py-2 min-h-[44px] min-w-[68px] rounded-xl font-mono text-xs font-bold border transition-[background-color,border-color,color,scale] duration-150 active:scale-95 ${choiceClass(
                          false
                        )}`}
                      >
                        SAI
                      </button>
                    </div>
                  </div>

                  {/* Individual Statement Explanation when Checked */}
                  {isChecked && (
                    <div
                      className={`pt-2 border-t border-slate-200/70 flex items-start gap-2 text-xs sm:text-sm text-slate-700 ${
                        animateFeedback ? "animate-rise" : ""
                      }`}
                      style={
                        animateFeedback
                          ? { animationDelay: `${stIdx * 70}ms` }
                          : undefined
                      }
                    >
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
          <div
            className={`mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-slate-50 border border-teal-200/90 space-y-2 ${
              animateFeedback ? "animate-rise" : "animate-fadeIn"
            }`}
            style={animateFeedback ? { animationDelay: "120ms" } : undefined}
          >
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
        {noteOpen ? (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-rise">
            <label
              htmlFor={`note-${q.id}`}
              className="block text-xs font-bold uppercase text-amber-900"
            >
              Ghi chú cá nhân cho {q.code} (Lưu tự động vào Cơ sở dữ liệu):
            </label>
            <textarea
              id={`note-${q.id}`}
              rows={2}
              value={noteDraft ?? savedNote}
              onChange={(e) => actions.changeNoteDraft(q.id, e.target.value)}
              placeholder="Nhập mẹo nhớ nhanh, lỗi sai cần tránh ở câu này..."
              className="w-full rounded-xl border border-amber-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => actions.closeNote(q.id)}
                className="px-3 py-1.5 min-h-[40px] rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60 active:scale-95 transition-[background-color,scale]"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => actions.saveNote(q.id)}
                className="px-4 py-1.5 min-h-[40px] rounded-lg text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 active:scale-95 transition-[background-color,scale]"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        ) : (
          savedNote && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start justify-between gap-3 text-xs sm:text-sm text-amber-950">
              <div className="flex items-start gap-2 min-w-0">
                <StickyNote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0 break-words">
                  <strong className="font-semibold">Ghi chú của bạn: </strong>
                  {savedNote}
                </div>
              </div>
              <button
                type="button"
                onClick={() => actions.editNote(q.id, savedNote)}
                className="text-xs font-semibold text-amber-800 underline shrink-0 min-h-[32px] px-1"
              >
                Sửa
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export const QuestionCard = memo(QuestionCardImpl);
