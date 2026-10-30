import type { Metadata } from "next";
import {
  Bebas_Neue,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { GameModalProvider } from "@/components/GameModalContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "COURTSIDE NBA | Calendário, Jogador da Semana, MVPs & História",
  description:
    "Experiência interativa completa sobre a NBA com efeito parallax, calendário oficial em tempo real, jogador da semana, MVPs dos jogos, estatísticas e 80 anos de história.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebas.variable} ${jakarta.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050608] text-slate-50 bg-court-grid">
        <GameModalProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </GameModalProvider>
      </body>
    </html>
  );
}
