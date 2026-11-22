"use client";

import React, { useState } from "react";
import { CHEMISTRY_QUESTIONS, TopicId } from "@/data/chemistryQuestions";
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

  const currentQ = filteredQuestions[cardIndex] || filteredQuestions[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
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

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("cheat_sheet")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "cheat_sheet"
                ? "bg-white text-teal-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Sơ đồ &amp; Bảng tổng hợp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("flashcards")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "flashcards"
                ? "bg-white text-teal-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            Thẻ ghi nhớ Flashcard (47 thẻ)
          </button>
        </div>
      </div>

      {activeTab === "cheat_sheet" ? (
        <div className="space-y-6">
          {/* Oxidation States Scale Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md">
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
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
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

              <div className="rounded-xl bg-amber-400/15 backdrop-blur-sm border border-amber-300/30 p-4">
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

              <div className="rounded-xl bg-sky-400/15 backdrop-blur-sm border border-sky-300/30 p-4">
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

              <div className="rounded-xl bg-teal-400/15 backdrop-blur-sm border border-teal-300/30 p-4">
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
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
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
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-colors"
              >
                Luyện ngay Chuyên đề Sulfur (12 câu) →
              </button>
            </div>

            {/* Card 2: Khí SO2 & Môi trường */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
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
                className="mt-4 w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-semibold text-xs border border-sky-200 transition-colors"
              >
                Luyện ngay Chuyên đề Sulfur dioxide (12 câu) →
              </button>
            </div>

            {/* Card 3: An toàn H2SO4 & Phương pháp tiếp xúc */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
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
                className="mt-4 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold text-xs border border-teal-200 transition-colors"
              >
                Luyện ngay Chuyên đề H₂SO₄ &amp; Sulfate (16 câu) →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== FLASHCARD MODE ==================== */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Topic Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
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
                  onClick={() => {
                    setTopicFilter(tab.id as TopicId | "all");
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
              Thẻ {cardIndex + 1} / {filteredQuestions.length}
            </span>
          </div>

          {/* Interactive 3D-feel Flashcard */}
          <div
            onClick={() => setIsFlipped((v) => !v)}
            className="cursor-pointer select-none rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-10 shadow-md hover:shadow-lg transition-all min-h-[320px] flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
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
              <div className="my-6 space-y-4 animate-fadeIn">
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

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-mono font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Từ khóa: {currentQ.keyFormula}
              </span>
              <span>Mức độ: {currentQ.difficulty}</span>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevCard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Câu trước
            </button>
            <button
              type="button"
              onClick={() => setIsFlipped((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              {isFlipped ? "Xem đề bài" : "Lật xem đáp án"}
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 shadow-sm"
            >
              Câu tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
