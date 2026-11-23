import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Secondary font (badges, numbers, formulas): not preloaded, so it does not
// compete with the main text font and the JavaScript on first load. The
// browser fetches only the weights that are actually used on screen.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const title = "ChemLab 11 | Hệ Thống Ôn Luyện Lý Thuyết Hóa Học 11 – Sulfur & Hợp Chất";
const description =
  "Nền tảng ôn tập và luyện thi 47 câu hỏi Lý thuyết Hóa 11 (Sulfur, Sulfur dioxide, Sulfuric acid - Sulfate, Đúng/Sai thí nghiệm) với hình vẽ chuẩn phòng lab, ôn câu sai, ôn từng phần và xáo trộn thông minh.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "ChemLab 11",
  // Stop iOS from turning numbers in questions into phone links
  formatDetection: { telephone: false, date: false, address: false, email: false },
  appleWebApp: {
    capable: true,
    title: "ChemLab 11",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "ChemLab 11",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f766e",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-teal-600 selection:text-white">
        {children}
        {/* Scroll-reveal sections stay visible when JavaScript is unavailable */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
