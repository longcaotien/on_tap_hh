import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ChemLab 11 | Hệ Thống Ôn Luyện Lý Thuyết Hóa Học 11 – Sulfur & Hợp Chất",
  description:
    "Nền tảng ôn tập và luyện thi 47 câu hỏi Lý thuyết Hóa 11 (Sulfur, Sulfur dioxide, Sulfuric acid - Sulfate, Đúng/Sai thí nghiệm) với hình vẽ chuẩn phòng lab, ôn câu sai, ôn từng phần và xáo trộn thông minh.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-teal-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
