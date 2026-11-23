"use client";

import React, { useEffect, useState, useRef } from "react";
import { CHEMISTRY_QUESTIONS, TopicId } from "@/data/chemistryQuestions";
import { useSlidingIndicator } from "@/components/ui";
import {
  Atom,
  BookOpen,
  Flame,
  FlaskConical,
  Layers,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface Props {
  onStartTopicQuiz: (topic: TopicId) => void;
}

export function ChemistryTheoryHub({ onStartTopicQuiz }: Props) {
  const [activeTab, setActiveTab] = useState<"cheat_sheet" | "flashcards">("cheat_sheet");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [topicFilter, setTopicFilter] = useState<TopicId | "all">("all");

  const filteredQuestions = CHEMISTRY_QUESTIONS.filter((q) =>
    topicFilter === "all" ? true : q.topic === topicFilter
  );

  // Derive a safe index so the card never goes out of bounds when filtering
  const safeCardIndex = filteredQuestions.length
    ? Math.min(cardIndex, filteredQuestions.length - 1)
    : 0;
  const currentQ = filteredQuestions[safeCardIndex] || filteredQuestions[0];

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  // Which entrance animation the flashcard plays when its content changes
  const [cardMotion, setCardMotion] = useState<"flip" | "next" | "prev">("next");
  const modeSwitchRef = useSlidingIndicator<HTMLDivElement>(activeTab);

  const handleNextCard = () => {
    setCardMotion("next");
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrevCard = () => {
    setCardMotion("prev");
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
  };

  const handleFlipCard = () => {
    setCardMotion("flip");
    setIsFlipped((v) => !v);
  };

  // Desktop shortcuts on the flashcard tab: ← → change card, Space/Enter flips
  const keyHandlersRef = useRef({ next: handleNextCard, prev: handlePrevCard, flip: handleFlipCard });
  useEffect(() => {
    keyHandlersRef.current = { next: handleNextCard, prev: handlePrevCard, flip: handleFlipCard };
  });
  useEffect(() => {
    if (activeTab !== "flashcards") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest("button, a, input, textarea, select, [role='button']")) {
        // Let focused controls handle their own keys (Enter/Space activate them)
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        keyHandlersRef.current.next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        keyHandlersRef.current.prev();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        keyHandlersRef.current.flip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTab]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Mode Switcher Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <BookOpen className="w-3.5 h-3.5" />
            CẨM NANG LÝ THUYẾT &amp; FLASHCARD HÓA 11
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Hệ thống hóa kiến thức Chương Sulfur – Hợp chất chứa Sulfur
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Nắm chắc 100% công thức khoáng vật, tính oxi hóa - khử và phương pháp tiếp xúc trước khi bước vào phòng thi.
          </p>
        </div>

        <div
          ref={modeSwitchRef}
          className="relative flex sm:inline-flex w-full sm:w-auto rounded-xl bg-slate-100 p-1 border border-slate-200 sm:self-start"
        >
          <span
            data-indicator
            aria-hidden="true"
            className="tab-indicator rounded-lg bg-white shadow-sm"
          />
          <button
            type="button"
            data-active={activeTab === "cheat_sheet"}
            aria-pressed={activeTab === "cheat_sheet"}
            onClick={() => setActiveTab("cheat_sheet")}
            className={`relative z-10 flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-[color,scale] duration-200 active:scale-95 ${
              activeTab === "cheat_sheet"
                ? "text-teal-800"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FlaskConical className="w-4 h-4 shrink-0" />
            <span className="sm:hidden">Bảng tổng hợp</span>
            <span className="hidden sm:inline">Sơ đồ &amp; Bảng tổng hợp</span>
          </button>
          <button
            type="button"
            data-active={activeTab === "flashcards"}
            aria-pressed={activeTab === "flashcards"}
            onClick={() => setActiveTab("flashcards")}
            className={`relative z-10 flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-[color,scale] duration-200 active:scale-95 ${
              activeTab === "flashcards"
                ? "text-teal-800"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="sm:hidden">Flashcard (47)</span>
            <span className="hidden sm:inline">Thẻ ghi nhớ Flashcard (47 thẻ)</span>
          </button>
        </div>
      </div>

      {activeTab === "cheat_sheet" ? (
        <div className="space-y-6 stagger">
          {/* Oxidation States Scale Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                  TRỤC SỐ OXI HÓA CỦA NGUYÊN TỐ SULFUR (Z = 16, Chu kì 3, Nhóm VIA)
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  Quy tắc suy luận nhanh Tính Oxi Hóa &amp; Tính Khử
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-amber-200 font-mono text-xs border border-white/15">
                Cấu hình e: [Ne] 3s² 3p⁴ • Độ âm điện: 2,58
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white/10 border border-white/15 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-rose-300">S⁻²</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-200 border border-rose-400/30">
                    Thấp nhất
                  </span>
                </div>
                <p className="text-sm font-semibold mt-2 text-white">H₂S, FeS, HgS, Na₂S</p>
                <p className="text-xs text-slate-300 mt-1">
                  Chỉ có <strong>tính khử</strong> (nhường e tăng lên 0, +4, +6). Mùi trứng thối đặc trưng (H₂S).
                </p>
              </div>

              <div className="rounded-xl bg-amber-400/15 border border-amber-300/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-amber-300">S⁰</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    Trung gian
                  </span>
                </div>
                <p className="text-sm font-semibold mt-2 text-white">Đơn chất S₈ (Diêm sinh)</p>
                <p className="text-xs text-slate-200 mt-1">
                  Vừa <strong>oxi hóa</strong> (tác dụng Fe, Hg, H₂ → S⁻²) vừa <strong>khử</strong> (tác dụng O₂ → SO₂, F₂ → SF₆).
                </p>
              </div>

              <div className="rounded-xl bg-sky-400/15 border border-sky-300/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-sky-300">S⁺⁴</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-sky-400/20 text-sky-200 border border-sky-300/30">
                    Trung gian
                  </span>
                </div>
                <p className="text-sm font-semibold mt-2 text-white">SO₂, H₂SO₃, SO₃²⁻</p>
                <p className="text-xs text-slate-200 mt-1">
                  Vừa <strong>oxi hóa</strong> (SO₂ + 2H₂S → 3S + 2H₂O) vừa <strong>khử</strong> (SO₂ + Br₂ + 2H₂O → 2HBr + H₂SO₄).
                </p>
              </div>

              <div className="rounded-xl bg-teal-400/15 border border-teal-300/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-teal-300">S⁺⁶</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-teal-400/20 text-teal-200 border border-teal-300/30">
                    Cao nhất
                  </span>
                </div>
                <p className="text-sm font-semibold mt-2 text-white">SO₃, H₂SO₄ đặc, SO₄²⁻</p>
                <p className="text-xs text-slate-200 mt-1">
                  H₂SO₄ đặc có <strong>tính oxi hóa rất mạnh</strong> và <strong>háo nước</strong> (than hóa đường mía, giấy).
                </p>
              </div>
            </div>
          </div>

          {/* 3-Column Core Knowledge Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Khoáng vật & Công thức dễ nhầm */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,translate] duration-300 ease-smooth flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Atom className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Bảng Công Thức Khoáng Vật</h4>
                    <p className="text-xs text-slate-500">Các câu hỏi hay bẫy công thức (Câu 3, 10, 32, 35, 38, 39)</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Quặng pyrite sắt</span>
                    <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      FeS₂
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Thạch cao sống (xi măng, phấn)</span>
                    <span className="font-mono font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-md">
                      CaSO₄·2H₂O
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Thạch cao nung (bó bột, đúc tượng)</span>
                    <span className="font-mono font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-md">
                      CaSO₄·0,5H₂O
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Chất cản quang X-quang, giấy trắng</span>
                    <span className="font-mono font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md">
                      BaSO₄ (không tan)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Magnesium sulfate (hút mồ hôi)</span>
                    <span className="font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md">
                      MgSO₄
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Hỗn hợp Oleum công nghiệp</span>
                    <span className="font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md">
                      H₂SO₄·nSO₃
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartTopicQuiz("sulfur")}
                className="mt-4 w-full py-2.5 px-3 min-h-[44px] rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-amber-900 font-semibold text-xs border border-amber-200 transition-[background-color,scale] duration-150"
              >
                Luyện ngay Chuyên đề Sulfur (12 câu) →
              </button>
            </div>

            {/* Card 2: Khí SO2 & Môi trường */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,translate] duration-300 ease-smooth flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Trọng Tâm Khí SO₂ &amp; Thí Nghiệm</h4>
                    <p className="text-xs text-slate-500">Điều chế, làm khô, thu khí và bảo vệ môi trường</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tính chất vật lí:</strong> Khí không màu, mùi hắc, độc, nặng hơn không khí (d = 64/29), <strong>tan tốt trong nước</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Bông nút miệng bình thu SO₂:</strong> Tẩm dung dịch kiềm như <strong>nước vôi Ca(OH)₂</strong> hoặc <strong>NaOH</strong> để ngăn khí độc thoát ra.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Chất rắn làm khô khí SO₂:</strong> Dùng <strong>P₂O₅</strong> (không dùng KOH, NaOH, CaO vì chúng phản ứng với acidic oxide SO₂).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Ứng dụng SO₂ (3 ứng dụng):</strong> Sản xuất H₂SO₄, tẩy trắng bột giấy, diệt nấm mốc/thuốc đông y (<em>không dùng diệt trùng nước sinh hoạt</em>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Phân biệt SO₂ và CO₂:</strong> Dùng dung dịch <strong>nước bromine (Br₂)</strong> (SO₂ làm mất màu nước Br₂).
                    </span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onStartTopicQuiz("so2")}
                className="mt-4 w-full py-2.5 px-3 min-h-[44px] rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-[0.98] text-sky-900 font-semibold text-xs border border-sky-200 transition-[background-color,scale] duration-150"
              >
                Luyện ngay Chuyên đề Sulfur dioxide (12 câu) →
              </button>
            </div>

            {/* Card 3: An toàn H2SO4 & Phương pháp tiếp xúc */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,translate] duration-300 ease-smooth flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">H₂SO₄ Đặc &amp; An Toàn Phòng Lab</h4>
                    <p className="text-xs text-slate-500">Quy tắc pha loãng, sơ cứu và sản xuất công nghiệp</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Lỏng sánh như dầu, không bay hơi:</strong> Do liên kết hydrogen rất mạnh giữa các phân tử H₂SO₄.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Pha loãng H₂SO₄ đặc an toàn:</strong> <strong>Rót từ từ acid vào nước</strong> và khuấy nhẹ (tuyệt đối không rót nước vào acid).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Bước sơ cứu ĐẦU TIÊN khi bỏng H₂SO₄:</strong> <strong>Rửa ngay với nước lạnh nhiều lần</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Phương pháp tiếp xúc (3 giai đoạn):</strong> Đi từ nguyên liệu <strong>S hoặc FeS₂</strong>; hấp thụ SO₃ bằng <strong>H₂SO₄ 98%</strong> tạo oleum.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Nhận biết ion SO₄²⁻:</strong> Dùng dung dịch <strong>BaCl₂</strong> tạo kết tủa trắng <strong>BaSO₄↓</strong>.
                    </span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onStartTopicQuiz("h2so4")}
                className="mt-4 w-full py-2.5 px-3 min-h-[44px] rounded-xl bg-teal-50 hover:bg-teal-100 active:scale-[0.98] text-teal-900 font-semibold text-xs border border-teal-200 transition-[background-color,scale] duration-150"
              >
                Luyện ngay Chuyên đề H₂SO₄ &amp; Sulfate (16 câu) →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== FLASHCARD MODE ==================== */
        <div
          className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-rise"
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
            if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
              suppressClickRef.current = true;
              if (dx < 0) handleNextCard();
              else handlePrevCard();
            }
          }}
        >
          {/* Topic Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible max-w-[calc(100%+1.5rem)] sm:max-w-none">
              {[
                { id: "all", label: "Tất cả (47 thẻ)" },
                { id: "sulfur", label: "Sulfur (12)" },
                { id: "so2", label: "SO₂ (12)" },
                { id: "h2so4", label: "H₂SO₄ & Sulfate (16)" },
                { id: "true_false", label: "Đúng/Sai (7)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={topicFilter === tab.id}
                  onClick={() => {
                    setCardMotion("next");
                    setTopicFilter(tab.id as TopicId | "all");
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`shrink-0 px-3.5 py-1.5 min-h-[40px] rounded-full text-xs font-semibold whitespace-nowrap transition-[background-color,color,scale] duration-150 active:scale-95 ${
                    topicFilter === tab.id
                      ? "bg-teal-700 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono font-semibold text-slate-500">
              Thẻ {safeCardIndex + 1} / {filteredQuestions.length}
            </span>
          </div>

          {/* Interactive Flashcard: flips in 3D when turned, slides when changing card */}
          <div
            key={`${currentQ.id}-${isFlipped ? "back" : "front"}`}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Thẻ đang hiện đáp án — nhấn để lật lại" : "Thẻ đang hiện đề bài — nhấn để lật xem đáp án"}
            onClick={() => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }
              handleFlipCard();
            }}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleFlipCard();
              }
            }}
            className={`cursor-pointer select-none rounded-3xl border-2 bg-white p-5 sm:p-10 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[320px] flex flex-col justify-between relative overflow-hidden ${
              isFlipped ? "border-emerald-300" : "border-slate-200"
            } ${
              cardMotion === "flip"
                ? "animate-flip-in"
                : cardMotion === "prev"
                ? "animate-slide-prev"
                : "animate-slide-next"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-teal-700 text-white font-mono text-xs font-bold">
                  {currentQ.code}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  {currentQ.topicLabel}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                <RotateCcw className="w-3.5 h-3.5" />
                {isFlipped ? "Đang xem Đáp án (Nhấn để lật lại)" : "Nhấn vào thẻ để lật xem Đáp án"}
              </span>
            </div>

            {!isFlipped ? (
              <div className="my-6 space-y-4">
                <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  {currentQ.stem}
                </p>
                {currentQ.subItems && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-sm font-mono text-slate-700">
                    {currentQ.subItems.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
                {currentQ.type === "mcq" && currentQ.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {currentQ.options.map((opt) => (
                      <div
                        key={opt.key}
                        className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700"
                      >
                        <strong className="text-teal-700 mr-1.5">{opt.key}.</strong>
                        {opt.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="my-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  ĐÁP ÁN CHUẨN &amp; GIẢI THÍCH CHI TIẾT
                </div>

                {currentQ.type === "mcq" ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 font-bold text-lg">
                    Đáp án đúng: {currentQ.correctOption}.{" "}
                    {currentQ.options?.find((o) => o.key === currentQ.correctOption)?.text}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentQ.statements?.map((st) => (
                      <div
                        key={st.key}
                        className={`p-3 rounded-xl border text-sm flex items-start justify-between gap-3 ${
                          st.isTrue
                            ? "bg-amber-50/90 border-amber-300 text-slate-900"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <span>
                          <strong>{st.key})</strong> {st.text}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold shrink-0 ${
                            st.isTrue
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {st.isTrue ? "ĐÚNG" : "SAI"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {currentQ.explanation}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-mono font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Từ khóa: {currentQ.keyFormula}
              </span>
              <span>Mức độ: {currentQ.difficulty}</span>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrevCard}
              aria-label="Thẻ trước"
              className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2.5 min-h-[48px] rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 active:scale-95 transition-[background-color,scale] duration-150 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden min-[420px]:inline">Câu trước</span>
            </button>
            <button
              type="button"
              onClick={handleFlipCard}
              className="group inline-flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-2.5 min-h-[48px] rounded-xl bg-teal-700 text-white font-semibold text-xs sm:text-sm hover:bg-teal-800 active:scale-95 transition-[background-color,scale] duration-150 shadow-sm"
            >
              <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-180" />
              {isFlipped ? "Xem đề bài" : "Lật xem đáp án"}
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              aria-label="Thẻ tiếp theo"
              className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2.5 min-h-[48px] rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 active:scale-95 transition-[background-color,scale] duration-150 shadow-sm"
            >
              <span className="hidden min-[420px]:inline">Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="hidden md:block text-center text-[11px] text-slate-400">
            Mẹo: phím ← → để đổi thẻ, phím Space để lật thẻ • Trên điện thoại, vuốt sang trái/phải để đổi thẻ
          </p>
        </div>
      )}
    </div>
  );
}
