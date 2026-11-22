"use client";

import React, { useState } from "react";
import { IllustrationId } from "@/data/chemistryQuestions";
import { ZoomIn, ZoomOut, Tag, Eye } from "lucide-react";

/* ============================================================================
 * "ĐỀ THI" STYLE ENGINE
 * Everything is drawn like a printed exam figure (TikZ-look): thin black ink,
 * paper-white glassware, serif labels, no gradients or colours.
 * ========================================================================== */

const INK = "#111827";
const INK_SOFT = "#475569";
const GLASS = "#f8fafc";
const SERIF = 'Georgia, "Times New Roman", "Songti SC", serif';

const stroke = {
  fill: "none",
  stroke: INK,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const thin = {
  fill: "none",
  stroke: INK,
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const hair = {
  fill: "none",
  stroke: INK,
  strokeWidth: 0.7,
  strokeLinecap: "round" as const,
};

/** Serif text label, typeset like a LaTeX figure caption. */
function T({
  x,
  y,
  children,
  size = 11.5,
  italic = false,
  anchor = "start",
  fill = INK,
  weight = 400,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  italic?: boolean;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={SERIF}
      fontSize={size}
      fontWeight={weight}
      fontStyle={italic ? "italic" : "normal"}
      fill={fill}
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

/** Thin leader line used to attach a label to a part of the drawing. */
function Leader({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={INK_SOFT}
      strokeWidth={0.8}
      strokeDasharray="3 2.5"
    />
  );
}

/** Arrow head for flow diagrams. */
function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} strokeWidth={1.3} />
      <path
        d={`M${x2} ${y2} l-6 -3.4 v6.8 z`}
        fill={INK}
        stroke="none"
        transform={`rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI} ${x2} ${y2})`}
      />
    </g>
  );
}

/** Bunsen flame, drawn with the two-tone ink look of printed figures. */
function Flame({ cx, baseY, h = 32 }: { cx: number; baseY: number; h?: number }) {
  const tip = baseY - h;
  const w = h * 0.36;
  return (
    <g>
      <path
        d={`M${cx} ${tip}
            C${cx + w * 1.5} ${tip + h * 0.42} ${cx + w} ${baseY - h * 0.12} ${cx + w} ${baseY}
            L${cx - w} ${baseY}
            C${cx - w} ${baseY - h * 0.12} ${cx - w * 1.5} ${tip + h * 0.42} ${cx} ${tip} Z`}
        fill="#fff"
        stroke={INK}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <path
        d={`M${cx} ${tip + h * 0.34}
            C${cx + w * 0.7} ${tip + h * 0.62} ${cx + w * 0.45} ${baseY - h * 0.16} ${cx + w * 0.45} ${baseY - h * 0.06}
            L${cx - w * 0.45} ${baseY - h * 0.06}
            C${cx - w * 0.45} ${baseY - h * 0.16} ${cx - w * 0.7} ${tip + h * 0.62} ${cx} ${tip + h * 0.34} Z`}
        fill="none"
        stroke={INK_SOFT}
        strokeWidth={0.8}
      />
    </g>
  );
}

/** Spirit lamp body placed under a flame. */
function Burner({ cx, y }: { cx: number; y: number }) {
  return (
    <g>
      <path
        d={`M${cx - 11} ${y} h22 l7 15 h-36 z`}
        fill="#fff"
        stroke={INK}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <rect
        x={cx - 24}
        y={y + 15}
        width={48}
        height={8}
        rx={2}
        fill="#fff"
        stroke={INK}
        strokeWidth={1.3}
      />
    </g>
  );
}

/* ============================================================================
 * PUBLIC COMPONENT
 * ========================================================================== */

interface Props {
  id: IllustrationId;
  caption?: string;
  /** When false the caption is locked behind a tap (it can hint the answer). */
  revealCaption?: boolean;
}

export function ChemistryIllustration({
  id,
  caption,
  revealCaption = true,
}: Props) {
  const [zoomed, setZoomed] = useState(false);
  // Annotations name reagents/products: they must never be on by default.
  const [showLabels, setShowLabels] = useState(false);
  const [captionOpen, setCaptionOpen] = useState(false);

  const figure = (() => {
    switch (id) {
      case "s8_ring":
        return <S8RingSvg showLabels={showLabels} />;
      case "so2_collection":
        return <So2CollectionSvg showLabels={showLabels} />;
      case "so2_drying":
        return <So2DryingSvg showLabels={showLabels} />;
      case "mgso4_chalk":
        return <Mgso4ChalkSvg showLabels={showLabels} />;
      case "fe_s_lab":
        return <FeSLabSvg showLabels={showLabels} />;
      case "s_o2_lab":
        return <SO2LabSvg showLabels={showLabels} />;
      case "cu_h2so4_lab":
        return <CuH2so4LabSvg showLabels={showLabels} />;
      case "sugar_h2so4_lab":
        return <SugarH2so4LabSvg showLabels={showLabels} />;
      case "contact_process":
        return <ContactProcessSvg showLabels={showLabels} />;
      default:
        return null;
    }
  })();

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      {/* Toolbar — deliberately quiet, like a figure caption bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-3 py-1.5 sm:px-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          Hình minh họa
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            aria-pressed={showLabels}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-all active:scale-95 ${
              showLabels
                ? "border-teal-600/30 bg-teal-600/10 text-teal-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            title="Bật/tắt chú thích trên hình (có thể gợi ý đáp án)"
          >
            <Tag className="h-3 w-3" />
            {showLabels ? "Đang hiện chú thích" : "Hiện chú thích"}
          </button>
          <button
            type="button"
            onClick={() => setZoomed((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
            title={zoomed ? "Thu nhỏ hình" : "Phóng to hình"}
          >
            {zoomed ? (
              <>
                <ZoomOut className="h-3 w-3" /> Thu nhỏ
              </>
            ) : (
              <>
                <ZoomIn className="h-3 w-3" /> Phóng to
              </>
            )}
          </button>
        </div>
      </div>

      {/* Paper canvas */}
      <div
        className={`bg-white ${
          zoomed ? "overflow-x-auto px-3 py-4 sm:px-6" : "px-3 py-3 sm:px-5 sm:py-4"
        }`}
      >
        <div className={zoomed ? "mx-auto min-w-[520px] max-w-3xl" : "mx-auto max-w-xl"}>
          {figure}
        </div>
      </div>

      {caption && revealCaption && (
        <figcaption className="border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-center font-serif text-[11.5px] italic text-slate-600 sm:text-xs">
          {caption}
        </figcaption>
      )}

      {caption && !revealCaption && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-center">
          {captionOpen ? (
            <p className="font-serif text-[11.5px] italic text-slate-600 sm:text-xs">
              {caption}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setCaptionOpen(true)}
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-95"
              title="Chú thích hình có thể gợi ý đáp án"
            >
              <Eye className="h-3 w-3" />
              Hiện chú thích hình
            </button>
          )}
        </div>
      )}
    </figure>
  );
}

/* ============================================================================
 * 1. CÂU 11 — MẠCH VÒNG S₈ (crown conformation)
 * ========================================================================== */
function S8RingSvg({ showLabels }: { showLabels: boolean }) {
  // Regular ring of eight sulfur atoms (crown conformation, drawn flat like a
  // textbook figure). Front atoms are slightly bigger to suggest depth.
  const cx = 250;
  const cy = 152;
  const R = 92;
  const atoms = Array.from({ length: 8 }, (_, i) => {
    const a = (-Math.PI / 2) + (i * Math.PI) / 4; // start at the top
    return {
      x: Math.round((cx + R * Math.cos(a)) * 10) / 10,
      y: Math.round((cy + R * Math.sin(a)) * 10) / 10,
      front: Math.sin(a) > 0.2,
    };
  });
  const sub = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈"];

  return (
    <svg viewBox="0 0 500 320" className="h-auto w-full select-none">
      {atoms.map((a, i) => {
        const b = atoms[(i + 1) % 8];
        return (
          <line
            key={`b${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={INK}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
        );
      })}

      {atoms.map((a, i) => {
        const r = a.front ? 19 : 16.5;
        return (
          <g key={`a${i}`}>
            <circle cx={a.x} cy={a.y} r={r} fill="#fff" stroke={INK} strokeWidth={1.7} />
            <T x={a.x} y={a.y + 0.5} anchor="middle" size={a.front ? 14 : 12.5} weight={700}>
              S
            </T>
          </g>
        );
      })}

      {showLabels && (
        <g>
          {atoms.map((a, i) => {
            const dx = a.x - cx;
            const dy = a.y - cy;
            const len = Math.hypot(dx, dy) || 1;
            const off = 30;
            return (
              <T
                key={`l${i}`}
                x={a.x + (dx / len) * off}
                y={a.y + (dy / len) * off}
                anchor="middle"
                size={10.5}
                italic
                fill={INK_SOFT}
              >
                {`S${sub[i]}`}
              </T>
            );
          })}
          <T x={cx} y={292} anchor="middle" size={10.5} italic fill={INK_SOFT}>
            Mạch vòng gồm 8 nguyên tử sulfur
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 2. CÂU 15 — THU SO₂ VÀO BÌNH TAM GIÁC CÓ BÔNG TẨM DUNG DỊCH E
 * ========================================================================== */
function So2CollectionSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 460 300" className="h-auto w-full select-none">
      {/* delivery tube */}
      <line x1={222} y1={40} x2={222} y2={236} {...stroke} />
      <line x1={234} y1={40} x2={234} y2={236} {...stroke} />
      <path d="M222 236 a6 6 0 0 0 12 0" {...stroke} />

      {/* cotton plug (bông tẩm dung dịch E) */}
      <ellipse cx={228} cy={78} rx={26} ry={14} fill="#fff" stroke={INK} strokeWidth={1.6} />
      <path d="M212 72 q6 6 0 12" {...hair} />
      <path d="M222 70 q6 7 0 14" {...hair} />
      <path d="M232 70 q6 7 0 14" {...hair} />
      <path d="M242 72 q6 6 0 12" {...hair} />

      {/* Erlenmeyer flask */}
      <path
        d="M206 92 V140 L166 236 a10 10 0 0 0 9 14 h106 a10 10 0 0 0 9 -14 L250 140 V92"
        fill={GLASS}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <line x1={202} y1={92} x2={254} y2={92} stroke={INK} strokeWidth={2} strokeLinecap="round" />

      {/* gas bubbles */}
      <circle cx={226} cy={240} r={3} fill="none" stroke={INK} strokeWidth={0.9} />
      <circle cx={240} cy={228} r={2.4} fill="none" stroke={INK} strokeWidth={0.9} />
      <circle cx={214} cy={226} r={2} fill="none" stroke={INK} strokeWidth={0.9} />
      <circle cx={234} cy={212} r={1.8} fill="none" stroke={INK} strokeWidth={0.9} />

      {/* mouth of the tube */}
      <line x1={216} y1={40} x2={240} y2={40} stroke={INK} strokeWidth={2} strokeLinecap="round" />

      {showLabels && (
        <g>
          <Leader x1={278} y1={74} x2={252} y2={74} />
          <T x={282} y={74} size={11}>
            Bông tẩm dung dịch E
          </T>

          <Leader x1={300} y1={200} x2={276} y2={214} />
          <T x={304} y={196} size={11}>
            Bình tam giác
          </T>

          <Leader x1={150} y1={60} x2={218} y2={52} />
          <T x={146} y={60} size={11} anchor="end" italic>
            Khí SO₂
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 3. CÂU 16 — LÀM KHÔ SO₂ BẰNG CHẤT RẮN T
 * ========================================================================== */
function So2DryingSvg({ showLabels }: { showLabels: boolean }) {
  const bottles = [
    { x: 66, label: "1" },
    { x: 288, label: "2" },
  ];

  return (
    <svg viewBox="0 0 480 320" className="h-auto w-full select-none">
      {bottles.map((b, bi) => {
        const { x } = b;
        return (
          <g key={bi}>
            {/* neck + stopper */}
            <rect
              x={x + 38}
              y={150}
              width={30}
              height={22}
              fill={GLASS}
              stroke={INK}
              strokeWidth={1.5}
            />
            <rect
              x={x + 34}
              y={140}
              width={38}
              height={12}
              rx={3}
              fill="#eef2f7"
              stroke={INK}
              strokeWidth={1.5}
            />
            {/* body */}
            <rect
              x={x}
              y={172}
              width={106}
              height={106}
              rx={9}
              fill={GLASS}
              stroke={INK}
              strokeWidth={1.6}
            />
          </g>
        );
      })}

      {/* bottle 1: solid desiccant T */}
      <path d="M66 220 H172" {...hair} strokeDasharray="4 3" />
      <g stroke={INK} strokeWidth={1.1} fill="#fff">
        <circle cx={92} cy={244} r={7} />
        <circle cx={114} cy={256} r={6} />
        <circle cx={138} cy={242} r={6.5} />
        <circle cx={156} cy={256} r={5.5} />
        <circle cx={84} cy={260} r={5} />
      </g>

      {/* inlet tube (left) → down into bottle 1 */}
      <path d="M40 112 H112 V256" {...stroke} strokeWidth={2.2} />
      <Arrow x1={40} y1={112} x2={22} y2={112} />

      {/* bottle 1 → bottle 2 */}
      <path d="M126 140 V100 H334 V256" {...stroke} strokeWidth={2.2} />

      {/* bottle 2: collected dry gas */}
      <path d="M288 236 H394" {...hair} strokeDasharray="4 3" />
      <circle cx={318} cy={256} r={2.6} fill="none" stroke={INK} strokeWidth={0.9} />
      <circle cx={336} cy={246} r={2.2} fill="none" stroke={INK} strokeWidth={0.9} />
      <circle cx={356} cy={258} r={2.4} fill="none" stroke={INK} strokeWidth={0.9} />

      {/* outlet (right) */}
      <path d="M348 140 V84 H432" {...stroke} strokeWidth={2.2} />
      <Arrow x1={448} y1={84} x2={470} y2={84} />

      {showLabels && (
        <g>
          <T x={18} y={132} size={11} italic>
            SO₂ + hơi ẩm
          </T>

          <Leader x1={196} y1={232} x2={150} y2={248} />
          <T x={200} y={232} size={11}>
            Chất rắn T
          </T>

          <T x={452} y={64} size={11} italic anchor="end">
            SO₂ khô
          </T>

          <T x={216} y={302} size={10.5} italic fill={INK_SOFT} anchor="middle">
            Bình (1): làm khô — Bình (2): thu khí
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 4. CÂU 35 — BỘT HÚT ẨM THỂ THAO (magnesium sulfate)
 * ========================================================================== */
function Mgso4ChalkSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 460 300" className="h-auto w-full select-none">
      {/* powder heap on the bench */}
      <path
        d="M96 262 q52 -34 104 0 z"
        fill="#fff"
        stroke={INK}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M118 258 q28 -16 58 0" {...hair} strokeDasharray="3 3" />

      {/* chalk block */}
      <g>
        <path
          d="M196 156 L228 128 H324 L292 156 Z"
          fill="#fff"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <rect x={196} y={156} width={96} height={58} fill="#fff" stroke={INK} strokeWidth={1.5} />
        <path
          d="M292 156 L324 128 V186 L292 214 Z"
          fill="#f1f5f9"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* chalk texture */}
        <g fill={INK} opacity={0.35}>
          <circle cx={214} cy={172} r={1.2} />
          <circle cx={232} cy={186} r={1} />
          <circle cx={250} cy={170} r={1.1} />
          <circle cx={268} cy={190} r={1} />
          <circle cx={240} cy={204} r={1.2} />
          <circle cx={214} cy={198} r={0.9} />
        </g>
        <path d="M292 156 V214" {...hair} strokeDasharray="4 3" />
      </g>

      {/* powder drifting down from the block */}
      <g fill={INK} opacity={0.7}>
        <circle cx={206} cy={226} r={1.6} />
        <circle cx={218} cy={238} r={1.2} />
        <circle cx={232} cy={230} r={1.4} />
        <circle cx={246} cy={242} r={1.1} />
        <circle cx={258} cy={232} r={1.5} />
      </g>

      {showLabels && (
        <g>
          <Leader x1={330} y1={146} x2={392} y2={128} />
          <T x={452} y={126} size={11} anchor="end">
            Viên phấn thể thao
          </T>

          <Leader x1={168} y1={232} x2={120} y2={244} />
          <T x={116} y={244} size={11} anchor="end">
            Bột hút ẩm
          </T>

          <T x={230} y={88} anchor="middle" size={11} italic fill={INK_SOFT}>
            Thành phần chính: MgSO₄
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 5. CÂU 43 — ĐUN NÓNG HỖN HỢP Fe + S
 * ========================================================================== */
function FeSLabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 420 320" className="h-auto w-full select-none">
      {/* test tube */}
      <path
        d="M170 42 V218 a26 26 0 0 0 52 0 V42"
        fill={GLASS}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <line x1={166} y1={42} x2={226} y2={42} stroke={INK} strokeWidth={2} strokeLinecap="round" />

      {/* Fe + S mixture */}
      <path
        d="M172 206 a24 8 0 0 0 48 0 V218 a26 26 0 0 1 -48 0 Z"
        fill="#e2e8f0"
        stroke={INK}
        strokeWidth={1.1}
      />
      <g fill={INK}>
        <circle cx={184} cy={214} r={1.7} />
        <circle cx={196} cy={220} r={1.5} />
        <circle cx={207} cy={213} r={1.8} />
        <circle cx={194} cy={230} r={1.4} />
        <circle cx={208} cy={226} r={1.6} />
      </g>

      {/* clamp */}
      <g stroke={INK} strokeWidth={1.4} fill="none">
        <path d="M226 120 h18" />
        <path d="M244 108 v24" />
        <path d="M252 100 v40" strokeWidth={2} />
      </g>

      {/* flame + burner */}
      <Flame cx={196} baseY={276} h={30} />
      <Burner cx={196} y={278} />

      {showLabels && (
        <g>
          <Leader x1={148} y1={214} x2={172} y2={210} />
          <T x={144} y={214} size={11} anchor="end">
            Hỗn hợp bột Fe, S
          </T>

          <Leader x1={250} y1={300} x2={232} y2={292} />
          <T x={254} y={300} size={11}>
            Đèn cồn
          </T>

          <Leader x1={272} y1={124} x2={258} y2={124} />
          <T x={276} y={124} size={11}>
            Kẹp gỗ
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 6. CÂU 44 — ĐỐT SULFUR TRONG BÌNH OXY
 * ========================================================================== */
function SO2LabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 440 320" className="h-auto w-full select-none">
      {/* gas jar */}
      <path
        d="M160 92 V266 a10 10 0 0 0 10 10 h100 a10 10 0 0 0 10 -10 V92"
        fill={GLASS}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <line x1={152} y1={92} x2={288} y2={92} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M160 96 h120" {...hair} strokeDasharray="3 3" />

      {/* combustion spoon (thìa đốt) */}
      <line x1={220} y1={34} x2={220} y2={188} {...stroke} />
      <path d="M196 188 h48" {...stroke} />
      <path d="M196 188 q24 20 48 0" fill="#fff" stroke={INK} strokeWidth={1.5} />
      {/* sulfur + flame inside the spoon */}
      <path d="M208 190 q12 -8 24 0 z" fill="#e2e8f0" stroke={INK} strokeWidth={1} />
      <Flame cx={220} baseY={190} h={24} />

      {showLabels && (
        <g>
          <Leader x1={292} y1={112} x2={272} y2={120} />
          <T x={296} y={112} size={11} italic>
            Khí O₂
          </T>

          <Leader x1={278} y1={196} x2={250} y2={194} />
          <T x={282} y={196} size={11}>
            Thìa đốt
          </T>

          <Leader x1={150} y1={150} x2={212} y2={168} />
          <T x={146} y={150} size={11} anchor="end">
            Bột sulfur đang cháy
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 7. CÂU 45 — Cu + H₂SO₄ đặc, nút bông tẩm NaOH
 * ========================================================================== */
function CuH2so4LabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 420 320" className="h-auto w-full select-none">
      {/* test tube */}
      <path
        d="M172 48 V216 a26 26 0 0 0 52 0 V48"
        fill={GLASS}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <line x1={168} y1={48} x2={228} y2={48} stroke={INK} strokeWidth={2} strokeLinecap="round" />

      {/* cotton plug with NaOH */}
      <ellipse cx={198} cy={54} rx={24} ry={10} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <path d="M184 50 q6 5 0 9" {...hair} />
      <path d="M198 49 q6 5 0 10" {...hair} />
      <path d="M211 50 q6 5 0 9" {...hair} />

      {/* acid level */}
      <path d="M174 170 a24 8 0 0 0 48 0" fill="#f1f5f9" stroke={INK} strokeWidth={1.1} />
      <path
        d="M174 170 a24 8 0 0 0 48 0 V216 a26 26 0 0 1 -48 0 Z"
        fill="#eef2f7"
        stroke="none"
      />

      {/* Cu turnings */}
      <g stroke={INK} strokeWidth={1.2} fill="none">
        <path d="M182 204 q6 -8 12 0 q-6 8 -12 0" />
        <path d="M198 214 q7 -9 14 0 q-7 9 -14 0" />
        <path d="M184 222 q5 -6 10 0" />
      </g>

      {/* bubbles in the acid */}
      <g fill="none" stroke={INK} strokeWidth={0.9}>
        <circle cx={190} cy={188} r={2} />
        <circle cx={206} cy={178} r={1.6} />
        <circle cx={198} cy={162} r={1.4} />
      </g>

      {/* flame + burner */}
      <Flame cx={198} baseY={272} h={30} />
      <Burner cx={198} y={272} />

      {showLabels && (
        <g>
          <Leader x1={252} y1={56} x2={222} y2={54} />
          <T x={256} y={56} size={11}>
            Bông tẩm NaOH
          </T>

          <Leader x1={264} y1={170} x2={222} y2={172} />
          <T x={268} y={170} size={11} italic>
            H₂SO₄ đặc
          </T>

          <Leader x1={146} y1={216} x2={182} y2={214} />
          <T x={142} y={216} size={11} anchor="end">
            Dây/mảnh Cu
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 8. CÂU 46 — H₂SO₄ đặc làm hóa than đường mía
 * ========================================================================== */
function SugarH2so4LabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 440 330" className="h-auto w-full select-none">
      {/* black porous carbon column */}
      <path
        d="M184 252
           C178 228 188 212 182 194
           C176 176 188 160 184 144
           C182 132 194 118 202 104
           C212 116 218 130 214 144
           C210 160 224 176 218 194
           C212 212 224 228 218 252 Z"
        fill="#1f2937"
        stroke={INK}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <g fill="#e2e8f0" opacity={0.9}>
        <circle cx={204} cy={122} r={2.2} />
        <circle cx={212} cy={146} r={1.8} />
        <circle cx={196} cy={164} r={2.4} />
        <circle cx={210} cy={188} r={1.9} />
        <circle cx={197} cy={212} r={2.2} />
        <circle cx={212} cy={236} r={1.8} />
        <circle cx={202} cy={136} r={1.4} />
      </g>

      {/* steam */}
      <g {...thin} strokeDasharray="4 3" opacity={0.8}>
        <path d="M238 100 q10 -12 0 -24 q-10 -12 0 -22" />
        <path d="M262 108 q10 -12 0 -24 q-10 -12 0 -20" />
        <path d="M182 108 q-10 -12 0 -24 q10 -12 0 -20" />
      </g>

      {/* beaker */}
      <path
        d="M158 150 V272 a12 12 0 0 0 12 12 h100 a12 12 0 0 0 12 -12 V150"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* single spout on the left */}
      <path
        d="M158 150 q-16 -2 -16 8 q0 8 16 8"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <line x1={282} y1={150} x2={282} y2={284} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      {/* graduation marks */}
      <g {...hair}>
        <path d="M270 186 h12" />
        <path d="M270 216 h12" />
        <path d="M270 246 h12" />
      </g>

      {/* sugar layer */}
      <path d="M160 254 H280 V262 a12 12 0 0 1 -12 22 H172 a12 12 0 0 1 -12 -22 Z" fill="#e2e8f0" stroke="none" />
      <g fill={INK} opacity={0.6}>
        <circle cx={176} cy={268} r={1.5} />
        <circle cx={194} cy={274} r={1.3} />
        <circle cx={242} cy={272} r={1.4} />
        <circle cx={262} cy={266} r={1.6} />
      </g>

      {/* dropping funnel */}
      <path d="M330 52 h26 l-13 30 z" fill="#fff" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <line x1={343} y1={82} x2={343} y2={100} {...stroke} />
      <path d="M343 98 q0 6 -2 8" {...thin} />
      <line x1={330} y1={52} x2={356} y2={52} stroke={INK} strokeWidth={2} strokeLinecap="round" />

      {showLabels && (
        <g>
          <Leader x1={386} y1={66} x2={358} y2={64} />
          <T x={432} y={62} size={11} italic anchor="end">
            H₂SO₄ đặc
          </T>

          <Leader x1={298} y1={164} x2={232} y2={164} />
          <T x={302} y={164} size={11}>
            Cột than xốp (C)
          </T>

          <Leader x1={150} y1={268} x2={178} y2={272} />
          <T x={146} y={268} size={11} anchor="end">
            Đường mía
          </T>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * 9. CÂU 47 — 3 GIAI ĐOẠN SẢN XUẤT H₂SO₄ (phương pháp tiếp xúc)
 * ========================================================================== */
function ContactProcessSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 560 280" className="h-auto w-full select-none">
      {[
        { x: 20, n: "1" },
        { x: 208, n: "2" },
        { x: 396, n: "3" },
      ].map((b) => (
        <g key={b.n}>
          <circle cx={b.x + 76} cy={40} r={13} fill="#fff" stroke={INK} strokeWidth={1.4} />
          <T x={b.x + 76} y={40.5} anchor="middle" size={12} weight={700}>
            {b.n}
          </T>
          <line x1={b.x + 76} y1={54} x2={b.x + 76} y2={66} stroke={INK} strokeWidth={1.2} />
        </g>
      ))}

      {/* stage boxes */}
      <rect x={20} y={66} width={152} height={104} rx={6} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <rect x={208} y={66} width={152} height={104} rx={6} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <rect x={396} y={66} width={152} height={104} rx={6} fill="#fff" stroke={INK} strokeWidth={1.5} />

      {/* stage 1 */}
      <T x={96} y={96} anchor="middle" size={12}>
        S + O₂
      </T>
      <Arrow x1={96} y1={104} x2={96} y2={124} />
      <T x={96} y={140} anchor="middle" size={12} weight={700}>
        SO₂
      </T>
      <T x={96} y={160} anchor="middle" size={9.5} italic fill={INK_SOFT}>
        (đốt quặng / đốt S)
      </T>

      {/* stage 2 */}
      <T x={284} y={94} anchor="middle" size={12}>
        2SO₂ + O₂ ⇌ 2SO₃
      </T>
      <T x={284} y={118} anchor="middle" size={9.5} italic fill={INK_SOFT}>
        V₂O₅, 450–500 °C
      </T>
      <T x={284} y={146} anchor="middle" size={12} weight={700}>
        2SO₃
      </T>

      {/* stage 3 */}
      <T x={472} y={92} anchor="middle" size={11.5}>
        SO₃ + H₂SO₄
      </T>
      <Arrow x1={472} y1={102} x2={472} y2={120} />
      <T x={472} y={134} anchor="middle" size={11.5}>
        H₂SO₄·nSO₃
      </T>
      <T x={472} y={158} anchor="middle" size={9.5} italic fill={INK_SOFT}>
        (oleum) → H₂SO₄ 98%
      </T>

      {/* connecting arrows */}
      <Arrow x1={176} y1={118} x2={204} y2={118} />
      <Arrow x1={364} y1={118} x2={392} y2={118} />

      {showLabels && (
        <g>
          <T x={96} y={196} anchor="middle" size={10} italic fill={INK_SOFT}>
            Giai đoạn 1: tạo SO₂
          </T>
          <T x={284} y={196} anchor="middle" size={10} italic fill={INK_SOFT}>
            Giai đoạn 2: oxi hóa SO₂
          </T>
          <T x={460} y={196} anchor="middle" size={9.2} italic fill={INK_SOFT}>
            Giai đoạn 3: hấp thụ SO₃
          </T>

          <T x={280} y={236} anchor="middle" size={10.5} italic fill={INK_SOFT}>
            Sơ đồ 3 giai đoạn sản xuất sulfuric acid (phương pháp tiếp xúc)
          </T>
        </g>
      )}
    </svg>
  );
}
