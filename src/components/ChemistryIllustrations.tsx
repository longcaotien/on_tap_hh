"use client";

import React, { useState } from "react";
import { IllustrationId } from "@/data/chemistryQuestions";
import { ZoomIn, ZoomOut, Sparkles } from "lucide-react";

interface Props {
  id: IllustrationId;
  caption?: string;
}

export function ChemistryIllustration({ id, caption }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="my-4 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 shadow-sm overflow-hidden transition-all">
      {/* Top Lab Diagram Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/80 border-b border-slate-200/70 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span className="inline-flex h-2 w-2 rounded-full bg-teal-600"></span>
          <span>Hình vẽ mô phỏng chuẩn hóa học (Vector CAD)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              showLabels
                ? "bg-teal-600/10 text-teal-800 border border-teal-600/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showLabels ? "Đang hiện chú thích" : "Hiện chú thích"}
          </button>
          <button
            type="button"
            onClick={() => setZoomed((v) => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-medium transition-colors"
            title={zoomed ? "Thu nhỏ" : "Phóng to hình"}
          >
            {zoomed ? (
              <>
                <ZoomOut className="w-3.5 h-3.5" /> Thu nhỏ
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5" /> Phóng to
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main SVG Canvas */}
      <div
        className={`flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
          zoomed ? "min-h-[360px] bg-white" : "min-h-[230px]"
        }`}
      >
        <div className={`w-full transition-all duration-300 ${zoomed ? "max-w-2xl" : "max-w-lg"}`}>
          {id === "s8_ring" && <S8RingSvg showLabels={showLabels} />}
          {id === "so2_collection" && <So2CollectionSvg showLabels={showLabels} />}
          {id === "so2_drying" && <So2DryingSvg showLabels={showLabels} />}
          {id === "mgso4_chalk" && <Mgso4ChalkSvg showLabels={showLabels} />}
          {id === "fe_s_lab" && <FeSLabSvg showLabels={showLabels} />}
          {id === "s_o2_lab" && <SO2LabSvg showLabels={showLabels} />}
          {id === "cu_h2so4_lab" && <CuH2so4LabSvg showLabels={showLabels} />}
          {id === "sugar_h2so4_lab" && <SugarH2so4LabSvg showLabels={showLabels} />}
          {id === "contact_process" && <ContactProcessSvg showLabels={showLabels} />}
        </div>
      </div>

      {caption && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/60 text-center text-xs sm:text-sm text-slate-600 italic">
          {caption}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * CÂU 11: MÔ HÌNH PHÂN TỬ MẠCH VÒNG S₈ (CROWN STRUCTURE)
 * ============================================================================ */
function S8RingSvg({ showLabels }: { showLabels: boolean }) {
  // Crown conformation coordinates for 8 sulfur atoms:
  // Back upper (S7, S3), Front upper (S1, S5), Back lower (S8, S6), Front lower (S2, S4)
  return (
    <svg viewBox="0 0 500 240" className="w-full h-auto select-none">
      <defs>
        {/* 3D Yellow Sulfur Atom Sphere Gradient */}
        <radialGradient id="sulfurBall" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#FACC15" />
          <stop offset="75%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#713F12" />
        </radialGradient>
        {/* Back Atom Slightly Darker for 3D Depth */}
        <radialGradient id="sulfurBallBack" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#EAB308" />
          <stop offset="85%" stopColor="#A16207" />
          <stop offset="100%" stopColor="#422006" />
        </radialGradient>
        {/* Cylindrical Covalent Bond Gradient */}
        <linearGradient id="bondGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="45%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <filter id="dropShadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Subtle Ground Reflection Ellipse */}
      <ellipse cx="250" cy="212" rx="170" ry="14" fill="#E2E8F0" opacity="0.65" />

      <g filter="url(#dropShadow)">
        {/* BACK LAYER BONDS: S6(195,126) - S7(250,64) - S8(305,126) */}
        <line x1="195" y1="126" x2="250" y2="64" stroke="url(#bondGrad)" strokeWidth="13" strokeLinecap="round" />
        <line x1="250" y1="64" x2="305" y2="126" stroke="url(#bondGrad)" strokeWidth="13" strokeLinecap="round" />

        {/* SIDE BACK BONDS: S5(115,68) - S6(195,126) and S8(305,126) - S1(385,68) */}
        <line x1="115" y1="68" x2="195" y2="126" stroke="url(#bondGrad)" strokeWidth="14" strokeLinecap="round" />
        <line x1="305" y1="126" x2="385" y2="68" stroke="url(#bondGrad)" strokeWidth="14" strokeLinecap="round" />

        {/* BACK ATOMS: S6 (195,126), S7 (250,64), S8 (305,126) */}
        <circle cx="195" cy="126" r="21" fill="url(#sulfurBallBack)" />
        <circle cx="305" cy="126" r="21" fill="url(#sulfurBallBack)" />
        <circle cx="250" cy="64" r="22" fill="url(#sulfurBallBack)" />

        {/* SIDE FRONT BONDS: S5(115,68) - S4(148,162) and S1(385,68) - S2(352,162) */}
        <line x1="115" y1="68" x2="148" y2="162" stroke="url(#bondGrad)" strokeWidth="15" strokeLinecap="round" />
        <line x1="385" y1="68" x2="352" y2="162" stroke="url(#bondGrad)" strokeWidth="15" strokeLinecap="round" />

        {/* OUTER UPPER ATOMS: S5 (115,68) & S1 (385,68) */}
        <circle cx="115" cy="68" r="23" fill="url(#sulfurBall)" />
        <circle cx="385" cy="68" r="23" fill="url(#sulfurBall)" />

        {/* FRONT BONDS: S4(148,162) - S3(250,104) - S2(352,162) */}
        <line x1="148" y1="162" x2="250" y2="104" stroke="url(#bondGrad)" strokeWidth="16" strokeLinecap="round" />
        <line x1="250" y1="104" x2="352" y2="162" stroke="url(#bondGrad)" strokeWidth="16" strokeLinecap="round" />

        {/* FRONT LOWER ATOMS: S4 (148,162) & S2 (352,162) */}
        <circle cx="148" cy="162" r="25" fill="url(#sulfurBall)" />
        <circle cx="352" cy="162" r="25" fill="url(#sulfurBall)" />

        {/* CENTER FRONT ATOM: S3 (250,104) */}
        <circle cx="250" cy="104" r="27" fill="url(#sulfurBall)" />
      </g>

      {/* Atom Numbering & Formula Callout when showLabels is active */}
      {showLabels && (
        <g className="font-mono text-xs font-bold">
          <text x="250" y="69" textAnchor="middle" fill="#422006" fontSize="13">S₁</text>
          <text x="305" y="131" textAnchor="middle" fill="#422006" fontSize="13">S₂</text>
          <text x="385" y="73" textAnchor="middle" fill="#422006" fontSize="14">S₃</text>
          <text x="352" y="167" textAnchor="middle" fill="#422006" fontSize="14">S₄</text>
          <text x="250" y="110" textAnchor="middle" fill="#422006" fontSize="15">S₅</text>
          <text x="148" y="167" textAnchor="middle" fill="#422006" fontSize="14">S₆</text>
          <text x="115" y="73" textAnchor="middle" fill="#422006" fontSize="14">S₇</text>
          <text x="195" y="131" textAnchor="middle" fill="#422006" fontSize="13">S₈</text>

          <rect x="170" y="196" width="160" height="26" rx="13" fill="#FEF9C3" stroke="#EAB308" strokeWidth="1.2" />
          <text x="250" y="213" textAnchor="middle" fill="#854D0E" fontSize="12">
            Phân tử mạch vòng S₈ (8 nguyên tử)
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 15: SƠ ĐỒ THU KHÍ SO₂ VÀO BÌNH TAM GIÁC CÓ BÔNG TẨM DUNG DỊCH E
 * ============================================================================ */
function So2CollectionSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 460 270" className="w-full h-auto select-none">
      <defs>
        <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.65" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="80%" stopColor="#F0F9FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="cottonGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>
        <marker id="arrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0F172A" />
        </marker>
      </defs>

      {/* Lab Bench Surface */}
      <line x1="90" y1="242" x2="370" y2="242" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Subtle SO2 Gas Accumulation inside Erlenmeyer Flask */}
      <path
        d="M 212 95 L 172 225 Q 168 238 182 238 L 288 238 Q 302 238 298 225 L 258 95 Z"
        fill="#FEF08A"
        opacity="0.22"
      />

      {/* Erlenmeyer Flask (Bình tam giác) Outline & Glass Shading */}
      <path
        d="M 216 74 L 216 96 L 170 226 Q 165 240 182 240 L 288 240 Q 305 240 300 226 L 254 96 L 254 74"
        fill="url(#glassBody)"
        stroke="#1E293B"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Flask Lip Rim */}
      <ellipse cx="235" cy="74" rx="22" ry="4" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />

      {/* Flask Glass Specular Highlight */}
      <path
        d="M 215 110 L 182 218"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Graduation Marks on Erlenmeyer Flask */}
      <line x1="258" y1="145" x2="268" y2="145" stroke="#64748B" strokeWidth="1.5" />
      <line x1="265" y1="175" x2="278" y2="175" stroke="#64748B" strokeWidth="1.5" />
      <line x1="272" y1="205" x2="288" y2="205" stroke="#64748B" strokeWidth="1.5" />

      {/* Cotton Plug Soaked in Solution E (Bông tẩm dung dịch E) at Mouth of Flask */}
      <g>
        <circle cx="225" cy="73" r="11" fill="url(#cottonGrad)" stroke="#475569" strokeWidth="1.3" />
        <circle cx="244" cy="74" r="11.5" fill="url(#cottonGrad)" stroke="#475569" strokeWidth="1.3" />
        <circle cx="235" cy="67" r="10.5" fill="url(#cottonGrad)" stroke="#475569" strokeWidth="1.3" />
        <circle cx="235" cy="78" r="10" fill="url(#cottonGrad)" stroke="#475569" strokeWidth="1.2" />
      </g>

      {/* Bent Glass Delivery Tube (Ống dẫn khí SO₂) */}
      <path
        d="M 140 44 L 235 44 L 235 224"
        fill="none"
        stroke="#0F172A"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 140 44 L 235 44 L 235 224"
        fill="none"
        stroke="#E0F2FE"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gas Flow Arrow at Top Left (SO₂ ->) */}
      <line
        x1="140"
        y1="30"
        x2="188"
        y2="30"
        stroke="#0F172A"
        strokeWidth="1.8"
        markerEnd="url(#arrowHead)"
      />
      <text x="162" y="23" textAnchor="middle" fill="#0F172A" className="font-serif text-sm font-semibold">
        SO₂
      </text>

      {/* Callout Line & Label for "Bông" exactly like the exam sheet */}
      <line x1="250" y1="68" x2="294" y2="42" stroke="#0F172A" strokeWidth="1.5" />
      <text x="298" y="44" fill="#0F172A" className="font-serif text-sm font-semibold">
        Bông
      </text>

      {/* Extra Educational Annotations when showLabels is enabled */}
      {showLabels && (
        <g>
          {/* Rising/settling SO2 bubbles at bottom of tube */}
          <circle cx="222" cy="218" r="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="247" cy="212" r="3.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="228" cy="198" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />

          <rect x="296" y="54" width="148" height="44" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1" />
          <text x="304" y="72" fill="#166534" fontSize="11" fontWeight="600">
            Dung dịch E: Nước vôi
          </text>
          <text x="304" y="88" fill="#15803D" fontSize="10.5">
            Ca(OH)₂ giữ khí độc SO₂
          </text>

          <text x="235" y="258" textAnchor="middle" fill="#475569" fontSize="11.5" fontWeight="500">
            Bình tam giác thu khí SO₂ (nặng hơn không khí, M = 64)
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 16: SƠ ĐỒ LÀM KHÔ KHÍ SO₂ BẰNG HẠT CHẤT RẮN T VÀ THU KHÍ SO₂ KHÔ
 * ============================================================================ */
function So2DryingSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 540 270" className="w-full h-auto select-none">
      <defs>
        <linearGradient id="bottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.65" />
        </linearGradient>
        <pattern id="desiccantPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#E2E8F0" />
          <circle cx="3" cy="3" r="2" fill="#64748B" />
          <circle cx="8" cy="6" r="2.2" fill="#475569" />
          <circle cx="4" cy="8" r="1.6" fill="#94A3B8" />
        </pattern>
        <marker id="arrowFlow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0F172A" />
        </marker>
      </defs>

      {/* Base Line */}
      <line x1="90" y1="242" x2="450" y2="242" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

      {/* ==================== LEFT BOTTLE (BÌNH LÀM KHÔ CHỨA CHẤT T) ==================== */}
      {/* Bottle Body */}
      <path
        d="M 158 76 L 158 102 Q 134 106 134 126 L 134 228 Q 134 240 146 240 L 206 240 Q 218 240 218 228 L 218 126 Q 218 106 194 102 L 194 76 Z"
        fill="url(#bottleGlass)"
        stroke="#1E293B"
        strokeWidth="2.2"
      />
      {/* Rubber Stopper Left */}
      <rect x="155" y="68" width="42" height="14" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />

      {/* Solid Desiccant T Bed at Bottom of Left Bottle */}
      <path
        d="M 136 178 L 216 178 L 216 228 Q 216 238 205 238 L 147 238 Q 136 238 136 228 Z"
        fill="url(#desiccantPattern)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Dashed Surface Line above Solid T */}
      <line x1="136" y1="172" x2="216" y2="172" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* ==================== RIGHT BOTTLE (BÌNH THU KHÍ SO₂ KHÔ) ==================== */}
      <path
        d="M 332 76 L 332 102 Q 308 106 308 126 L 308 228 Q 308 240 320 240 L 380 240 Q 392 240 392 228 L 392 126 Q 392 106 368 102 L 368 76 Z"
        fill="url(#bottleGlass)"
        stroke="#1E293B"
        strokeWidth="2.2"
      />
      {/* Rubber Stopper Right */}
      <rect x="329" y="68" width="42" height="14" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />

      {/* ==================== GLASS TUBING SYSTEM ==================== */}
      {/* 1. Inlet Tube: Khí SO2 và hơi nước -> deep into Chất T */}
      <path
        d="M 110 52 L 166 52 L 166 222"
        fill="none"
        stroke="#0F172A"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 110 52 L 166 52 L 166 222"
        fill="none"
        stroke="#F8FAFC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inlet Arrow */}
      <line
        x1="102"
        y1="38"
        x2="152"
        y2="38"
        stroke="#0F172A"
        strokeWidth="1.7"
        markerEnd="url(#arrowFlow)"
      />
      <text x="125" y="28" textAnchor="middle" fill="#0F172A" className="font-serif text-xs sm:text-sm font-semibold">
        Khí SO₂ và hơi nước
      </text>

      {/* 2. Connecting Bridge Tube: Top of Left Bottle -> Deep into Right Bottle */}
      <path
        d="M 186 116 L 186 44 L 340 44 L 340 222"
        fill="none"
        stroke="#0F172A"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 186 116 L 186 44 L 340 44 L 340 222"
        fill="none"
        stroke="#F8FAFC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Right Bottle Short Vent Tube */}
      <path
        d="M 360 116 L 360 54"
        fill="none"
        stroke="#0F172A"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 360 116 L 360 54"
        fill="none"
        stroke="#F8FAFC"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* ==================== CALLOUT LABELS EXACTLY MATCHING EXAM SHEET ==================== */}
      {/* Pointer to Chất T */}
      <line x1="94" y1="158" x2="155" y2="202" stroke="#0F172A" strokeWidth="1.6" />
      <text x="52" y="158" fill="#0F172A" className="font-serif text-sm font-semibold">
        Chất T
      </text>

      {/* Pointer to Khí SO₂ khô */}
      <line x1="340" y1="138" x2="402" y2="86" stroke="#0F172A" strokeWidth="1.6" />
      <text x="392" y="78" fill="#0F172A" className="font-serif text-sm font-semibold">
        Khí SO₂ khô
      </text>

      {showLabels && (
        <g>
          <rect x="18" y="172" width="106" height="44" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <text x="71" y="190" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="700">
            T = P₂O₅ (rắn)
          </text>
          <text x="71" y="205" textAnchor="middle" fill="#1E40AF" fontSize="9.5">
            Không p/ứ với SO₂
          </text>

          <text x="176" y="258" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="500">
            Bình làm khô
          </text>
          <text x="350" y="258" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="500">
            Bình thu khí SO₂ khô
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 38: MINH HỌA CHẤT HÚT ẨM MỒ HÔI TAY VẬN ĐỘNG VIÊN (MgSO₄)
 * ============================================================================ */
function Mgso4ChalkSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 500 230" className="w-full h-auto select-none">
      <defs>
        <linearGradient id="chalkBowl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <radialGradient id="powderCloud" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#F1F5F9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark Gym Background Card */}
      <rect x="40" y="14" width="420" height="198" rx="16" fill="#0F172A" />
      {/* Gym Spotlight Glow */}
      <circle cx="250" cy="95" r="95" fill="#1E293B" />

      {/* Powder Cloud Particles */}
      <circle cx="250" cy="92" r="56" fill="url(#powderCloud)" />
      <circle cx="215" cy="78" r="32" fill="url(#powderCloud)" />
      <circle cx="285" cy="82" r="34" fill="url(#powderCloud)" />

      {/* Fine Powder Specks */}
      <g fill="#FFFFFF" opacity="0.85">
        <circle cx="195" cy="65" r="2" />
        <circle cx="212" cy="52" r="1.5" />
        <circle cx="288" cy="56" r="2.2" />
        <circle cx="305" cy="72" r="1.8" />
        <circle cx="235" cy="48" r="2.5" />
        <circle cx="264" cy="54" r="1.6" />
        <circle cx="222" cy="108" r="2.2" />
        <circle cx="278" cy="110" r="2" />
      </g>

      {/* Athlete Hands Coating in White Hygroscopic Powder */}
      <g stroke="#F8FAFC" strokeWidth="1.8" fill="#FDE68A">
        {/* Left Hand */}
        <path d="M 185 45 Q 210 62 235 76 Q 248 84 242 94 Q 232 100 212 90 L 172 68 Z" />
        {/* Right Hand */}
        <path d="M 315 45 Q 290 62 265 76 Q 252 84 258 94 Q 268 100 288 90 L 328 68 Z" />
      </g>
      {/* White Powder Layer on Hands */}
      <ellipse cx="248" cy="84" rx="26" ry="12" fill="#FFFFFF" opacity="0.92" />

      {/* Mound of White Magnesium Sulfate Powder inside the Tray */}
      <path d="M 168 138 Q 250 105 332 138 Z" fill="#FFFFFF" />
      <path d="M 185 138 Q 250 116 315 138 Z" fill="#F8FAFC" />

      {/* Red Gymnastics Chalk Basin (Khay đựng bột hút ẩm) */}
      <path
        d="M 142 134 L 358 134 L 334 192 Q 330 202 318 202 L 182 202 Q 170 202 166 192 Z"
        fill="url(#chalkBowl)"
        stroke="#FCA5A5"
        strokeWidth="1.5"
      />
      <rect x="135" y="128" width="230" height="10" rx="5" fill="#EF4444" stroke="#FECACA" strokeWidth="1" />

      {showLabels && (
        <g>
          <rect x="166" y="152" width="168" height="38" rx="8" fill="#FFFFFF" fillOpacity="0.95" />
          <text x="250" y="168" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700">
            Magnesium sulfate: MgSO₄
          </text>
          <text x="250" y="183" textAnchor="middle" fill="#0D9488" fontSize="10.5" fontWeight="600">
            MgSO₄ + 7H₂O ⟶ MgSO₄·7H₂O (Hút ẩm)
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 41: THÍ NGHIỆM ĐUN NÓNG HỖN HỢP BỘT Fe + S TRONG ỐNG NGHIỆM
 * ============================================================================ */
function FeSLabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 480 220" className="w-full h-auto select-none">
      {/* Alcohol Lamp (Đèn cồn) */}
      <path d="M 120 198 L 190 198 L 180 162 L 130 162 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
      <rect x="148" y="150" width="14" height="12" rx="2" fill="#64748B" />
      {/* Flame */}
      <path d="M 155 150 Q 138 125 155 102 Q 172 125 155 150 Z" fill="#F97316" opacity="0.85" />
      <path d="M 155 148 Q 146 130 155 114 Q 164 130 155 148 Z" fill="#FACC15" />

      {/* Tilted Test Tube (Ống nghiệm chịu nhiệt) */}
      <g transform="rotate(-28 210 110)">
        <rect x="130" y="92" width="180" height="28" rx="14" fill="#E0F2FE" fillOpacity="0.55" stroke="#1E293B" strokeWidth="2.2" />
        {/* Fe + S Mixture at Bottom of Tube */}
        <path d="M 132 106 Q 132 94 146 94 L 195 94 L 195 118 L 146 118 Q 132 118 132 106 Z" fill="#78716C" />
        <circle cx="152" cy="106" r="9" fill="#EF4444" opacity="0.75" />
        {/* Cotton Plug at Mouth */}
        <ellipse cx="306" cy="106" rx="10" ry="12" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
      </g>

      {showLabels && (
        <g fontSize="11.5" fontWeight="600" fill="#1E293B">
          <text x="330" y="52">Bông nút miệng ống nghiệm</text>
          <text x="220" y="148" fill="#B45309">Hỗn hợp Fe + S ⟶(t°) FeS (xám đen)</text>
          <text x="155" y="214" textAnchor="middle" fill="#475569">Đèn cồn (hơ đều rồi đun tập trung)</text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 42: THÍ NGHIỆM ĐỐT SULFUR TRONG BÌNH KHÍ OXYGEN
 * ============================================================================ */
function SO2LabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 480 230" className="w-full h-auto select-none">
      {/* Gas Jar Containing O2 */}
      <rect x="180" y="48" width="120" height="160" rx="12" fill="#E0F2FE" fillOpacity="0.45" stroke="#1E293B" strokeWidth="2.2" />
      {/* Rubber Stopper */}
      <rect x="208" y="34" width="64" height="18" rx="3" fill="#475569" stroke="#1E293B" strokeWidth="1.6" />
      {/* Deflagrating Spoon (Muôi sắt) */}
      <line x1="240" y1="16" x2="240" y2="152" stroke="#334155" strokeWidth="3" />
      <path d="M 226 152 Q 240 168 254 152 Z" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      {/* Sulfur & Bright Blue Flame in O2 */}
      <circle cx="240" cy="142" r="24" fill="#38BDF8" opacity="0.3" />
      <path d="M 240 152 Q 222 128 240 102 Q 258 128 240 152 Z" fill="#0284C7" opacity="0.85" />
      <path d="M 240 150 Q 230 134 240 116 Q 250 134 240 150 Z" fill="#BAE6FD" />
      <ellipse cx="240" cy="151" rx="9" ry="4" fill="#FACC15" />

      {showLabels && (
        <g fontSize="11.5" fontWeight="600">
          <text x="315" y="95" fill="#0369A1">Bình chứa khí O₂ nguyên chất</text>
          <text x="315" y="135" fill="#0284C7">Ngọn lửa xanh sáng mãnh liệt</text>
          <text x="315" y="160" fill="#B45309">S + O₂ ⟶(t°) SO₂</text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 45: THÍ NGHIỆM Cu + H₂SO₄ ĐẶC NÓNG CÓ BÔNG TẨM NaOH
 * ============================================================================ */
function CuH2so4LabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 480 230" className="w-full h-auto select-none">
      {/* Vertical/Tilted Test Tube */}
      <rect x="206" y="42" width="48" height="145" rx="24" fill="#E0F2FE" fillOpacity="0.4" stroke="#1E293B" strokeWidth="2.2" />
      {/* CuSO4 Blue Solution & H2SO4 */}
      <path d="M 208 120 L 252 120 L 252 163 Q 252 185 230 185 Q 208 185 208 163 Z" fill="#38BDF8" fillOpacity="0.45" />
      {/* Copper Turnings (Lá Cu) */}
      <rect x="218" y="168" width="14" height="6" rx="2" fill="#EA580C" />
      <rect x="230" y="172" width="12" height="6" rx="2" fill="#C2410C" />
      {/* SO2 Gas Bubbles */}
      <circle cx="225" cy="150" r="3" fill="#FFFFFF" stroke="#0284C7" />
      <circle cx="236" cy="136" r="3.5" fill="#FFFFFF" stroke="#0284C7" />
      <circle cx="228" cy="126" r="2.8" fill="#FFFFFF" stroke="#0284C7" />
      {/* Cotton Soaked in NaOH */}
      <ellipse cx="230" cy="42" rx="22" ry="12" fill="#F1F5F9" stroke="#475569" strokeWidth="1.6" />

      {/* Flame Underneath */}
      <path d="M 230 215 Q 216 198 230 186 Q 244 198 230 215 Z" fill="#F97316" />

      {showLabels && (
        <g fontSize="11.5" fontWeight="600">
          <text x="270" y="46" fill="#0F766E">Bông tẩm dung dịch NaOH (ngăn SO₂)</text>
          <text x="270" y="135" fill="#0369A1">Dung dịch H₂SO₄ 70% chuyển xanh (CuSO₄)</text>
          <text x="270" y="175" fill="#C2410C">Lá đồng (Cu) + 2H₂SO₄(đ) → CuSO₄ + SO₂↑ + 2H₂O</text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 46: THÍ NGHIỆM H₂SO₄ ĐẶC TÁC DỤNG VỚI ĐƯỜNG MÍA (THAN HÓA)
 * ============================================================================ */
function SugarH2so4LabSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 480 230" className="w-full h-auto select-none">
      {/* Glass Beaker */}
      <path d="M 175 82 L 175 196 Q 175 208 188 208 L 272 208 Q 285 208 285 196 L 285 82" fill="#E0F2FE" fillOpacity="0.4" stroke="#1E293B" strokeWidth="2.4" />
      {/* Porous Black Carbon Column Rising Out of Beaker */}
      <path
        d="M 192 204 L 192 65 Q 194 34 228 32 Q 262 34 265 68 L 268 204 Z"
        fill="#1E293B"
        stroke="#0F172A"
        strokeWidth="2"
      />
      {/* Porous Texture */}
      <circle cx="215" cy="75" r="5" fill="#334155" />
      <circle cx="242" cy="95" r="6" fill="#334155" />
      <circle cx="220" cy="130" r="7" fill="#334155" />
      <circle cx="245" cy="160" r="5.5" fill="#334155" />
      <circle cx="212" cy="180" r="6" fill="#334155" />

      {showLabels && (
        <g fontSize="11.5" fontWeight="600">
          <text x="298" y="65" fill="#0F172A">Cột than đen xốp (Carbon - C)</text>
          <text x="298" y="95" fill="#B45309">Khí thoát ra: CO₂↑ và SO₂↑</text>
          <text x="298" y="125" fill="#0F766E">Chứng tỏ: Tính háo nước &amp; oxi hóa mạnh</text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================================
 * CÂU 47: SƠ ĐỒ 3 GIAI ĐOẠN SẢN XUẤT SULFURIC ACID (PHƯƠNG PHÁP TIẾP XÚC)
 * ============================================================================ */
function ContactProcessSvg({ showLabels }: { showLabels: boolean }) {
  return (
    <svg viewBox="0 0 540 200" className="w-full h-auto select-none">
      {/* Stage 1 Box */}
      <rect x="16" y="36" width="145" height="120" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <text x="88" y="62" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="700">
        GIAI ĐOẠN 1: LÒ ĐỐT
      </text>
      <text x="88" y="86" textAnchor="middle" fill="#78350F" fontSize="11" fontWeight="600">
        Đốt S hoặc quặng FeS₂
      </text>
      <text x="88" y="110" textAnchor="middle" fill="#B45309" fontSize="10.5">
        FeS₂ + O₂ ⟶ Fe₂O₃ + SO₂
      </text>
      {showLabels && (
        <text x="88" y="138" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="600">
          ⚠ Nguy cơ ô nhiễm SO₂
        </text>
      )}

      {/* Arrow 1 -> 2 */}
      <path d="M 164 96 L 192 96" stroke="#475569" strokeWidth="2.5" />

      {/* Stage 2 Box */}
      <rect x="196" y="36" width="148" height="120" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
      <text x="270" y="62" textAnchor="middle" fill="#075985" fontSize="12" fontWeight="700">
        GIAI ĐOẠN 2: TIẾP XÚC
      </text>
      <text x="270" y="86" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="600">
        2SO₂ + O₂ ⇌ 2SO₃
      </text>
      <text x="270" y="110" textAnchor="middle" fill="#0284C7" fontSize="10.5">
        Xúc tác V₂O₅, t° ≈ 450°C
      </text>
      {showLabels && (
        <text x="270" y="138" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="600">
          ΔᵣH°₂₉₈ = -196 kJ (&lt; 0)
        </text>
      )}

      {/* Arrow 2 -> 3 */}
      <path d="M 347 96 L 375 96" stroke="#475569" strokeWidth="2.5" />

      {/* Stage 3 Box */}
      <rect x="379" y="36" width="145" height="120" rx="12" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2" />
      <text x="451" y="62" textAnchor="middle" fill="#115E59" fontSize="12" fontWeight="700">
        GIAI ĐOẠN 3: HẤP THỤ
      </text>
      <text x="451" y="86" textAnchor="middle" fill="#0F766E" fontSize="11" fontWeight="600">
        Dùng H₂SO₄ đặc 98%
      </text>
      <text x="451" y="110" textAnchor="middle" fill="#0D9488" fontSize="10.5">
        Tạo Oleum: H₂SO₄·nSO₃
      </text>
      {showLabels && (
        <text x="451" y="138" textAnchor="middle" fill="#115E59" fontSize="10" fontWeight="600">
          Pha loãng ⟶ H₂SO₄(aq)
        </text>
      )}
    </svg>
  );
}
