import type { Metadata } from "next";
import { Prompt, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "แจนพอน สตูดิโอ | ถ่ายภาพ Wedding รับปริญญา Portfolio และ Event",
    template: "%s | แจนพอน สตูดิโอ",
  },
  description:
    "จองคิวถ่ายภาพออนไลน์ ตรวจวันว่าง เลือกช่างภาพ และชำระมัดจำผ่าน PromptPay ได้ทันที — Wedding, รับปริญญา, Portfolio และ Event",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}